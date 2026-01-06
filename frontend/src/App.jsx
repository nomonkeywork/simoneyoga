import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

function PageContent() {
  const { slug = 'home' } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/pages.php?slug=${slug}`)
      .then(async res => {
        const contentType = res.headers.get('content-type');
        
        // Check if response is JSON
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Non-JSON response:', text.substring(0, 200));
          throw new Error(`API returned non-JSON: ${res.status} ${res.statusText}`);
        }
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `HTTP ${res.status}`);
        }
        
        return res.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setPage(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message || 'Fehler beim Laden der Seite');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Lade…</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Fehler: {error || 'Seite nicht gefunden'}</p>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageContent />} />
        <Route path="/:slug" element={<PageContent />} />
      </Routes>
    </BrowserRouter>
  );
}

