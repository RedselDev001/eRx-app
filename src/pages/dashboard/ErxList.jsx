import React, { useState, useEffect } from 'react';
import { Table, Button, Collapse } from 'reactstrap';
import { Card, CardBody, FormGroup, Input, Label, Row, Col,Container} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import {Live} from "../auth/Config";
import ERXview from "./ERXview"

const PatientTable = () => {
 const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [collapse, setCollapse] = useState({});
const [appointments, setAppointments] = useState({}); 
const [appointmentserx, setAppointmentserx] = useState([]); 
  

  const extractedData = (appointmentserx.data && Array.isArray(appointmentserx.data) ? appointmentserx.data : []).map(item => ({
    sectionLabel: item.sectionLabel || "No section label", // Default if null or undefined
    description: item.description || "No description available" // Default if null or undefined
  }));
  
 
  

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken'); // Get token from local storage
      try {
        const response = await fetch(
          `${Live.Port}/hms/patient/getAllPatientsERxSaved`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        setData(responseData); // Assuming the response contains an array of patient objects
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const navigate = useNavigate();
  const handleNavigate = (id) => {
    
 debugger
    const encodedId = btoa(id);
    // Navigate with the encrypted id in the URL
    navigate(`/Pdf/${id}`);
  };
  // Fetch appointment details for a specific patient
  const fetchAppointments = async (patientId) => {
    
    const token = localStorage.getItem('authToken'); // Get token from local storage
    try {
      const response = await fetch(
        `${Live.Port}/hms/opd/getAllAppointmentsAgainstPatientId?patientId=${patientId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const appointmentsData = await response.json();
      setAppointments((prev) => ({
        ...prev,
        [patientId]: appointmentsData,
      }));
      fetchData(appointmentsData[0].id)
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };


  const fetchData = async (patientId) => {
    
    const token = localStorage.getItem('authToken'); // Get token from local storage
    try {
      const response = await fetch(
        `${Live.Port}/hms/rx-records/opdRxRecordsByAppointment?appointmentId=${patientId}&facility=opd`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const appointmentsDatas = await response.json();

      setAppointmentserx(appointmentsDatas);
   
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };



  
 

  // Toggle collapse for a specific row
  const toggleCollapse = (id) => {
 
    setCollapse((prevState) => ({
      ...prevState,
      [id]: !prevState[id],

    }));
   
      fetchAppointments(id);

    // Fetch appointments only if not already fetched
    if (!appointments[id]) {
       
   
    }
    // 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (


    <Container style={{ border: '1px solid black', padding: '20px' }}>
    <Card>
      <CardBody>
        <h2 className="text-center mt-2 header-text_Erx">Electronic Prescription List</h2>
       
      <Table bordered hover>
        <thead>
         <tr>
         <th>#</th>
            <th>Full Name</th>
         <th>Gender</th>
         <th>Date of Birth</th>
            {/* <th>Action</th>
            <th>Action</th> */}
       </tr>
        </thead>
       <tbody>
         {data.map((patient,index) => (
            <React.Fragment key={patient.id}>
              <tr>
              <td>{index+1}</td>
                <td>{patient.fullName}</td>
                <td>{patient.gender}</td>
                <td>{patient.dob}</td>
                {/* <td style={{display:"flex" , justifyContent:"space-between"}}> */}
                  {/* <Button
                    color="primary"
                    size="sm"
                    onClick={() => toggleCollapse(patient.id)}
                  >
                    {collapse[patient.id] ? 'Hide Details' : 'Show Details'}
                  </Button> */}

                 
                 
                {/* </td> */}
                {/* <td>
                <Button
                color="primary"
                size="sm"
                onClick={() => handleNavigate(patient.id)}
              >
                View
              </Button>
                </td> */}
                
                
              </tr>
              <tr>
                <td colSpan="4" style={{ padding: 0, border: 'none' }}>
                  <Collapse isOpen={collapse[patient.id]}>
                    <div className="p-3 bg-light">
                      <Table bordered size="sm">
                       
                        <tbody>
                          {appointments[patient.id] ? (
                            appointments[patient.id].map((appointment) => (
                              <React.Fragment key={appointment.id}>
                               
                                <tr>
                                
                                  <ERXview  data = {extractedData} />
                                </tr>
                               
                               
                              </React.Fragment>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2">Loading appointments...</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
       
       
      </CardBody>
    </Card>
    </Container>





  );
};

export default PatientTable;
