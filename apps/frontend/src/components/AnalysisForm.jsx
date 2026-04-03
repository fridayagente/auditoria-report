/**
 * ANALYSIS FORM COMPONENT
 * 
 * Input form for website URL
 * Handles user input and form submission
 */

import { useState } from 'react';
import '../styles/AnalysisForm.css';
import PropTypes from 'prop-types';

AnalysisForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
};

export default function AnalysisForm({ onSubmit, loading, error }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Analyze Your Website</h2>
        <p className="subtitle">Get a comprehensive audit report for €29</p>

        <form onSubmit={handleSubmit} className="analysis-form">
          <div className="form-group">
            <label htmlFor="url">Website URL</label>
            <input
              id="url"
              type="text"
              placeholder="example.com or https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className={error ? 'input-error' : ''}
            />
            {error && <p className="error-message">❌ {error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="btn-primary"
          >
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Website'}
          </button>
        </form>

        <div className="features">
          <div className="feature">
            <span className="icon">📊</span>
            <p>SEO, Performance & Security Audit</p>
          </div>
          <div className="feature">
            <span className="icon">💡</span>
            <p>Actionable Recommendations</p>
          </div>
          <div className="feature">
            <span className="icon">📄</span>
            <p>Professional PDF Report</p>
          </div>
        </div>
      </div>
    </div>
  );
}
