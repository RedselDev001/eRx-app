import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const PrivateNotesForm = () => {
  const [note, setNote] = useState("");

  //=============== main return function =============//
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Private Note
      </Typography>

      <Typography variant="body2" color="textSecondary">
        This note only be visible to you and will not be printed. And you will be able to see it in Patient Details.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Write your notes"
        variant="outlined"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        sx={{ mt: 2 }}
      />

      <Button
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: "#9B8AFB",
          ":disabled": { bgcolor: "#d1c4e9" } 
        }}
        disabled={note.trim().length === 0}
      >
        Save
      </Button>
    </Box>
  );
};

export default PrivateNotesForm;
