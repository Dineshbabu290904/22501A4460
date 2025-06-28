import React, { useState } from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Link } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const UrlStatsRow = ({ url }) => {
  const [open, setOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
  const shortLink = `${baseUrl}/${url.shortcode}`;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Link href={shortLink} target="_blank" rel="noopener noreferrer" underline="hover">
            {shortLink}
          </Link>
        </TableCell>
        <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Typography variant="body2" title={url.longUrl}>{url.longUrl}</Typography>
        </TableCell>
        <TableCell align="center">{url.clickCount}</TableCell>
        <TableCell>{new Date(url.expiresAt).toLocaleString()}</TableCell>
        <TableCell>{new Date(url.createdAt).toLocaleString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Click History
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small" aria-label="click history">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Referrer</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>User Agent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {url.clickDetails.length > 0 ? (
                      url.clickDetails.map((click, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{click.referrer || 'Direct'}</TableCell>
                          <TableCell>{click.location || 'N/A'}</TableCell>
                          <TableCell sx={{fontSize: '0.75rem', color: 'text.secondary'}}>{click.userAgent}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No clicks recorded yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default UrlStatsRow;