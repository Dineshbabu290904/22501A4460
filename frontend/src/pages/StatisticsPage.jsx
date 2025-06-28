import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getAllUrls } from '../api/shortenerApi';
import logger from '../services/loggingService';
import UrlStatsRow from '../components/UrlStatsRow'; // New component

const StatisticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        logger('info', 'Fetching all URL statistics');
        const response = await getAllUrls();
        // Sort by creation date, newest first
        const sortedUrls = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUrls(sortedUrls);
        logger('info', 'Successfully fetched URL statistics', { count: response.data.length });
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch statistics.';
        setError(errorMessage);
        logger('error', 'Error fetching statistics', { error: errorMessage });
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (urls.length === 0) return <Typography>No shortened URLs found.</Typography>;

  return (
    <Paper sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: 'bold' }}>Short URL</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Original URL</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Clicks</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Expires At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <UrlStatsRow key={url.shortcode} url={url} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StatisticsPage;