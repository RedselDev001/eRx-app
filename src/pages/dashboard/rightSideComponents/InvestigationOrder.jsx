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
import ScienceIcon from '@mui/icons-material/Science';

export default function InvestigationOrder() {
  const [investigationsList, setInvestigationsList] = useState([
    'Blood Test',
    'Urine Analysis',
    'X-Ray',
    'MRI Scan',
    'CT Scan',
    'Ultrasound',
    'ECG Test'
  ]);
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInvestigationSelect = (investigation) => {
    if (!selectedInvestigations.some((e) => e.name === investigation)) {
      setSelectedInvestigations([...selectedInvestigations, { id: Date.now(), name: investigation }]);
    }
    setSearchTerm('');
    handleClose();
  };

  const handleDelete = (id) => {
    setSelectedInvestigations(selectedInvestigations.filter((investigation) => investigation.id !== id));
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCustomInvestigation = () => {
    if (searchTerm.trim() && !investigationsList.includes(searchTerm)) {
      setInvestigationsList([...investigationsList, searchTerm]);
      setSelectedInvestigations([...selectedInvestigations, { id: Date.now(), name: searchTerm }]);
    }
    setSearchTerm('');
    handleClose();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newList = [...selectedInvestigations];
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);
    setSelectedInvestigations(newList);
  };

  //========== Function to handle change  
  const handleInstructionChange = (id, newInstruction) => {
    setSelectedInvestigations(
      selectedInvestigations.map((investigation) =>
        investigation.id === id ? { ...investigation, instruction: newInstruction } : investigation
      )
    );
  };

  
  //========== Function to handle save action
  const handleSave = () => {
    console.log("Saved Investigations:", selectedInvestigations);
  };
  
  //============== main return function ============//
  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #ddd', backgroundColor: '#fff', marginTop: '15px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bolder" sx={{ display: 'flex', alignItems: 'center', fontSize: 'large' }}>
          <Box
            sx={{
              width: '30px',
              height: '30px',
              border: '2px dotted blue',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}
          >
            <ScienceIcon sx={{ color: 'blue', fontSize: '20px' }} />
          </Box>
          Investigation Order
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

      {selectedInvestigations.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>☰</TableCell>
                  <TableCell>Investigation</TableCell>
                  <TableCell>Instruction</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <Droppable droppableId="investigations">
                {(provided) => (
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {selectedInvestigations.map((investigation, index) => (
                      <Draggable key={investigation.id} draggableId={investigation.id.toString()} index={index}>
                        {(provided) => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <TableCell>☰</TableCell>
                            <TableCell>
                              <TextField disabled type="text" variant="outlined" value={investigation.name} size="small" fullWidth />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="text"
                                size="small"
                                variant="outlined"
                                fullWidth
                                placeholder="Instruction"
                                value={investigation.instruction}
                                onChange={(e) => handleInstructionChange(investigation.id, e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                sx={{
                                  color: 'inherit',
                                  '&:hover': {
                                    color: 'red'
                                  }
                                }}
                                onClick={() => handleDelete(investigation.id)}
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

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Search or Add Investigation</InputLabel>
        <OutlinedInput
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleOpen}
          placeholder="Search or type to add..."
          label="Search or Add Investigation"
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
        {investigationsList
          .filter((investigation) => investigation.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((investigation) => (
            <MenuItem key={investigation} onClick={() => handleInvestigationSelect(investigation)}>
              {investigation}
            </MenuItem>
          ))}
        {searchTerm && !investigationsList.includes(searchTerm) && (
          <MenuItem onClick={handleAddCustomInvestigation} sx={{ fontWeight: 'bold', color: 'green' }}>
            ➕ Add "{searchTerm}"
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
