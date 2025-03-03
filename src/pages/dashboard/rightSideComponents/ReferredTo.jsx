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
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export default function ConsultantList() {
  const [consultantList, setConsultantList] = useState([
    'Dr. John Doe',
    'Dr. Jane Smith',
    'Dr. Emily Johnson',
    'Dr. Michael Brown',
    'Dr. Sarah Wilson'
  ]);
  const [selectedConsultants, setSelectedConsultants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConsultantSelect = (consultant) => {
    if (!selectedConsultants.some((c) => c.name === consultant)) {
      setSelectedConsultants([...selectedConsultants, { id: Date.now(), name: consultant }]);
    }
    setSearchTerm('');
    handleClose();
  };

  const handleDelete = (id) => {
    setSelectedConsultants(selectedConsultants.filter((consultant) => consultant.id !== id));
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCustomConsultant = () => {
    if (searchTerm.trim() && !consultantList.includes(searchTerm)) {
      setConsultantList([...consultantList, searchTerm]);
      setSelectedConsultants([...selectedConsultants, { id: Date.now(), name: searchTerm }]);
    }
    setSearchTerm('');
    handleClose();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newList = [...selectedConsultants];
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);

    setSelectedConsultants(newList);
  };

  //============== main return function ===============//
  return (
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
            <PersonSearchIcon sx={{ color: 'purple', fontSize: '20px' }} />
          </Box>
          Consultant List
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

      {selectedConsultants.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>☰</TableCell>
                  <TableCell>Consultant</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <Droppable droppableId="consultants">
                {(provided) => (
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {selectedConsultants.map((consultant, index) => (
                      <Draggable key={consultant.id} draggableId={consultant.id.toString()} index={index}>
                        {(provided) => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <TableCell>☰</TableCell>
                            <TableCell>
                              <TextField disabled type="text" variant="outlined" value={consultant.name} size="small" fullWidth />
                            </TableCell>
                            <TableCell>
                              <TextField type="text" size="small" variant="outlined" fullWidth placeholder="Notes" />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                sx={{ color: 'inherit', '&:hover': { color: 'red' } }}
                                onClick={() => handleDelete(consultant.id)}
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
        <InputLabel>Search or Add Consultant</InputLabel>
        <OutlinedInput
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleOpen}
          placeholder="Search or type to add..."
          label="Search or Add Consultant"
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
        {consultantList
          .filter((consultant) => consultant.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((consultant) => (
            <MenuItem key={consultant} onClick={() => handleConsultantSelect(consultant)}>
              {consultant}
            </MenuItem>
          ))}
        {searchTerm && !consultantList.includes(searchTerm) && (
          <MenuItem onClick={handleAddCustomConsultant} sx={{ fontWeight: 'bold', color: 'green' }}>
            ➕ Add "{searchTerm}"
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
