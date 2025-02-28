// material-ui
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useMediaQuery, useTheme } from "@mui/material";

// other imports
import WelcomeBanner from 'sections/dashboard/analytics/WelcomeBanner';
import { Plus } from "lucide-react";
import { Box, Typography } from '@mui/material';
import VitalsForm from "./components/VitalsForm";
import MedicalHistoryForm from "./components/MedicalHistoryForm";
import PrivateNotesForm from "./components/PrivateNotesForm";
import MedicalRecordsForm from "./components/MedicalRecordsForm";

//======= Map sections to their respective components
const sectionComponents = {
  "Vitals & Body Composition": VitalsForm,
  "Medical History": MedicalHistoryForm,
  "Private Notes": PrivateNotesForm,
  "Medical Records": MedicalRecordsForm,
  "Lab Results": () => <div>Lab Results Form Coming Soon...</div>,
};

export default function DashboardAnalytics() {
  // Inside your component
  const theme = useTheme();
  const isSmallScreen = useMediaQuery( theme.breakpoints.down( "sm" ) ); // Check for small screen
  const [ openDrawer, setOpenDrawer ] = useState( false );
  const [ selectedSection, setSelectedSection ] = useState( null );

  const sections = [
    { name: "Vitals & Body Composition", icon: "🩺" },
    { name: "Medical History", icon: "📋" },
    { name: "Private Notes", icon: "📝" },
    { name: "Medical Records", icon: "📂" },
    { name: "Lab Results", icon: "🧪" },
  ];

  const handleOpenDrawer = ( sectionName ) => {
    setSelectedSection( sectionName );
    setOpenDrawer( true );
  };

  const handleCloseDrawer = () => {
    setOpenDrawer( false );
    setSelectedSection( null );
  };

  //=========== Get the selected form component
  const SelectedForm = selectedSection ? sectionComponents[ selectedSection ] : null;

  //============ main return  function ==============//
  return (
    <Grid container rowSpacing={ 4.5 } columnSpacing={ 3 }>
      <Grid item xs={ 12 }>
        <WelcomeBanner />
      </Grid>

      <Grid item xs={ 12 } md={ 4 }>
        <div className="containers">
          { sections.map( ( section, index ) => (
            <div key={ index } className="section">
              <div className="section-info">
                <span className="icon">{ section.icon }</span>
                <span className="name">{ section.name }</span>
              </div>
              <button className="add-btn" onClick={ () => handleOpenDrawer( section.name ) }>
                <Plus size={ 16 } />
                <span>Add</span>
              </button>
            </div>
          ) ) }
        </div>
      </Grid>

      <Grid item xs={ 12 } md={ 8 }>
        Preview
      </Grid>

      {/*============= Right Side Offcanvas (Drawer) ================*/ }



      <Drawer
        anchor="right"
        open={ openDrawer }
        onClose={ handleCloseDrawer }
        sx={ {
          '& .MuiDrawer-paper': {
            width: isSmallScreen ? '100%' : '50%', 
            padding: '16px',
          },
        } }
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{ selectedSection }</Typography>
          <IconButton onClick={ handleCloseDrawer }>
            <CloseIcon />
          </IconButton>
        </Box>

        {/*========== Dynamically render the selected section's form ===============*/ }
        <Box sx={ { mt: 2 } }>
          { SelectedForm ? <SelectedForm /> : <Typography>Select a section to continue</Typography> }
        </Box>
      </Drawer>
    </Grid>
  );
}
