






// import React, { useState } from "react";
// import { TextField, Button, Box, Typography, IconButton } from "@mui/material";
// import dayjs from "dayjs";
// import CloseIcon from "@mui/icons-material/Close";

// const VitalsForm = () => {
//   const [dates, setDates] = useState([{ id: 1, date: dayjs().format("DD MMM, YY") }]);

//   const fields = [
//     { label: "Temperature", unit: "Frh" },
//     { label: "Pulse", unit: "/min" },
//     { label: "Resp. Rate", unit: "/min" },
//     { label: "Systolic", unit: "mmHg" },
//     { label: "Diastolic", unit: "mmHg" },
//     { label: "SPO2", unit: "%" },
//     { label: "Height", unit: "cms" },
//   ];

//   // Function to add a new date
//   const addNewDate = () => {
//     const newDate = dayjs().add(dates.length, "day").format("DD MMM, YY");
//     setDates([...dates, { id: dates.length + 1, date: newDate }]);
//   };

//   // Function to remove a date
//   const removeDate = (id) => {
//     if (dates.length > 1) {
//       setDates(dates.filter((item) => item.id !== id));
//     }
//   };

//   return (
//     <Box p={2}>
//       {/* Header Section */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h6">Vitals</Typography>
//         <Button variant="contained" color="primary">
//           Done
//         </Button>
//       </Box>

//       {/* Add New Date Button */}
//       <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }} onClick={addNewDate}>
//         Add New Date
//       </Button>

//       {/* Scrollable Dates and Input Fields */}
//       <Box sx={{ overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: 2, paddingBottom: 1 }}>
//         {dates.map((item) => (
//           <Box key={item.id} sx={{ minWidth: "300px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
//             {/* Date Header */}
//             <Box
//               sx={{
//                 backgroundColor: "#f5f5f5",
//                 padding: "10px",
//                 borderRadius: "8px",
//                 fontWeight: "bold",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <span>{item.date}</span>
//               {dates.length > 1 && (
//                 <IconButton size="small" onClick={() => removeDate(item.id)}>
//                   <CloseIcon fontSize="small" />
//                 </IconButton>
//               )}
//             </Box>

//             {/* Vitals Input Fields */}
//             <Box mt={2}>
//               {fields.map((field, index) => (
//                 <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
//                   <Typography sx={{ width: "120px", fontWeight: "bold" }}>{field.label}</Typography>
//                   <TextField size="small" placeholder="Enter" sx={{ flex: 1 }} />
//                   <Typography>{field.unit}</Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default VitalsForm;




// import React, { useState } from "react";
// import { TextField, Button, Box, Typography, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";

// const VitalsForm = () => {
//   const [dates, setDates] = useState([{ id: 1, date: dayjs() }]);

//   const fields = [
//     { label: "Temperature", unit: "Frh" },
//     { label: "Pulse", unit: "/min" },
//     { label: "Resp. Rate", unit: "/min" },
//     { label: "Systolic", unit: "mmHg" },
//     { label: "Diastolic", unit: "mmHg" },
//     { label: "SPO2", unit: "%" },
//     { label: "Height", unit: "cms" },
//   ];

//   // Function to add a new date with manual selection
//   const addNewDate = () => {
//     setDates([...dates, { id: dates.length + 1, date: dayjs() }]);
//   };

//   // Function to update a selected date
//   const handleDateChange = (newDate, id) => {
//     setDates(dates.map((item) => (item.id === id ? { ...item, date: newDate } : item)));
//   };

//   // Function to remove a date
//   const removeDate = (id) => {
//     if (dates.length > 1) {
//       setDates(dates.filter((item) => item.id !== id));
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box p={2}>
//         {/* Header Section */}
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography variant="h6">Vitals</Typography>
//           <Button variant="contained" color="primary">
//             Done
//           </Button>
//         </Box>

