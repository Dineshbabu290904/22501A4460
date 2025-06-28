import React, { useState } from 'react';
import { Button, Typography, Box, Paper, Alert, CircularProgress, Card, CardContent, CardActions, Snackbar, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import UrlInputRow from '../components/UrlInputRow';
import ResultItem from '../components/ResultItem'; // New component
import { createShortUrl } from '../api/shortenerApi';
import logger from '../services/loggingService';

const ShortenerPage = () => {
  const [urlItems, setUrlItems] = useState([{ id: Date.now(), url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddItem = () => {
    if (urlItems.length < 5) {
      setUrlItems([...urlItems, { id: Date.now(), url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleRemoveItem = (index) => {
    setUrlItems(urlItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, updatedItem) => {
    const newItems = [...urlItems];
    newItems[index] = updatedItem;
    setUrlItems(newItems);
  };

  const handleCopy = (link) => {
    setSnackbarMessage(`Copied ${link} to clipboard!`);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    for (const item of urlItems) {
      if (!item.url) {
        setError('Original URL is required for all entries.');
        setLoading(false);
        return;
      }
      try {
        // More robust URL validation
        const url = item.url.startsWith('http') ? item.url : `https://${item.url}`;
        new URL(url);
      } catch (_) {
        setError(`Invalid URL format: ${item.url}`);
        setLoading(false);
        return;
      }
      if (item.validity && (!/^\d+$/.test(item.validity) || parseInt(item.validity) <= 0)) {
        setError('Validity must be a positive number of minutes.');
        setLoading(false);
        return;
      }
    }
    
    logger('info', 'Submitting URLs for shortening', { count: urlItems.length });

    const promises = urlItems.map(item => {
        const payload = { url: item.url };
        if (item.validity) payload.validity = parseInt(item.validity, 10);
        if (item.shortcode) payload.shortcode = item.shortcode;
        return createShortUrl(payload);
    });

    try {
        const responses = await Promise.allSettled(promises);
        const newResults = responses.map((res, index) => {
            if (res.status === 'fulfilled') {
                return { success: true, originalUrl: urlItems[index].url, data: res.value.data };
            } else {
                return { success: false, originalUrl: urlItems[index].url, error: res.reason.response?.data?.error || 'Network Error' };
            }
        });
        setResults(newResults);
        logger('info', 'Successfully received responses from shortening requests');
    } catch (err) {
        setError('A critical error occurred.');
        logger('error', 'Critical error during URL submission', { error: err.message });
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Card component={Paper} elevation={3}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Short Links
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter up to 5 long URLs to shorten them. You can also add a custom shortcode and an expiration time in minutes.
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {urlItems.map((item, index) => (
                <UrlInputRow
                  key={item.id}
                  item={item}
                  index={index}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                  showRemoveButton={urlItems.length > 1}
                />
              ))}
            </Stack>

            <CardActions sx={{ justifyContent: 'space-between', p: 0 }}>
              <Button
                variant="text"
                onClick={handleAddItem}
                disabled={urlItems.length >= 5 || loading}
                startIcon={<AddCircleOutlineIcon />}
              >
                Add another URL
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                color="primary" 
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <ContentCutIcon />}
              >
                Shorten
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
      
      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Results</Typography>
          <Stack spacing={2}>
            {results.map((result, index) => (
              <ResultItem key={index} result={result} onCopy={handleCopy} />
            ))}
          </Stack>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default ShortenerPage;