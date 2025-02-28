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
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

export default function Examinations() {
  const [examinationsList, setExaminationsList] = useState([
    'Blood Pressure Check',
    'Heart Rate Monitoring',
    'Blood Test',
    'X-Ray',
    'MRI Scan',
    'ECG Test',
    'Physical Examination'
  ]);
  const [selectedExaminations, setSelectedExaminations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  //========= Open dropdown
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //========= Close dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  //============ Select examination
  const handleExaminationSelect = (examination) => {
    if (!selectedExaminations.some((e) => e.name === examination)) {
      setSelectedExaminations([...selectedExaminations, { id: Date.now(), name: examination }]);
    }
    setSearchTerm('');
    handleClose();
  };

  //======= Delete examination
  const handleDelete = (id) => {
    setSelectedExaminations(selectedExaminations.filter((examination) => examination.id !== id));
  };

  //=========== Search input change
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //=========== Add custom examination
  const handleAddCustomExamination = () => {
    if (searchTerm.trim() && !examinationsList.includes(searchTerm)) {
      setExaminationsList([...examinationsList, searchTerm]);
      setSelectedExaminations([...selectedExaminations, { id: Date.now(), name: searchTerm }]);
    }
    setSearchTerm('');
    handleClose();
  };

  //============= Function to handle drag & drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newList = [...selectedExaminations];
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);

    setSelectedExaminations(newList);
  };

  //================ main return function ===============//
  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #ddd', backgroundColor: '#fff', marginTop: '15px' }}>
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
            <MedicalServicesIcon sx={{ color: 'purple', fontSize: '20px' }} />
          </Box>
          Examinations
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
        {selectedExaminations.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>☰</TableCell>
                    <TableCell>Examination</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <Droppable droppableId="examinations">
                  {(provided) => (
                    <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                      {selectedExaminations.map((examination, index) => (
                        <Draggable key={examination.id} draggableId={examination.id.toString()} index={index}>
                          {(provided) => (
                            <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <TableCell>☰</TableCell>
                              <TableCell>
                                <TextField disabled type="text" variant="outlined" value={examination.name} size="small" fullWidth />
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
                                  onClick={() => handleDelete(examination.id)}
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
        <InputLabel>Search or Add Examination</InputLabel>
        <OutlinedInput
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleOpen}
          placeholder="Search or type to add..."
          label="Search or Add Examination"
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

        {/*============ Filtered Examinations List ==============*/}
        {examinationsList
          .filter((examination) => examination.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((examination) => (
            <MenuItem key={examination} onClick={() => handleExaminationSelect(examination)}>
              {examination}
            </MenuItem>
          ))}

        {/*=============== Add Custom Option =========*/}
        {searchTerm && !examinationsList.includes(searchTerm) && (
          <MenuItem onClick={handleAddCustomExamination} sx={{ fontWeight: 'bold', color: 'green' }}>
            ➕ Add "{searchTerm}"
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