//         {/* Add New Date Button */}
//         <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }} onClick={addNewDate}>
//           Add New Date
//         </Button>

//         {/* Scrollable Date Sections */}
//         <Box sx={{ overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: 2, paddingBottom: 1 }}>
//           {dates.map((item) => (
//             <Box key={item.id} sx={{ minWidth: "300px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
//               {/* Date Picker Section */}
//               <Box
//                 sx={{
//                   backgroundColor: "#f5f5f5",
//                   padding: "10px",
//                   borderRadius: "8px",
//                   fontWeight: "bold",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <DatePicker
//                   value={item.date}
//                   onChange={(newDate) => handleDateChange(newDate, item.id)}
//                   format="DD MMM, YY"
//                 />
//                 {dates.length > 1 && (
//                   <IconButton size="small" onClick={() => removeDate(item.id)}>
//                     <CloseIcon fontSize="small" />
//                   </IconButton>
//                 )}
//               </Box>

//               {/* Vitals Input Fields */}
//               <Box mt={2}>
//                 {fields.map((field, index) => (
//                   <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
//                     <Typography sx={{ width: "120px", fontWeight: "bold" }}>{field.label}</Typography>
//                     <TextField size="small" placeholder="Enter" sx={{ flex: 1 }}  value={item.values[field.label] || ""}
//                       onChange={(e) => handleInputChange(e, item.id, field.label)}/>
//                     <Typography>{field.unit}</Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default VitalsForm;




import React, { useState } from "react";
import { TextField, Button, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const VitalsForm = () => {
  const [dates, setDates] = useState([{ id: 1, date: dayjs(), values: {} }]);

  const fields = [
    { label: "Temperature", unit: "Frh" },
    { label: "Pulse", unit: "/min" },
    { label: "Resp. Rate", unit: "/min" },
    { label: "Systolic", unit: "mmHg" },
    { label: "Diastolic", unit: "mmHg" },
    { label: "SPO2", unit: "%" },
    { label: "Height", unit: "cms" },
  ];

  // Add new date section
  const addNewDate = () => {
    setDates([...dates, { id: dates.length + 1, date: dayjs(), values: {} }]);
  };

  // Update selected date
  const handleDateChange = (newDate, id) => {
    setDates(dates.map((item) => (item.id === id ? { ...item, date: newDate } : item)));
  };

  // Update numeric input fields
  const handleInputChange = (e, id, field) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {  // Regex: Only numbers allowed
      setDates(
        dates.map((item) =>
          item.id === id ? { ...item, values: { ...item.values, [field]: value } } : item
        )
      );
    }
  };

  // Remove date section
  const removeDate = (id) => {
    if (dates.length > 1) {
      setDates(dates.filter((item) => item.id !== id));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={2}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Vitals</Typography>
          <Button variant="contained" color="primary">
            Done
          </Button>
        </Box>

        {/* Add New Date Button */}
        <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }} onClick={addNewDate}>
          Add New Date
        </Button>

        {/* Scrollable Date Sections */}
        <Box sx={{ overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: 2, paddingBottom: 1 }}>
          {dates.map((item) => (
            <Box key={item.id} sx={{ minWidth: "300px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
              {/* Date Picker Section */}
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <DatePicker
                  value={item.date}
                  onChange={(newDate) => handleDateChange(newDate, item.id)}
                  format="DD MMM, YY"
                />
                {dates.length > 1 && (
                  <IconButton size="small" onClick={() => removeDate(item.id)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {/* Vitals Input Fields */}
              <Box mt={2}>
                {fields.map((field, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography sx={{ width: "120px", fontWeight: "bold" }}>{field.label}</Typography>
                    <TextField
                      size="small"
                      placeholder="Enter"
                      sx={{ flex: 1 }}
                      value={item.values[field.label] || ""}
                      onChange={(e) => handleInputChange(e, item.id, field.label)}
                    />
                    <Typography>{field.unit}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default VitalsForm;

