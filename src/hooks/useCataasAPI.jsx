import { useState, useEffect } from 'react';

const useCataasAPI = () => {
  const [currentCat, setCurrentCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomCat = () => {
    setLoading(true);
    setError(null);
    
    // Add random parameter to prevent caching
    const randomParam = Math.random().toString(36).substring(7);
    const catUrl = `https://cataas.com/cat?width=300&height=300&${randomParam}`;
    
    setCurrentCat({
      id: Date.now(),
      url: catUrl
    });
    
    setLoading(false);
  };

  const getNextCat = () => {
    fetchRandomCat();
  };

  useEffect(() => {
    fetchRandomCat();
  }, []);

  return { currentCat, loading, error, getNextCat };
};

export default useCataasAPI;