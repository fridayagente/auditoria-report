// Pricing
export const REPORT_PRICE_EUR = 29;
export const REPORT_PRICE_CENTS = REPORT_PRICE_EUR * 100;

// Score thresholds
export const SCORE_EXCELLENT = 80;
export const SCORE_GOOD = 60;

// Timeouts
export const WEBSITE_FETCH_TIMEOUT = 10000;
export const PDF_GENERATION_TIMEOUT = 30000;

// Claude
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
export const CLAUDE_MAX_TOKENS = 1000;
