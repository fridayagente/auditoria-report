/**
 * ANALYSIS RESULTS COMPONENT
 * 
 * Displays audit results with scores and recommendations
 */

import ScoreCard from './ScoreCard';
import RecommendationsList from './RecommendationsList';

export default function AnalysisResults({ analysis }) {
  if (!analysis) return null;

  const { url, scores, recommendations, actionPlan } = analysis;

  return (
    <div style={styles.resultsContainer}>
      {/* Header */}
      <div className="results-header">
        <h2>📊 Website Audit Report</h2>
        <p className="website-url">{url}</p>
        <p className="timestamp">Generated {new Date(analysis.timestamp).toLocaleDateString()}</p>
      </div>

      {/* Overall Score */}
      <div className="overall-score">
        <div className={`score-circle ${scores.overall.class}`}>
          {scores.overall.score}
        </div>
        <p>
          {scores.overall.score >= 80
            ? '✨ Excellent! Keep it up.'
            : scores.overall.score >= 60
            ? '👍 Good. Room for improvement.'
            : '⚠️ Needs attention.'}
        </p>
      </div>

      {/* Score Cards */}
      <div className="scores-grid">
        <ScoreCard title="SEO" score={scores.seo} />
        <ScoreCard title="Performance" score={scores.performance} />
        <ScoreCard title="Security" score={scores.security} />
        <ScoreCard title="Best Practices" score={scores.bestPractices} />
      </div>

      {/* Action Plan */}
      <div className="action-plan">
        <h3>🎯 Top 3 Priority Actions</h3>
        <ol>
          {actionPlan.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ol>
      </div>

      {/* Recommendations */}
      <RecommendationsList recommendations={recommendations} />

      {/* CTA */}
      <div className="cta-section">
        <h3>Get Your Full Report</h3>
        <p>Get a detailed PDF report with all findings for €29</p>
        <button className="btn-checkout">💳 Purchase Report - €29</button>
      </div>
    </div>
  );
}
