import React from 'react';
import { TextField, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const UrlInputRow = ({ item, onChange, onRemove, index, showRemoveButton }) => {
  const handleInputChange = (e) => {
    onChange(index, { ...item, [e.target.name]: e.target.value });
  };

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid >
        <TextField
          fullWidth
          label="Original Long URL"
          name="url"
          value={item.url}
          onChange={handleInputChange}
          variant="outlined"
          required
        />
      </Grid>
      <Grid>
        <TextField
          fullWidth
          label="Validity (mins)"
          name="validity"
          type="number"
          value={item.validity}
          onChange={handleInputChange}
          variant="outlined"
          placeholder="30"
        />
      </Grid>
      <Grid >
        <TextField
          fullWidth
          label="Custom Shortcode"
          name="shortcode"
          value={item.shortcode}
          onChange={handleInputChange}
          variant="outlined"
          placeholder="Optional"
        />
      </Grid>
      <Grid>
        {showRemoveButton && (
          <IconButton onClick={() => onRemove(index)} color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

export default UrlInputRow;