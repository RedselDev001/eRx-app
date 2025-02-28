// import React, { useState } from "react";
// import {
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
//   MenuItem,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers";

// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import DeleteIcon from "@mui/icons-material/Delete";
// import UploadIcon from "@mui/icons-material/Upload";

// const MedicalRecordsForm = () => {
//   const [records, setRecords] = useState([]);

//   // Record types
//   const recordTypes = ["X-Ray", "Blood Report", "MRI", "Prescription", "Other"];

//   // Handle image upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setRecords([
//           ...records,
//           {
//             id: Date.now(),
//             image: reader.result,
//             fileName: file.name,
//             recordType: "",
//             date: dayjs(),
//             notes: "",
//           },
//         ]);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle changes in form fields
//   const handleChange = (id, field, value) => {
//     setRecords(
//       records.map((record) =>
//         record.id === id ? { ...record, [field]: value } : record
//       )
//     );
//   };

//   // Delete record
//   const handleDelete = (id) => {
//     setRecords(records.filter((record) => record.id !== id));
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box>
//         {/* Upload Button */}
//         <Button
//           variant="outlined"
//           component="label"
//           startIcon={<UploadIcon />}
//           fullWidth
//           sx={{ mb: 2 }}
//         >
//           Upload New Report
//           <input
//             type="file"
//             accept="image/*"
//             hidden
//             onChange={handleImageUpload}
//           />
//         </Button>

//         {/* Display uploaded records */}
//         {records.map((record) => (
//           <Box
//             key={record.id}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               padding: "10px",
//               mb: 2,
//             }}
//           >
//             {/* Image Preview */}
//             <Box
//               component="img"
//               src={record.image}
//               alt="Medical Record"
//               sx={{ width: 80, height: 80, borderRadius: "5px", mr: 2 }}
//             />

//             {/* Record Details */}
//             <Box flex={1}>
//               <Typography variant="body2" fontWeight="bold">
//                 {record.fileName}
//               </Typography>

//               {/* Record Type Dropdown */}
//               <TextField
//                 select
//                 fullWidth
//                 size="small"
//                 value={record.recordType}
//                 onChange={(e) =>
//                   handleChange(record.id, "recordType", e.target.value)
//                 }
//                 sx={{ mt: 1 }}
//               >
//                 <MenuItem value="">Select</MenuItem>
//                 {recordTypes.map((type) => (
//                   <MenuItem key={type} value={type}>
//                     {type}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               {/* Date Picker */}
//               <DatePicker
//                 value={record.date}
//                 onChange={(newDate) =>
//                   handleChange(record.id, "date", newDate)
//                 }
//                 format="DD MMM, YYYY"
//                 sx={{ mt: 1, width: "100%" }}
//               />

//               {/* Notes Input */}
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={2}
//                 placeholder="Enter remarks"
//                 value={record.notes}
//                 onChange={(e) =>
//                   handleChange(record.id, "notes", e.target.value)
//                 }
//                 sx={{ mt: 1 }}
//               />
//             </Box>

//             {/* Delete Button */}
//             <IconButton onClick={() => handleDelete(record.id)}>
//               <DeleteIcon />
//             </IconButton>
//           </Box>
//         ))}
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default MedicalRecordsForm;





























import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Trash } from "lucide-react";

export default function MedicalRecordsForm() {
  const [records, setRecords] = useState([
    { id: 1, date: dayjs(), recordType: "", notes: "", image: null, fileName: "" },
  ]);

  // Handle Image Upload
  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newRecords = [...records];
        newRecords[index].image = reader.result;
        newRecords[index].fileName = file.name;
        setRecords(newRecords);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Date Change
  const handleDateChange = (newDate, index) => {
    const newRecords = [...records];
    newRecords[index].date = dayjs(newDate); // Ensure date is a Dayjs object
    setRecords(newRecords);
  };

  // Handle Input Change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newRecords = [...records];
    newRecords[index][name] = value;
    setRecords(newRecords);
  };

  // Handle Add New Record
  const handleAddRecord = () => {
    setRecords([
      ...records,
      { id: records.length + 1, date: dayjs(), recordType: "", notes: "", image: null, fileName: "" },
    ]);
  };

  // Handle Delete Record
  const handleDeleteRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  //============= main return function ============//
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 2 }}>
        {/* Header */}
        <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
          Upload Medical Records
        </Typography>

        {/* Add New Record Button */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ mb: 2, textTransform: "none", borderRadius: 2 }}
          onClick={handleAddRecord}
        >
          + Upload new report
        </Button>

        {records.map((record, index) => (
          <Box key={index} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2, mb: 2 }}>
            {/* File Name Display */}
            {record.fileName && (
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>{record.fileName}</Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Image Upload & Preview */}
              <Box>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} style={{ display: "none" }} id={`upload-${index}`} />
                <label htmlFor={`upload-${index}`}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      border: "1px solid #ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {record.image ? (
                      <img src={record.image} alt="Preview" width="80" height="80" style={{ borderRadius: "8px" }} />
                    ) : (
                      <Typography sx={{ fontSize: 12, color: "gray" }}>Upload</Typography>
                    )}
                  </Box>
                </label>
              </Box>

              <Box sx={{ flex: 1 }}>
                {/* Record Type Dropdown */}
                <Typography sx={{ fontWeight: "bold" }}>Record Type *</Typography>
                <Select
                  name="recordType"
                  size="small"
                  displayEmpty
                  fullWidth
                  value={record.recordType}
                  onChange={(e) => handleInputChange(e, index)}
                  sx={{ bgcolor: "white", mt: 1 }}
                >
                  <MenuItem value="" disabled>Select</MenuItem>
                  <MenuItem value="Blood Test">Blood Test</MenuItem>
                  <MenuItem value="X-Ray">X-Ray</MenuItem>
                  <MenuItem value="MRI">MRI</MenuItem>
                </Select>
              </Box>

              {/* Date Picker */}
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>Date of Investigation *</Typography>
                <DatePicker
                  value={record.date}
                  onChange={(newDate) => handleDateChange(newDate, index)}
                  renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                />
              </Box>
            </Box>

            {/* Notes Input */}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: "bold" }}>Notes</Typography>
              <TextField
                name="notes"
                size="small"
                placeholder="Enter remarks"
                fullWidth
                multiline
                maxRows={3}
                value={record.notes}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ mt: 1 }}
              />
              <Typography sx={{ fontSize: 12, color: "gray", mt: 0.5 }}>Write maximum 300 characters</Typography>
            </Box>

            {/* Delete Button */}
            {records.length > 1 && (
              <IconButton onClick={() => handleDeleteRecord(index)}  sx={{ mt: 2, color: "red" }}>
                <Trash size={20} />
              </IconButton>
            )}
          </Box>
        ))}

        {/* Submit Button */}
        <Button variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#9370DB", textTransform: "none" }}>
          Submit
        </Button>
      </Box>
    </LocalizationProvider>
  );
}















