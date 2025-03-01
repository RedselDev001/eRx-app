

import React, { useState, useRef } from 'react';
import { Box, Button, Typography, TextField, IconButton } from '@mui/material';
import { Save, LayersClear } from '@mui/icons-material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

export default function FollowUp() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState('');
  const datePickerRef = useRef(null);

  //=========== Function to set the date dynamically 
  const handlePresetClick = (days) => {
    setSelectedDate(dayjs().add(days, 'day'));
  };

  //=============== amin return  function =============//
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #ddd', backgroundColor: '#fff', marginTop: '15px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bolder" sx={{ display: 'flex', alignItems: 'center', fontSize: 'large' }}>
            <Box
              sx={{
                width: '30px',
                height: '30px',
                border: '2px dotted purple',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px'
              }}
            >
              <EventNoteIcon sx={{ color: 'purple', fontSize: '20px' }} />
            </Box>
            FollowUp
          </Typography>
          <Box>
            <Button startIcon={<LayersClear />} sx={{ textTransform: 'none', color: '#555' }}>
              Templates
            </Button>
            <Button startIcon={<Save />} sx={{ textTransform: 'none', color: '#555' }}  onClick={() => console.log("Selected Date:", selectedDate ? dayjs(selectedDate).format('DD-MM-YYYY') : "No date selected", "Notes:", notes)}>
              Save
            </Button>
            <Button startIcon={<LayersClear />} sx={{ textTransform: 'none', color: '#555' }}>
              Clear
            </Button>
          </Box>
        </Box>

        {/*============ Follow-up Input with Calendar and Buttons ==============*/}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            format="DD-MM-YYYY"
            minDate={dayjs()} 
            ref={datePickerRef}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select a date"
                value={selectedDate ? dayjs(selectedDate).format('DD-MM-YYYY') : ''}
                sx={{ flex: 1 }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <IconButton onClick={() => datePickerRef.current.open()}>
                      <CalendarTodayIcon sx={{ color: 'purple' }} />
                    </IconButton>
                  )
                }}
              />
            )}
          />
          <Button variant="outlined" sx={{ textTransform: 'none' }} onClick={() => handlePresetClick(2)}>
            2 Days
          </Button>
          <Button variant="outlined" sx={{ textTransform: 'none' }} onClick={() => handlePresetClick(14)}>
            2 Weeks
          </Button>
          <Button variant="outlined" sx={{ textTransform: 'none' }} onClick={() => handlePresetClick(60)}>
            2 Months
          </Button>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: '5px' }}>
            Additional Notes
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter any additional notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9' }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
