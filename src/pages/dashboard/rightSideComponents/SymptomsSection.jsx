import React, { useState } from 'react';
import {
  Box,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Menu,
  Button,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Save, LayersClear } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function SymptomsTable() {
  const [symptomsList, setSymptomsList] = useState(['Fever', 'Cough', 'Cold', 'Headache', 'Body Pain']);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const severityOptions = ['Mild', 'Moderate', 'Severe'];

  //========= Open dropdown
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //========= Close dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  //============ Select symptom
  const handleSymptomSelect = (symptom) => {
    if (!selectedSymptoms.some((s) => s.name === symptom)) {
      setSelectedSymptoms([...selectedSymptoms, { id: Date.now(), name: symptom }]);
    }
    setSearchTerm('');
    handleClose();
  };

  //======= Delete symptom
  const handleDelete = (id) => {
    setSelectedSymptoms(selectedSymptoms.filter((symptom) => symptom.id !== id));
  };

  //=========== Search input change
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //=========== Add custom symptom
  const handleAddCustomSymptom = () => {
    if (searchTerm.trim() && !symptomsList.includes(searchTerm)) {
      setSymptomsList([...symptomsList, searchTerm]);
      setSelectedSymptoms([...selectedSymptoms, { id: Date.now(), name: searchTerm }]);
    }
    setSearchTerm('');
    handleClose();
  };

  //============= Function to handle drag & drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newList = [...selectedSymptoms];
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);

    setSelectedSymptoms(newList);
  };

  //================ main return function ===============//
  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #ddd', backgroundColor: '#fff' }}>
      {/*============= Header =============*/}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography
          variant="h6"
          fontWeight="bolder"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 'large'
          }}
        >
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
            🟣
          </Box>
          Symptoms
        </Typography>
        <Box>
          <Button startIcon={<LayersClear />} sx={{ textTransform: 'none', color: '#555' }}>
            Templates
          </Button>
          <Button startIcon={<Save />} sx={{ textTransform: 'none', color: '#555' }}>
            Save
          </Button>
          <Button startIcon={<LayersClear />} sx={{ textTransform: 'none', color: '#555' }}>
            Clear
          </Button>
        </Box>
      </Box>
      {/*============= Header =============*/}
      {/*============ Table =============*/}
      <Box>
        {selectedSymptoms.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>☰</TableCell>
                    <TableCell>Symptom</TableCell>
                    <TableCell>Since</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <Droppable droppableId="symptoms">
                  {(provided) => (
                    <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                      {selectedSymptoms.map((symptom, index) => (
                        <Draggable key={symptom.id} draggableId={symptom.id.toString()} index={index}>
                          {(provided) => (
                            <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <TableCell>☰</TableCell>
                              <TableCell>
                                <TextField disabled type="text" variant="outlined" value={symptom.name} size="small" fullWidth />
                              </TableCell>
                              <TableCell>
                                <TextField type="text" size="small" variant="outlined" fullWidth placeholder="Since" />
                              </TableCell>
                              <TableCell>
                                <Select size="small" fullWidth>
                                  {severityOptions.map((option) => (
                                    <MenuItem placeholder="Severity" key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </TableCell>
                              <TableCell>
                                <TextField type="text" size="small" variant="outlined" fullWidth placeholder="Notes" />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  sx={{
                                    color: 'inherit',
                                    '&:hover': {
                                      color: 'red'
                                    }
                                  }}
                                  onClick={() => setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptom.id))}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </Table>
            </DragDropContext>
          </TableContainer>
        )}
      </Box>
      {/*============ Table =============*/}

      {/*============ Searchable Dropdown =============*/}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Search or Add Symptom</InputLabel>
        <OutlinedInput
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleOpen}
          placeholder="Search or type to add..."
          label="Search or Add Symptom"
        />
      </FormControl>

      {/*============== Dropdown Menu ================*/}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} sx={{ maxHeight: 300 }}>
        {/*========= Search Input Inside Dropdown =========*/}
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
        </MenuItem>

        {/*============ Filtered Symptoms List ==============*/}
        {symptomsList
          .filter((symptom) => symptom.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((symptom) => (
            <MenuItem key={symptom} onClick={() => handleSymptomSelect(symptom)}>
              {symptom}
            </MenuItem>
          ))}

        {/*=============== Add Custom Option =========*/}
        {searchTerm && !symptomsList.includes(searchTerm) && (
          <MenuItem onClick={handleAddCustomSymptom} sx={{ fontWeight: 'bold', color: 'green' }}>
            ➕ Add "{searchTerm}"
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