// import { useState } from "react";
// import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Trash } from "lucide-react";
// import dayjs from "dayjs"; // ✅ Import Day.js


// export default function MedicalRecordsForm() {
//     const [records, setRecords] = useState([
//         { id: 1, date: dayjs(), recordType: "", notes: "", image: null }, // ✅ Use `dayjs()`
//       ]);
      
      

//   // Handle Image Upload
//   const handleImageUpload = (event, index) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const newRecords = [...records];
//         newRecords[index].image = reader.result;
//         setRecords(newRecords);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle Date Change
//   const handleDateChange = (newDate, index) => {
//     const newRecords = [...records];
//     newRecords[index].date = dayjs(newDate); // ✅ Convert input to Day.js object

//     setRecords(newRecords);
//   };

//   // Handle Input Change
//   const handleInputChange = (e, index) => {
//     const { name, value } = e.target;
//     const newRecords = [...records];

//     if (name === "recordType") {
//       newRecords[index].recordType = value;
//     } else if (name === "notes") {
//       newRecords[index].notes = value;
//     }

//     setRecords(newRecords);
//   };

//   // Handle Add New Record
//   const handleAddRecord = () => {
//     setRecords([
//       ...records,
//       { id: 1, date: dayjs(), recordType: "", notes: "", image: null }, // ✅ Use `dayjs()`
//     ]);
//   };

//   // Handle Delete Record
//   const handleDeleteRecord = (index) => {
//     const updatedRecords = records.filter((_, i) => i !== index);
//     setRecords(updatedRecords);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
//         {records.map((record, index) => (
//           <Box key={index} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2 }}>
//             {/* Image Upload */}
//             <Typography sx={{ fontWeight: "bold", mb: 1 }}>Upload Image</Typography>
//             <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
//             {record.image && (
//               <Box mt={1}>
//                 <img src={record.image} alt="Preview" width="100" height="100" style={{ borderRadius: "8px" }} />
//               </Box>
//             )}

//             {/* Record Type Input */}
//             <Typography sx={{ fontWeight: "bold", mt: 2 }}>Record Type *</Typography>
//             <TextField
//               name="recordType"
//               size="small"
//               placeholder="Enter record type"
//               fullWidth
//               value={record.recordType}
//               onChange={(e) => handleInputChange(e, index)}
//             />

//             {/* Date Picker */}
//             <Typography sx={{ fontWeight: "bold", mt: 2 }}>Date of Investigation *</Typography>
//             <DatePicker
//   value={record.date} // ✅ Should be a dayjs object
//   onChange={(newDate) => handleDateChange(newDate, index)}
//   renderInput={(params) => <TextField {...params} size="small" fullWidth />}
// />


//             {/* Notes Input */}
//             <Typography sx={{ fontWeight: "bold", mt: 2 }}>Notes</Typography>
//             <TextField
//               name="notes"
//               size="small"
//               placeholder="Enter remarks"
//               fullWidth
//               multiline
//               maxRows={3}
//               value={record.notes}
//               onChange={(e) => handleInputChange(e, index)}
//             />

//             {/* Delete Button */}
//             {records.length > 1 && (
//               <IconButton onClick={() => handleDeleteRecord(index)} sx={{ mt: 2 }}>
//                 <Trash size={20} />
//               </IconButton>
//             )}
//           </Box>
//         ))}

//         {/* Add New Record Button */}
//         <Button variant="contained" color="primary" onClick={handleAddRecord}>
//           + Add New Record
//         </Button>
//       </Box>
//     </LocalizationProvider>
//   );
// }

