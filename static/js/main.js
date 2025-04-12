// এটি একটি সরলীকৃত উদাহরণ। বাস্তবে এটি অনেক বড় এবং মিনিফাইড হবে।
(function(){
  const e = React.createElement;
  const App = () => {
    const [query, setQuery] = React.useState('');
    const [keywords, setKeywords] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('ALL');

    const handleSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('https://keyword-research-backend.vercel.app/api/keywords', {
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

    return e('div', { className: 'container' },
      e('h1', null, 'Keyword Research Tool'),
      e('div', { className: 'header' },
        e('div', { className: 'database' },
          'Database: ', e('select', null, e('option', null, 'United States')),
          'Currency: ', e('select', null, e('option', null, 'USD'))
        ),
        e('button', { className: 'history-btn' }, 'View search history')
      ),
      e('div', { className: 'tabs' },
        ['ALL', 'Questions', 'All keywords', 'Broad Match', 'Phrase Match', 'Exact Match', 'Related'].map(tab =>
          e('button', {
            key: tab,
            className: `tab ${activeTab === tab ? 'active' : ''}`,
            onClick: () => setActiveTab(tab)
          }, tab)
        )
      ),
      e('div', { className: 'search-bar' },
        e('input', {
          type: 'text',
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: 'Enter a keyword...'
        }),
        e('button', { onClick: handleSearch, disabled: loading }, loading ? 'Searching...' : 'Search')
      ),
      error && e('p', { className: 'error' }, error),
      keywords.length > 0 && e(React.Fragment, null,
        e('div', { className: 'filters' },
          e('select', null, e('option', null, 'Volume')),
          e('select', null, e('option', null, 'KD %')),
          e('select', null, e('option', null, 'Intent')),
          e('select', null, e('option', null, 'CPC (USD)')),
          e('select', null, e('option', null, 'Include')),
          e('select', null, e('option', null, 'Exclude')),
          e('select', null, e('option', null, 'Languages')),
          e('select', null, e('option', null, 'Advanced filters'))
        ),
        e('div', { className: 'summary' },
          e('span', null, `All keywords: ${keywords.length}`),
          e('span', null, `Total Volume: ${keywords.reduce((sum, kw) => sum + kw.volume, 0)}`),
          e('span', null, `Average KD: ${Math.round(keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / keywords.length)}%`),
          e('button', { className: 'export-btn', onClick: exportToCSV }, 'Export to CSV')
        ),
        e('table', null,
          e('thead', null,
            e('tr', null,
              e('th', null, 'Keyword'),
              e('th', null, 'Intent'),
              e('th', null, 'Volume'),
              e('th', null, 'KD %'),
              e('th', null, 'CPC (USD)'),
              e('th', null, 'SF')
            )
          ),
          e('tbody', null,
            keywords.map((kw, index) =>
              e('tr', { key: index },
                e('td', null, kw.keyword),
                e('td', null, kw.intent),
                e('td', null, kw.volume),
                e('td', null, kw.difficulty),
                e('td', null, kw.cpc),
                e('td', null, kw.sf)
              )
            )
          )
        ),
        e('button', { className: 'research-again', onClick: handleResearchAgain }, 'Research Again')
      )
    );
  };

  ReactDOM.render(e(App), document.getElementById('root'));
})();
