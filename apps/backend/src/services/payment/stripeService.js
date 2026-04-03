import Stripe from 'stripe';
import { config } from '../../config/env.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger('StripeService');

export class StripeService {
  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey);
  }

  async createCheckoutSession(email, analysis) {
    if (!config.features.stripePayments) {
      logger.warn('Stripe payments disabled');
      return null;
    }

    try {
      logger.info(`Creating Stripe checkout session`, { email, url: analysis.url });

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Website Audit Report',
                description: `Comprehensive audit for ${analysis.url}`
              },
              unit_amount: config.stripe.reportPriceCents
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${config.frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.frontendUrl}/cancel`,
        customer_email: email,
        metadata: {
          url: analysis.url,
          overall_score: analysis.scores.overall.score
        }
      });

      logger.info(`Checkout session created`, { sessionId: session.id });
      return session;
    } catch (error) {
      logger.error(`Failed to create checkout session`, { error: error.message });
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  async constructWebhookEvent(body, signature) {
    try {
      return this.stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripe.webhookSecret
      );
    } catch (error) {
      logger.error(`Webhook signature verification failed`, { error: error.message });
      throw new Error('Invalid webhook signature');
    }
  }

  async getSession(sessionId) {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      logger.error(`Failed to retrieve session`, { sessionId, error: error.message });
      throw new Error('Session not found');
    }
  }
}

export const stripeService = new StripeService();
