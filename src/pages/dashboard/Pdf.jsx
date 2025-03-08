import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import {Live} from "../auth/Config";


const App = () => {
    const { id } = useParams();
   
    
    const [profile, setprofildata] = useState([]);
  
    const [dataaa, setdataaa] = useState([]);
   
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      
        
         fetchPatientDetails()
      }, [id]);


      const fetchPatientDetails = async () => {
        
          try {
            const token = localStorage.getItem('authToken'); // Get the token from localStorage
            const inputString = localStorage.getItem('admissionId'); // Assuming you now store the appointment id 
            const id = inputString.match(/\d+/)[0]; 
           
            
            fetchData(id)
            const response = await fetch(
              `${Live.Port}/hms/opd/appointment/${id}`, // Updated URL
              {
                headers: { 'Authorization': `Bearer ${token}` } // Pass the token in headers
              }
            );
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            // setPatientData(data); // Set the fetched data in state
            fetchAppointments(data.patientId)
            localStorage.setItem("id", JSON.stringify({
              id: data.patientId,
              uhid: data.uhid
          }));
          } catch (error) {
            console.error('Error fetching patient details:', error);
          }
        };


    const fetchAppointments = async (id) => {
        
        const token = localStorage.getItem("authToken");
        setLoading(true);
        try {
            const response = await fetch(
                `${Live.Port}/hms/opd/getAllAppointmentsAgainstPatientId?patientId=${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch appointments");
            }

            const appointmentsData = await response.json();
            setprofildata((prev) => ({
                ...prev,
                data: appointmentsData,
            }));
        
            // fetchData(appointmentsData[0].id);
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (appointmentId) => {
        
        const token = localStorage.getItem("authToken");
        setLoading(true);
        try {
            const response = await fetch(
                `${Live.Port}/hms/rx-records/opdRxRecordsByAppointment?appointmentId=${appointmentId}&facility=opd`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch appointment data");
            }

            const appointmentsDatas = await response.json();

            const result = appointmentsDatas.data.map(item => ({
                sectionLabel: item.sectionLabel,
                requestObject: item.requestObject
            }));

            setdataaa(result);
        } catch (err) {
            console.error("Error fetching appointment data:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderComplaints = (requestObject) => {
       
        return (
            <Table bordered hover size="sm">
                <thead  style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                    <tr>
                    <th>Complaint</th>
                        <th>Date</th>
                      
                     
                      
                    </tr>
                </thead>
                <tbody>
                    {requestObject.table?.map((row, idx) => (
                        <tr key={idx}>
                               <td>{row.Complaint?.complaint}</td>
                            <td>{row["Date"]}</td>
                         
                         
                         
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const renderHistory = (requestObject) => {
        return (
            <Table bordered hover size="sm">
                <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                    <tr>
                        <th>Addiction</th>
                        <th>Surgical History</th>
                        <th>Family History</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/* Render Addiction data */}
                        <td>
                            {requestObject.Addiction && requestObject.Addiction.length > 0
                                ? requestObject.Addiction.map((item, idx) => item.Addiction).join(", ")
                                : "No data available"}
                        </td>
                        
                        {/* Render Surgical History data */}
                        <td>{requestObject["Surgical History"] || "No data available"}</td>
                        
                        {/* Render Family History data */}
                        <td>{requestObject["Any Family History"] || "No data available"}</td>
                    </tr>
    
                   
                </tbody>
            </Table>
        );
    };
    

    const renderVitals = (requestObject) => {
        const { Vitals } = requestObject;
    
        // Combine systolic and diastolic to form BP
        const BP = Vitals?.Pressure_Systolic && Vitals?.Pressure_Diastolic
            ? `${Vitals.Pressure_Systolic}/${Vitals.Pressure_Diastolic}`
            : "N/A";
    
        return (
            <Table bordered hover size="sm">
                <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                    <tr>
                        <th style={{ textAlign: "center" }}>BP</th>
                        <th style={{ textAlign: "center" }}>Temp</th>
                        <th style={{ textAlign: "center" }}>Pulse</th>
                        <th style={{ textAlign: "center" }}>JVP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/* Render BP data */}
                        <td style={{ textAlign: "center", fontSize: "16px" }}>{BP}</td>
                        
                        {/* Render Temp data */}
                        <td style={{ textAlign: "center", fontSize: "16px" }}>
                            {Vitals?.Temp?.value || "N/A"} 
                            {Vitals?.Temp?.fahrenheit ? "°F" : "°C"}
                        </td>
                        
                        {/* Render Pulse data */}
                        <td style={{ textAlign: "center", fontSize: "16px" }}>
                            {Vitals?.Pulse?.value || "N/A"} 
                            {/* (Regular: {Vitals?.Pulse ? "Yes" : "No"}) */}
                        </td>
                        
                        {/* Render JVP data */}
                        <td style={{ textAlign: "center", fontSize: "16px" }}>{Vitals?.JVP || "N/A"}</td>
                    </tr>
                </tbody>
            </Table>
        );
    };
    
    



    const renderPrescription = (requestObject) => {
     
        return (
            <Table bordered hover size="sm">
                <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                <tr>
                    <th>Route</th>
                    <th>Reason</th>
                    <th>Method</th>
                    <th>Dose Time</th>
                    <th>Medicine</th>
                    {/* <th>Duration</th> */}
                    <th>Frequency</th>
                    <th>Instruction</th>
                    <th>Rotation in days</th>
                </tr>
                </thead>
                <tbody>
                {requestObject.medications?.map((medication, idx) => (
                    <tr key={idx}>
                        {/* Route */}
                        <td>{medication.Route?.routeName || "N/A"}</td>
                        
                        {/* Reason */}
                        <td>{medication.reason || "N/A"}</td>
                        
                        {/* Method */}
                        <td>{medication.method
                            || "N/A"}</td>

                        {/* Dosage */}
                        <td>{medication.dosage || "N/A"}</td>

                        {/* Medicine */}
                        <td>{medication.Medicine?.drugName || "N/A"}</td>

                        {/* Duration */}
                        {/* <td>{medication.duration || "N/A"}</td> */}

                        {/* Frequency */}
                        <td>{medication.Frequency || "N/A"}</td>

                        {/* Instruction */}
                        <td>{medication.instruction || "N/A"}</td>

                        {/* Days */}
                        <td>{medication.days || "N/A"}</td>
                    </tr>
                ))}
            </tbody>
            </Table>
        );
    };
    
    const renderInvestigations = (requestObject) => {
    return (
        <Table bordered hover size="sm">
            <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                <tr>
                    <th>Test Name</th>
                    
                    <th>Rate</th>
                   
                </tr>
            </thead>
            <tbody>
                {requestObject.medications?.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row["Test Name"]?.TestName || "N/A"}</td>
                       
                        <td>{row["Test Name"]?.rate || "N/A"}</td>
                       
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};


const renderAdvice = (requestObject) => {
    return (
        <Table bordered hover size="sm">
            <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                <tr>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
                {requestObject.medications?.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row.note || "No advice provided"}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};
const renderDiagnosis = (requestObject) => {
    
    return (
        <Table bordered hover size="sm">
            <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                <tr>
                    <th>Provisional Diagnosis</th>
                    <th>Final Diagnosis</th>
                    
                </tr>
            </thead>
            <tbody>
                {requestObject.medications?.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row["Provisional Diagnosis"] || "N/A"}</td>
                        <td>{row["Final Diagnosis"] || "N/A"}</td>
                       
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};


const renderAllergy = (requestObject) => {
 
    return (
        <Table bordered hover size="sm">
            <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                <tr>
                    <th>Allergy Name</th>
                  
                    <th>Allergy Description</th>
                </tr>
            </thead>
            <tbody>
                {requestObject.medications?.map((row, idx) => (
                    <tr key={idx}>
                        {/* Allergy Name */}
                        <td>{row["Allergy History"]?.name || "N/A"}</td> {/* Default to N/A if no name */}
                        
                        {/* Allergy Code */}
                      
                        {/* Allergy Description */}
                        <td>{row["Allergy Description"]?.trim() || "No Description"}</td> {/* Default text */}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};




const renderProcedure = (requestObject) => {
    return (
        <Table bordered hover size="sm">
            <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                <tr>
                    <th>Note</th>
                    
                    <th>Procedure Name</th>
                    <th>Complication</th>
                    <th>Performed Date</th>
                </tr>
            </thead>
            <tbody>
                {requestObject.medications?.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row["  Note"] || "N/A"}</td>
                        
                        <td>{row.Procedure?.procedurename || "N/A"}</td>
                        <td>{row.Complication?.complaint || "N/A"}</td>
                        <td>{row[" Performed Date"] || "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};



// const renderReferredTo = (requestObject) => {
//     return (
//         <Table bordered hover size="sm">
//             <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
//                 <tr>
//                     <th>Doctor Name</th>
//                     {/* <th>Email</th> */}
//                     <th>Phone</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {requestObject.medications?.map((row, idx) => (
//                     <tr key={idx}>
//                         <td>{row["Doctor Name"] || "N/A"}</td>
//                         {/* <td>{row["Email"] || "N/A"}</td> */}
//                         <td>{row["Phone"] || "N/A"}</td>
//                     </tr>
//                 ))}
//             </tbody>
//         </Table>
//     );
// };

    


const renderNextVisit = (requestObject) => {
   
    return (
        <Table bordered hover size="sm">
            <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                <tr>
                    <th>Follow up</th>
                </tr>
            </thead>
            <tbody>
                {requestObject.medications?.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row.Date|| "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

const renderQuickNotes = (requestObject) => {
    debugger
    return (
        <Table bordered hover size="sm" >
            <thead style={{ backgroundColor: "rgb(46 148 217)", color: "#ffffff", fontSize: "18px" }}>
                <tr>
                    {/* <th>Complain</th> */}
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {/* <td>{requestObject.content || "N/A"}</td> */}
                    <td>{requestObject.textArea || "N/A"}</td>
                </tr>
            </tbody>
        </Table>
    );
};



    const renderOtherSections = (sectionLabel, requestObject) => {
      
        switch (sectionLabel) {
            case "complaints":
                return renderComplaints(requestObject);
            case "History":
                return renderHistory(requestObject);
            case "Vitals":
                return renderVitals(requestObject);

                case "Prescription":
                    return renderPrescription(requestObject);
                    case "Investigations":
                        return renderInvestigations(requestObject);
                        case "Advice":
                            return renderAdvice(requestObject);
                            case "Diagnosis":
                                return renderDiagnosis(requestObject);
                                case "Allergy":
                                    return renderAllergy(requestObject);
                                    case "Procedure":
                                        return renderProcedure(requestObject);

                                        // case "Referred To":
                                        //     return renderReferredTo(requestObject);
                                            case "Appointment Description":
                                            return renderQuickNotes(requestObject);
                                            case "Follow up":
                                            return renderNextVisit(requestObject);
            default:
                return <div id="wrapper">
                <img src="https://i.imgur.com/qIufhof.png" />
                <div id="info">
                    <h3>This page could not be found</h3>
                </div>
            </div >;
        }
    };

    return (
        <>
            {/* Profile Section */}
            <Row>
                <Col md="12" lg="8" className="mx-auto">
                    <div>
                        <>
                            {/* <h4 className="text-center text-primary">Patient Profile</h4> */}
                            <h2 className="text-center mt-2 header-text_Erx">Electronic Prescription Patient Profile</h2>
                            <Table bordered hover size="sm">
    <tbody>
        {/* Name, Age, and Address in a single row */}
        <tr>
            <th>Name</th>
            <td>{profile.data?.[0]?.patientName}</td>
            <th>Age</th>
            <td>{profile.data?.[0]?.age}</td>
            <th>Address</th>
            <td>{profile.data?.[0]?.address}</td>
        </tr>
        {/* Gender */}
        <tr>
            <th>Gender</th>
            <td>{profile.data?.[0]?.gender}</td>
            <th>Phone</th>
            <td>{profile.data?.[0]?.phone}</td>
            <th>Department</th>
            <td>{profile.data?.[0]?.department}</td>
        </tr>
        {/* Phone */}
       
        {/* Diagnosis */}
        <tr>
            <th>Diagnosis</th>
            <td>{profile[id]?.[0]?.diagnosisName}</td>
            <th>Referred By</th>
            <td>{profile[id]?.[0]?.referedBy}</td>
            <th>Appointment</th>
            <td>
                {profile[id]?.[0]?.startDate} to {profile[id]?.[0]?.endDate} at {profile[id]?.[0]?.startTime}
            </td>
        </tr>
        {/* Referred By */}
       
    </tbody>
</Table>

                        </>
                    </div>
                </Col>
            </Row>

            {/* Dynamic Sections (Complaints, History, etc.) */}
            <Row className="mt-3">
                <Col md="12" lg="8" className="mx-auto" bordered>
                    {dataaa.map((section, index) => (
                        <div key={index}>
                            < >
                                <h5 className="text-success">{section.sectionLabel}</h5>
                                {renderOtherSections(section.sectionLabel, section.requestObject)}
                            </>
                        </div>
                    ))}
                </Col>
            </Row>
        </>
    );
};

export default App;
