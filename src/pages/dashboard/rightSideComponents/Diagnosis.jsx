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
  Select,
  Button,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Save, LayersClear } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export default function Diagnosis({ title }) {
  const [diagnosisList, setDiagnosisList] = useState([
    'Diabetes',
    'Hypertension',
    'Pneumonia',
    'Tuberculosis',
    'Asthma',
    'Migraine',
    'Arthritis'
  ]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const diagnosisStatusOptions = ['Ruled Out', 'Suspected', 'Confirmed'];

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDiagnosisSelect = (diagnosis) => {
    if (!selectedDiagnosis.some((d) => d.name === diagnosis)) {
      setSelectedDiagnosis([...selectedDiagnosis, { id: Date.now(), name: diagnosis }]);
    }
    setSearchTerm('');
    handleClose();
  };

  const handleDelete = (id) => {
    setSelectedDiagnosis(selectedDiagnosis.filter((diagnosis) => diagnosis.id !== id));
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCustomDiagnosis = () => {
    if (searchTerm.trim() && !diagnosisList.includes(searchTerm)) {
      setDiagnosisList([...diagnosisList, searchTerm]);
      setSelectedDiagnosis([...selectedDiagnosis, { id: Date.now(), name: searchTerm }]);
    }
    setSearchTerm('');
    handleClose();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newList = [...selectedDiagnosis];
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);

    setSelectedDiagnosis(newList);
  };

  //============ main reut
  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #ddd', backgroundColor: '#fff', marginTop: '15px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bolder" sx={{ display: 'flex', alignItems: 'center', fontSize: 'large' }}>
          <Box
            sx={{
              width: '30px',
              height: '30px',
              border: '2px dotted red',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}
          >
            <LocalHospitalIcon sx={{ color: 'red', fontSize: '20px' }} />
          </Box>
          {title}
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

      {selectedDiagnosis.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>☰</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Since</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <Droppable droppableId="diagnosis">
                {(provided) => (
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {selectedDiagnosis.map((diagnosis, index) => (
                      <Draggable key={diagnosis.id} draggableId={diagnosis.id.toString()} index={index}>
                        {(provided) => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <TableCell>☰</TableCell>
                            <TableCell>
                              <TextField disabled type="text" variant="outlined" value={diagnosis.name} size="small" fullWidth />
                            </TableCell>
                            <TableCell>
                              <TextField type="text" size="small" variant="outlined" fullWidth placeholder="Since" />
                            </TableCell>
                            <TableCell>
                              <Select size="small" fullWidth>
                                {diagnosisStatusOptions.map((option) => (
                                  <MenuItem placeholder="Status" key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                            <TableCell>
                              <TextField type="text" size="small" variant="outlined" fullWidth placeholder="Notes" />
                            </TableCell>
                            <TableCell>
                              <IconButton sx={{ color: 'inherit', '&:hover': { color: 'red' } }} onClick={() => handleDelete(diagnosis.id)}>
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

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Search or Add {title}</InputLabel>
        <OutlinedInput
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleOpen}
          placeholder="Search or type to add..."
          label="Search or Add Diagnosis"
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
        </MenuItem>
        {diagnosisList
          .filter((diagnosis) => diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((diagnosis) => (
            <MenuItem key={diagnosis} onClick={() => handleDiagnosisSelect(diagnosis)}>
              {diagnosis}
            </MenuItem>
          ))}
        {searchTerm && !diagnosisList.includes(searchTerm) && (
          <MenuItem onClick={handleAddCustomDiagnosis} sx={{ fontWeight: 'bold', color: 'green' }}>
            ➕ Add "{searchTerm}"
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
