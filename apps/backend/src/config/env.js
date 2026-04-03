import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database (future)
  database: {
    url: process.env.DATABASE_URL || ''
  },

  // APIs
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    reportPriceEur: 29,
    reportPriceCents: 2900
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY,
    domain: process.env.RESEND_DOMAIN || 'noreply@auditoria-report.com'
  },

  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
    maxTokens: 1000
  },

  // Features
  features: {
    emailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
    stripePayments: process.env.ENABLE_STRIPE !== 'false',
    claudeAnalysis: process.env.ENABLE_CLAUDE !== 'false'
  },

  // Limits
  limits: {
    websiteFetchTimeout: 10000,
    pdfGenerationTimeout: 30000,
    maxUrlLength: 2048,
    maxConcurrentAnalyses: 10
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

export function validateConfig() {
  const required = ['STRIPE_SECRET_KEY', 'RESEND_API_KEY', 'CLAUDE_API_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    process.exit(1);
  }
}
