/**
 * MAIN APP COMPONENT
 * 
 * Root component managing analysis submission and results display
 */

import { useState } from 'react';
import './App.css';

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!url.startsWith('http')) {
        throw new Error('URL must start with http:// or https://');
      }

      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔍 Auditoría Report</h1>
        <p>Professional Website Analysis Tool</p>
      </header>

      <main className="main">
        {!analysis ? (
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ color: '#667eea', marginBottom: '10px' }}>Analyze Your Website</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Get a detailed SEO and performance audit</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    disabled={loading}
                    style={{
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {error && (
                  <div style={{ color: '#ff6b6b', fontSize: '0.9rem', padding: '10px', background: '#ffe0e0', borderRadius: '6px' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !url}
                  style={{
                    padding: '12px',
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Analyzing...' : 'Analyze Website'}
                </button>
              </form>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>🔍</span>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>SEO Analysis</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>⚡</span>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>Performance</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>🔒</span>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>Security</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>✅</span>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>Best Practices</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <button
              onClick={resetForm}
              style={{
                marginBottom: '30px',
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ← New Analysis
            </button>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '2px solid #f0f0f0' }}>
                <h2 style={{ color: '#667eea', fontSize: '2rem', marginBottom: '10px' }}>📊 Website Audit Report</h2>
                <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '5px', wordBreak: 'break-all' }}>{analysis.url}</p>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>
                  Generated {new Date(analysis.timestamp).toLocaleDateString()}
                </p>
              </div>

              {/* Overall Score */}
              <div style={{ textAlign: 'center', marginBottom: '40px', padding: '30px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', borderRadius: '12px' }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 auto 20px',
                  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                  background: analysis.scores.overall.score >= 80 ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                }}>
                  {analysis.scores.overall.score}
                </div>
                <p style={{ fontSize: '1.1rem', color: '#333' }}>
                  {analysis.scores.overall.score >= 80 ? '✨ Excellent!' : analysis.scores.overall.score >= 60 ? '👍 Good.' : '⚠️ Needs attention.'}
                </p>
              </div>

              {/* Score Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {[
                  { label: 'SEO', score: analysis.scores.seo },
                  { label: 'Performance', score: analysis.scores.performance },
                  { label: 'Security', score: analysis.scores.security },
                  { label: 'Best Practices', score: analysis.scores.bestPractices }
                ].map((item) => (
                  <div key={item.label} style={{
                    padding: '25px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: 'white',
                    border: `2px solid ${item.score.class === 'excellent' ? '#38ef7d' : '#f5576c'}`,
                    transition: 'transform 0.2s'
                  }}>
                    <h4 style={{ color: '#333', marginBottom: '15px' }}>{item.label}</h4>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: item.score.class === 'excellent' ? '#38ef7d' : '#f5576c'
                    }}>
                      {item.score.score}
                    </div>
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>/100</p>
                  </div>
                ))}
              </div>

              {/* Action Plan */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '40px'
              }}>
                <h3 style={{ marginBottom: '20px' }}>🎯 Top 3 Priority Actions</h3>
                <ol style={{ marginLeft: '20px' }}>
                  {analysis.actionPlan.map((action, i) => (
                    <li key={i} style={{ marginBottom: '15px', lineHeight: '1.6' }}>{action}</li>
                  ))}
                </ol>
              </div>

              {/* Recommendations */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '20px' }}>💡 Recommendations</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  {analysis.recommendations.map((rec, i) => (
                    <div key={i} style={{
                      padding: '20px',
                      background: '#f9f9f9',
                      borderLeft: `4px solid ${rec.priority === 'high' ? '#ff6b6b' : rec.priority === 'medium' ? '#ffa500' : '#51cf66'}`,
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ color: '#333' }}>{rec.title}</h4>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          color: 'white',
                          background: rec.priority === 'high' ? '#ff6b6b' : rec.priority === 'medium' ? '#ffa500' : '#51cf66'
                        }}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p><strong>Impact:</strong> {rec.impact}</p>
                      <p><strong>Effort:</strong> {rec.effort}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Get Your Full Report</h3>
                <p style={{ marginBottom: '20px' }}>Get a detailed PDF report with all findings for €29</p>
                <button style={{
                  padding: '12px 30px',
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}>
                  💳 Purchase Report - €29
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2026 Auditoría Report. All rights reserved.</p>
      </footer>
    </div>
  );
}
