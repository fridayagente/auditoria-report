/**
 * SCORE CARD COMPONENT
 * 
 * Displays individual score with visual representation
 */

export default function ScoreCard({ title, score }) {
  return (
    <div className={`score-card score-${score.class}`}>
      <h4>{title}</h4>
      <div className="score-value">{score.score}</div>
      <p className="score-label">/100</p>
    </div>
  );
}
