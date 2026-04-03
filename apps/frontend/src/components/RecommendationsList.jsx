/**
 * RECOMMENDATIONS LIST COMPONENT
 * 
 * Displays list of recommendations with priority and effort
 */

export default function RecommendationsList({ recommendations }) {
  return (
    <div className="recommendations">
      <h3>💡 Detailed Recommendations</h3>
      <div className="recommendations-list">
        {recommendations.map((rec, i) => (
          <div key={i} className={`recommendation priority-${rec.priority}`}>
            <div className="rec-header">
              <h4>{rec.title}</h4>
              <span className={`priority-badge priority-${rec.priority}`}>
                {rec.priority.toUpperCase()}
              </span>
            </div>
            <p className="impact"><strong>Impact:</strong> {rec.impact}</p>
            <p className="effort"><strong>Effort:</strong> {rec.effort}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
