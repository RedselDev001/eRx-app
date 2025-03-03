import React, { useState } from 'react';
import {
  Box,
  MenuItem,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Menu,
  Button,
  Typography,
  Checkbox,
  Drawer,
  List,
  ListItem
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { Save, LayersClear } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import EditIcon from '@mui/icons-material/Edit';

export default function Advices() {
  const [advicesList, setAdvicesList] = useState(['Drink more water', 'Exercise daily', 'Eat healthy food', 'Sleep well', 'Reduce stress']);
  const [selectedAdvices, setSelectedAdvices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [checkedAdvices, setCheckedAdvices] = useState([]);

  const [editAdvice, setEditAdvice] = useState(null);
  const [editText, setEditText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  //=========== Open drawer with selected advice for editing
  const handleEditAdvice = (advice) => {
    setEditAdvice(advice);
    setEditText(advice.name);
    setIsDrawerOpen(true);
  };

  //============== Save edited advice and update the list
  const handleSaveEdit = () => {
    setSelectedAdvices((prev) => prev.map((item) => (item.id === editAdvice.id ? { ...item, name: editText } : item)));
    setIsDrawerOpen(false);
    setEditAdvice(null);
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxChange = (advice) => {
    setCheckedAdvices((prev) => (prev.includes(advice) ? prev.filter((item) => item !== advice) : [...prev, advice]));
  };

  const handleDoneSelection = () => {
    const newAdvices = checkedAdvices.filter((advice) => !selectedAdvices.some((e) => e.name === advice));
    setSelectedAdvices([...selectedAdvices, ...newAdvices.map((advice) => ({ id: Date.now(), name: advice }))]);
    setCheckedAdvices([]);
    setSearchTerm('');
    handleClose();
  };

  const handleDelete = (id) => {
    setSelectedAdvices(selectedAdvices.filter((advice) => advice.id !== id));
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCustomAdvice = () => {
    if (searchTerm.trim() && !advicesList.includes(searchTerm)) {
      setAdvicesList([...advicesList, searchTerm]);
      setSelectedAdvices([...selectedAdvices, { id: Date.now(), name: searchTerm }]);
    }
    setSearchTerm('');
    handleClose();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newList = [...selectedAdvices];
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);
    setSelectedAdvices(newList);
  };

  const handleSave = () => {
    console.log('Saved Advices:', selectedAdvices);
  };

  //============= main return function ===============//
  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #ddd', backgroundColor: '#fff', marginTop: '15px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bolder" sx={{ display: 'flex', alignItems: 'center', fontSize: 'large' }}>
          <Box
            sx={{
              width: '35px',
              height: '35px',
              border: '2px dotted green',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}
          >
            <TipsAndUpdatesIcon sx={{ color: 'green', fontSize: '22px' }} />
          </Box>
          Advices
        </Typography>
        <Box>
          <Button startIcon={<LayersClear />} sx={{ textTransform: 'none', color: '#555' }}>
            Templates
          </Button>
          <Button startIcon={<Save />} sx={{ textTransform: 'none', color: '#555' }} onClick={handleSave}>
            Save
          </Button>
          <Button startIcon={<LayersClear />} sx={{ textTransform: 'none', color: '#555' }}>
            Clear
          </Button>
        </Box>
      </Box>

      {selectedAdvices.length > 0 && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="advices">
              {(provided) => (
                <List ref={provided.innerRef} {...provided.droppableProps}>
                  {selectedAdvices.map((advice, index) => (
                    <Draggable key={advice.id} draggableId={advice.id.toString()} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderBottom: '1px solid #ddd',
                            mb: 1,
                            p: 1
                          }}
                        >
                          <span>☰</span>
                          <TextField type="text" variant="outlined" value={advice.name} size="small" fullWidth />
                          <IconButton
                            sx={{
                              color: 'inherit',
                              '&:hover': {
                                color: 'red'
                              }
                            }}
                            onClick={() => handleDelete(advice.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton sx={{ color: 'orange' }} onClick={() => handleEditAdvice(advice)}>
                            ✏️
                          </IconButton>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      )}

      {/*=============== Advice Search list Data & multi Selected ==============*/}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Search or Add Advice</InputLabel>
        <OutlinedInput
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleOpen}
          placeholder="Search or type to add..."
          label="Search or Add Advice"
        />
      </FormControl>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} sx={{ maxHeight: 300 }}>
        <MenuItem disableRipple>
          <TextField
            autoFocus
            fullWidth
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search or type to add..."
            variant="outlined"
            size="small"
          />
          <MenuItem sx={{ justifyContent: 'center' }}>
            <Button
              disabled={checkedAdvices.length > 0 ? false : true}
              onClick={handleDoneSelection}
              variant="contained"
              color="primary"
              size="small"
            >
              Done
            </Button>
          </MenuItem>
        </MenuItem>
        {advicesList
          .filter((advice) => advice.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((advice) => (
            <MenuItem key={advice} onClick={() => handleCheckboxChange(advice)}>
              <Checkbox checked={checkedAdvices.includes(advice)} />
              {advice}
            </MenuItem>
          ))}
        {searchTerm && !advicesList.includes(searchTerm) && (
          <MenuItem onClick={handleAddCustomAdvice} sx={{ fontWeight: 'bold', color: 'green' }}>
            ➕ Add "{searchTerm}"
          </MenuItem>
        )}
      </Menu>
      {/*=============== Advice Search list Data & multi Selected ==============*/}

      {/*=============== Advice Edit Drawer ==============*/}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6">Edit Advice</Typography>
          <TextField fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} sx={{ mt: 2 }} />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
      {/*=============== Advice Edit Drawer ==============*/}
    </Box>
  );
}
