import { useState, useCallback, useMemo } from 'react';
import api from '../utils/api';

interface Title {
  uuid: string;
  title: string;
  subject: string;
  details: string;
}

export const useTitles = () => {
  const [titles, setTitles] = useState<Title[]>([]);

  const fetchTitles = useCallback(async () => {
    try {
      const response = await api.get('/title');
      setTitles(response.data);
    } catch (error) {
      console.error('Error fetching titles:', error);
      throw error;
    }
  }, []);

  const addTitle = useCallback(async (subject: string, details: string) => {
    try {
      const response = await api.post('/title', { title: subject, details });
      setTitles(prevTitles => [...prevTitles, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding title:', error);
      throw error;
    }
  }, []);

  const deleteTitle = useCallback(async (id: string) => {
    try {
      await api.delete(`/title/${id}`);
      setTitles(prevTitles => prevTitles.filter(title => title.uuid !== id));
    } catch (error) {
      console.error('Error deleting title:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    titles,
    fetchTitles,
    addTitle,
    deleteTitle,
  }), [titles, fetchTitles, addTitle, deleteTitle]);
};