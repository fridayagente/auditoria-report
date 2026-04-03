/**
 * @typedef {Object} AnalysisScores
 * @property {number} seo - SEO score (0-100)
 * @property {number} performance - Performance score (0-100)
 * @property {number} security - Security score (0-100)
 * @property {number} bestPractices - Best practices score (0-100)
 * @property {number} overall - Overall score (0-100)
 */

/**
 * @typedef {Object} ScoreWithClass
 * @property {number} score - Score value (0-100)
 * @property {string} class - CSS class (excellent, good, poor)
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} title - Recommendation title
 * @property {string} priority - Priority level (high, medium, low)
 * @property {string} impact - Expected impact description
 * @property {string} effort - Implementation effort (easy, medium, hard)
 */

/**
 * @typedef {Object} WebsiteAnalysis
 * @property {string} url - Analyzed website URL
 * @property {string} timestamp - Analysis timestamp
 * @property {Object} scores - All scores with classes
 * @property {Recommendation[]} recommendations - List of recommendations
 * @property {string[]} actionPlan - Top 3 action items
 * @property {Object} details - Technical details of the analysis
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} [error] - Error message if validation failed
 * @property {string} [data] - Valid data if validation passed
 */

export {};
