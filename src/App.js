import React, { useState } from 'react';
import './styles.css';

function App() {
  const [query, setQuery] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://your-vercel-app.vercel.app/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setKeywords(data);
    } catch (err) {
      setError('Failed to fetch keywords');
    }
    setLoading(false);
  };

  const handleResearchAgain = () => {
    setKeywords([]);
    setQuery('');
  };

  const exportToCSV = () => {
    const headers = ['Keyword,Intent,Volume,KD %,CPC (USD),SF'];
    const rows = keywords.map(kw => `${kw.keyword},${kw.intent},${kw.volume},${kw.difficulty},${kw.cpc},${kw.sf}`);
    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keywords.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <h1>Keyword Research Tool</h1>
      <div className="header">
        <div className="database">
          Database: <select><option>United States</option></select>
          Currency: <select><option>USD</option></select>
        </div>
        <button className="history-btn">View search history</button>
      </div>

      <div className="tabs">
        {['ALL', 'Questions', 'All keywords', 'Broad Match', 'Phrase Match', 'Exact Match', 'Related'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a keyword..."
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {keywords.length > 0 && (
        <>
          <div className="filters">
            <select><option>Volume</option></select>
            <select><option>KD %</option></select>
            <select><option>Intent</option></select>
            <select><option>CPC (USD)</option></select>
            <select><option>Include</option></select>
            <select><option>Exclude</option></select>
            <select><option>Languages</option></select>
            <select><option>Advanced filters</option></select>
          </div>

          <div className="summary">
            <span>All keywords: {keywords.length}</span>
            <span>Total Volume: {keywords.reduce((sum, kw) => sum + kw.volume, 0)}</span>
            <span>Average KD: {Math.round(keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / keywords.length)}%</span>
            <button className="export-btn" onClick={exportToCSV}>Export to CSV</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Intent</th>
                <th>Volume</th>
                <th>KD %</th>
                <th>CPC (USD)</th>
                <th>SF</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw, index) => (
                <tr key={index}>
                  <td>{kw.keyword}</td>
                  <td>{kw.intent}</td>
                  <td>{kw.volume}</td>
                  <td>{kw.difficulty}</td>
                  <td>{kw.cpc}</td>
                  <td>{kw.sf}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="research-again" onClick={handleResearchAgain}>Research Again</button>
        </>
      )}
    </div>
  );
}

export default App;
