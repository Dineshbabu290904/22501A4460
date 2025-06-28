import React from 'react';
import { Box, Typography, Link, IconButton, Paper, Grid, Tooltip } from '@mui/material';
import { CheckCircleOutline, ErrorOutline, ContentCopy } from '@mui/icons-material';

const ResultItem = ({ result, onCopy }) => {
  const handleCopy = () => {
    if (result.success) {
      navigator.clipboard.writeText(result.data.shortLink);
      onCopy(result.data.shortLink);
    }
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        mb: 2, 
        borderColor: result.success ? 'success.main' : 'error.main',
        backgroundColor: result.success ? 'grey.50' : '#fff5f5'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={1}>
          {result.success ? (
            <CheckCircleOutline color="success" />
          ) : (
            <ErrorOutline color="error" />
          )}
        </Grid>
        <Grid item xs={11}>
          <Typography variant="body2" color="text.secondary" noWrap title={result.originalUrl}>
            Original: {result.originalUrl}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {result.success ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography fontWeight="bold">Short Link:</Typography>
              <Link href={result.data.shortLink} target="_blank" rel="noopener noreferrer">
                {result.data.shortLink}
              </Link>
              <Tooltip title="Copy to clipboard">
                <IconButton onClick={handleCopy} size="small">
                  <ContentCopy fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Typography color="error.main" variant="body2">
              <strong>Error:</strong> {result.error}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ResultItem;