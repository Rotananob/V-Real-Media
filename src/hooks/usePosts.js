import { useState, useEffect } from 'react';
import { subscribeToPublishedPosts } from '../services/postService';

export function usePosts(category = 'all') {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublishedPosts((data) => {
      setPosts(data);
      setLoading(false);
    }, category);

    return () => unsubscribe();
  }, [category]);

  return { posts, loading, error };
}
