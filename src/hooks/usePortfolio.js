import { useState, useEffect } from 'react';
import { subscribeToPublishedPortfolio } from '../services/portfolioService';

export function usePortfolio(category = 'all') {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublishedPortfolio((data) => {
      setPortfolio(data);
      setLoading(false);
    }, category);

    return () => unsubscribe();
  }, [category]);

  return { portfolio, loading, error };
}
