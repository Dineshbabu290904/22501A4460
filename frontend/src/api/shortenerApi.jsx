import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createShortUrl = (payload) => {
  return apiClient.post('/shorturls', payload);
};

export const getAllUrls = () => {
  return apiClient.get('/shorturls');
};

export const getUrlStats = (shortcode) => {
  return apiClient.get(`/shorturls/${shortcode}`);
};