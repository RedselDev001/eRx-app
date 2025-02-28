import React from "react";
import { TextField, Button } from "@mui/material";

const MedicalHistoryForm = () => {
  return (
    <div className="space-y-4">
      <TextField fullWidth label="Previous Surgeries" variant="outlined" />
      <TextField fullWidth label="Allergies" variant="outlined" />
      <TextField fullWidth label="Medications" variant="outlined" />
      <Button variant="contained" color="primary" className="w-full !mt-4">
        Save
      </Button>
    </div>
  );
};

export default MedicalHistoryForm;
