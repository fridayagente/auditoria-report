import { Resend } from 'resend';
import { config } from '../../config/env.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger('EmailService');

export class EmailService {
  constructor() {
    this.resend = new Resend(config.resend.apiKey);
  }

  async sendReportReady(email, analysis) {
    if (!config.features.emailNotifications) {
      logger.warn('Email notifications disabled');
      return null;
    }

    try {
      logger.info(`Sending report ready email`, { email });

      const result = await this.resend.emails.send({
        from: config.resend.domain,
        to: email,
        subject: `✅ Your Website Audit Report is Ready - ${analysis.url}`,
        html: this.buildReportReadyTemplate(analysis)
      });

      logger.info(`Email sent successfully`, { messageId: result.id });
      return result;
    } catch (error) {
      logger.error(`Failed to send email`, { email, error: error.message });
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async sendPaymentConfirmation(email, analysis, sessionId) {
    if (!config.features.emailNotifications) {
      logger.warn('Email notifications disabled');
      return null;
    }

    try {
      logger.info(`Sending payment confirmation email`, { email });

      const result = await this.resend.emails.send({
        from: config.resend.domain,
        to: email,
        subject: `💳 Payment Confirmed - Your Audit Report is Ready`,
        html: this.buildPaymentConfirmationTemplate(analysis, sessionId)
      });

      logger.info(`Confirmation email sent`, { messageId: result.id });
      return result;
    } catch (error) {
      logger.error(`Failed to send confirmation email`, { email, error: error.message });
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  buildReportReadyTemplate(analysis) {
    const { url, scores } = analysis;
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>✅ Your Website Audit Report is Ready!</h2>
        <p>We've completed the comprehensive audit for:</p>
        <p><strong>${url}</strong></p>
        
        <h3>Scores:</h3>
        <ul>
          <li>SEO: ${scores.seo.score}/100</li>
          <li>Performance: ${scores.performance.score}/100</li>
          <li>Security: ${scores.security.score}/100</li>
          <li>Best Practices: ${scores.bestPractices.score}/100</li>
          <li><strong>Overall: ${scores.overall.score}/100</strong></li>
        </ul>

        <p><a href="${config.frontendUrl}/report/${url}" style="padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">View Full Report</a></p>

        <p style="color: #666; font-size: 12px;">© Auditoría Report - Professional Website Analysis</p>
      </div>
    `;
  }

  buildPaymentConfirmationTemplate(analysis, sessionId) {
    const { url, scores } = analysis;
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>💳 Payment Confirmed</h2>
        <p>Thank you for your purchase! Your website audit report is ready to download.</p>
        
        <p><strong>Website:</strong> ${url}</p>
        <p><strong>Overall Score:</strong> ${scores.overall.score}/100</p>

        <p><a href="${config.frontendUrl}/download/${sessionId}" style="padding: 10px 20px; background: #38ef7d; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">📥 Download Your Report</a></p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">© Auditoría Report - Professional Website Analysis</p>
      </div>
    `;
  }
}

export const emailService = new EmailService();
