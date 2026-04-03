/**
 * MAIN APP COMPONENT
 * 
 * Root React component.
 * Manages application state and routing.
 * 
 * @file Root application component
 */

import { useState } from 'react';
import './App.css';
import AnalysisForm from './components/AnalysisForm';
import AnalysisResults from './components/AnalysisResults';

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysis = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
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

  return (
    <div className="app">
      <header className="header">
        <h1>🔍 Auditoría Report</h1>
        <p>Professional Website Analysis Tool</p>
      </header>

      <main className="main">
        {!analysis ? (
          <AnalysisForm onSubmit={handleAnalysis} loading={loading} error={error} />
        ) : (
          <>
            <AnalysisResults analysis={analysis} />
            <button className="btn-new-analysis" onClick={() => setAnalysis(null)}>
              ← Analyze Another Website
            </button>
          </>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Auditoría Report - Professional Website Analysis</p>
      </footer>
    </div>
  );
}
