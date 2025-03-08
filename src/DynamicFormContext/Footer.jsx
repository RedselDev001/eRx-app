import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Live} from "../pages/auth/Config";
import Swal from 'sweetalert2';


const Footer = ({ formState,setFormState }) => {
  const [state , setsatte] = useState()
  useEffect(() => {
  if(state == 500){
    handleSave()

  }
  }, [state])
  const navigate = useNavigate();



  
const handleSave = async () => {
 
  const updatedFormStatee = { ...formState };
let missingFields = [];

// Validate "Complaints"
// if(updatedFormStatee.Complaints){

//   updatedFormStatee.Complaints = updatedFormStatee.Complaints.filter(complaint => {
//     const isValid = 
//     // complaint?.Complaint?.complaint &&
//     // complaint?.Complaint?.complaintCode &&
//                     // complaint.Frequency &&
//                     // complaint.Severity &&
//                     // complaint.Duration &&
//                     complaint.Date;
  
//     if (!isValid) {
//       missingFields.push("Complaints");
//     }
//     return isValid;
//   });

// }

if (updatedFormStatee.Prescription) {
  
  updatedFormStatee.Prescription = updatedFormStatee.Prescription.filter(prescription => {
    const isValid = prescription.drugName &&
                 
                    // prescription.Frequency &&
                 
                    // prescription.instruction &&
                    prescription.Route.routeName;

    if (!isValid) {
      missingFields.push("Prescription");
    }
    return isValid;
  });
}

// if (updatedFormStatee.Allergy) {
//   updatedFormStatee.Allergy = updatedFormStatee.Allergy.filter(allergy => {
//     const isValid = allergy["Allergy History"].name &&
//                     allergy["Allergy History"].code &&
//                     allergy["Allergy Description"];

//     if (!isValid) {
//       missingFields.push("Allergy");
//     }
//     return isValid;
//   });
// }
if (updatedFormStatee.Procedure) {
  updatedFormStatee.Procedure = updatedFormStatee.Procedure.filter(procedure => {
    const isValid = procedure.Procedure.procedurename &&
                    procedure.Procedure.procedureCode &&
                    procedure.Note &&
                    procedure["Performed Date"];

    if (!isValid) {
      missingFields.push("Procedure");
    }
    return isValid;
  });
}
if (missingFields.length > 0) {
  Swal.fire({
    title: "Incomplete Form",
    text: `Please fill all required fields in the following sections: ${missingFields.join(", ")}`,
    icon: "warning",
    confirmButtonText: "OK"
  });
  return; // Stop execution if validation fails
}
  const inputString = localStorage.getItem("admissionId");
    const id = inputString.match(/\d+/)[0];
    const retrievedData = JSON.parse(localStorage.getItem("id"));
    let updatedFormState = { ...updatedFormStatee };
    if (!updatedFormState.Complaints) {
      updatedFormState.Complaints = [
        {
          Complaint: {
            complaint: "No current problems or disability",
            complaintCode: "160245001"
          },
          complaint: "No current problems or disability",
          complaintCode: "160245001"
        }
      ];
   
    }
    
    
    
    else if (updatedFormState.Complaints.length > 0) {
      updatedFormState.Complaints = updatedFormState.Complaints.map(item => {
        if (!item.Complaint) {
          item.Complaint = {
            complaint: "No current problems or disability",
            complaintCode: "160245001"
          };
          item.complaint = "No current problems or disability";
          item.complaintCode = "160245001";
        }
        return item;
      });
    }
    
    // Push the payload
    const payload = [];
    payload.push({
      appointmentId: `${id}`,
      patientId: `${retrievedData.id}`,
      uhid: `${retrievedData.uhid}`,
      speciality: "general_medicine",
      viewOrder: 2,
      facility: "opd",
      sectionLabel: "complaints",
      description: {
        content: "cold and fever",
        table: updatedFormState.Complaints || []
      },
      createdAt: "2024-07-24T11:00:00",
      createdBy: "doctor2",
      updatedAt: "2024-07-24T11:00:00",
      updatedBy: "doctor2"
    });
  

  // Add default History structure if it doesn't exist
  if (updatedFormState.History) {
    // If History exists, check if each entry in "Medical History" contains the "History" field, if not, add it
    updatedFormState.History = updatedFormState.History.map(item => {
      if (item["Medical History"]) {
        item["Medical History"] = item["Medical History"].map(historyItem => {
          if (!historyItem.History) {
            historyItem.History = {
              HistoryName: "No current problems or disability",
              HistoryCode: "160245001"
            };
          }
          return historyItem;
        });
      }
      return item;
    });
  
    // Push the payload with the updated History
    payload.push({
      appointmentId: `${id}`,
      patientId: `${retrievedData.id}`,
      uhid: `${retrievedData.uhid}`,
      speciality: "general_medicine",
      viewOrder: 4,
      facility: "opd",
      sectionLabel: "History",
      description: formState["History"]?.[0] || "",
      createdAt: "2024-07-24T11:00:00",
      createdBy: "doctor2",
      updatedAt: "2024-07-24T11:00:00",
      updatedBy: "doctor2"
    });
  
  } 
  else if (!updatedFormState.History || !updatedFormState.History[0] || !updatedFormState.History[0]["Medical History"]) {
    
    // If History does not exist, initialize with the default structure
    updatedFormState.History = [
      {
        "Medical History": [
          {
            History: {
              HistoryName: "No current problems or disability",
              HistoryCode: "160245001"
            }
          }
        ]
      }
    ];
  
    // Push the payload with the default History
    payload.push({
      appointmentId: `${id}`,
      patientId: `${retrievedData.id}`,
      uhid: `${retrievedData.uhid}`,
      speciality: "general_medicine",
      viewOrder: 4,
      facility: "opd",
      sectionLabel: "History",
      description: formState["History"]?.[0] || "",
      createdAt: "2024-07-24T11:00:00",
      createdBy: "doctor2",
      updatedAt: "2024-07-24T11:00:00",
      updatedBy: "doctor2"
    });
  }

if (updatedFormState.Vitals) {
    
    payload.push({
          appointmentId: `${id}`,
          patientId: `${retrievedData.id}`,
          uhid: `${retrievedData.uhid}`,
          speciality: "general_medicine",
          viewOrder: 3,
          facility: "opd",
          sectionLabel: "Vitals",
          description: {
              Vitals: {
                Pressure_Systolic: formState["Vitals"]?.[0]?.Blood_Pressure_Systolic || "",
                Pressure_Diastolic: formState["Vitals"]?.[0]?.Blood_Pressure_Diastolic || "",
                JVP: formState["Vitals"]?.[0]?.JVP || "",
                  Pulse: {
                      value: formState["Vitals"]?.[0]?.Pulse || "",
                      regular: true, // Set dynamically if needed
                      irregular: false
                  },
                  Temp: {
                      value: formState["Vitals"]?.[0]?.Temperature || "",
                      fahrenheit: true // Set dynamically if needed
                  }
              }
          },
          createdAt: "2024-07-24T11:00:00",
          createdBy: "doctor2",
          updatedAt: "2024-07-24T11:00:00",
          updatedBy: "doctor2"
        });
      }
 if (updatedFormState.Prescription) {
  payload.push({
          appointmentId: `${id}`,
          patientId: `${retrievedData.id}`,
          uhid: `${retrievedData.uhid}`,
          speciality: "general_medicine",
          viewOrder: 5,
          sectionLabel: "Prescription",
          facility: "opd",
          description: {
              medications: formState["Prescription"] || []
          },
          createdAt: "2024-07-24T11:00:00",
          createdBy: "doctor2",
          updatedAt: "2024-07-24T11:00:00",
          updatedBy: "doctor2"
        });
      }
    

    if (updatedFormState.Investigations) {
      payload.push({
          appointmentId: `${id}`,
          patientId: `${retrievedData.id}`,
          uhid: `${retrievedData.uhid}`,
          speciality: "general_medicine",
          viewOrder: 6,
          sectionLabel: "Investigations",
          facility: "opd",
          description: {
              medications: formState["Investigations"] || []
          },
          createdAt: "2024-07-24T11:00:00",
          createdBy: "doctor2",
          updatedAt: "2024-07-24T11:00:00",
          updatedBy: "doctor2"
        });
      }

    if (updatedFormState.Advice) {
      payload.push({
          appointmentId: `${id}`,
          patientId: `${retrievedData.id}`,
          uhid: `${retrievedData.uhid}`,
          speciality: "general_medicine",
          viewOrder: 9,
          sectionLabel: "Advice",
          facility: "opd",
          description: {
              medications: formState["Advice"] || []
          },
          createdAt: "2024-07-24T11:00:00",
          createdBy: "doctor2",
          updatedAt: "2024-07-24T11:00:00",
          updatedBy: "doctor2"
        });
      }


    if (updatedFormState.Diagnosis) {
      
      payload.push({
          appointmentId: `${id}`,
          patientId: `${retrievedData.id}`,
          uhid: `${retrievedData.uhid}`,
          speciality: "general_medicine",
          viewOrder: 5,
          sectionLabel: "Diagnosis",
          facility: "opd",
          description: {
              medications: formState["Diagnosis"] || []
          },
          createdAt: "2024-07-24T11:00:00",
          createdBy: "doctor2",
          updatedAt: "2024-07-24T11:00:00",
          updatedBy: "doctor2"
        });
      }


    if (updatedFormState.Allergy) {
      payload.push({
          appointmentId: `${id}`,
          patientId: `${retrievedData.id}`,
          uhid: `${retrievedData.uhid}`,
          speciality: "general_medicine",
          viewOrder: 11,
          sectionLabel: "Allergy",
          facility: "opd",
          description: {
              medications: formState["Allergy"] || []
          },
          createdAt: "2024-07-24T11:00:00",
          createdBy: "doctor2",
          updatedAt: "2024-07-24T11:00:00",
          updatedBy: "doctor2"
        });
      }

    if (updatedFormState.Procedure) {
      payload.push({
        appointmentId: `${id}`,
        patientId: `${retrievedData.id}`,
        uhid: `${retrievedData.uhid}`,
        speciality: "general_medicine",
        viewOrder: 11,
        sectionLabel: "Procedure",
        facility: "opd",
        description: {
            medications: formState["Procedure"] || []
        },
        createdAt: "2024-07-24T11:00:00",
        createdBy: "doctor2",
        updatedAt: "2024-07-24T11:00:00",
        updatedBy: "doctor2"
      });
    }
//  if (updatedFormState["Referred To"]) {
//   payload.push({
//           appointmentId: `${id}`,
//           patientId: `${retrievedData.id}`,
//           uhid: `${retrievedData.uhid}`,
//           speciality: "general_medicine",
//           viewOrder: 8,
//           sectionLabel: "Referred To",
//           facility: "opd",
//           description: {
//               medications: formState["Referred To"] || []
//           },
//           createdAt: "2024-07-24T11:00:00",
//           createdBy: "doctor2",
//           updatedAt: "2024-07-24T11:00:00",
//           updatedBy: "doctor2"
//         });
//       }

    if (updatedFormState["Follow up"]) {
      payload.push({
          appointmentId: `${id}`,
          patientId: `${retrievedData.id}`,
          uhid: `${retrievedData.uhid}`,
          speciality: "general_medicine",
          viewOrder: 7,
          sectionLabel: "Follow up",
          facility: "opd",
          description: {
              medications: formState["Follow up"] || []
          },
          createdAt: "2024-07-24T11:00:00",
          createdBy: "doctor2",
          updatedAt: "2024-07-24T11:00:00",
          updatedBy: "doctor2"
        });
      }
 if (updatedFormState["Appointment Description"]) {
  payload.push({
          appointmentId: `${id}`,
          patientId: `${retrievedData.id}`,
          uhid: `${retrievedData.uhid}`,
          speciality: "general_medicine",
          viewOrder: 1,
          facility: "opd",
          sectionLabel: "Appointment Description",
          description: {
            content: "cold and fever",
            textArea: formState["Appointment Description"]?.[0]?.note || "", // Retrieve the note from formState
          },
          createdAt: "2024-07-24T11:00:00",
          createdBy: "doctor1",
          updatedAt: "2024-07-24T11:00:00",
          updatedBy: "doctor1",
        });
      }
    // Update the React state with the modified formState
    setFormState(updatedFormState);
 // Pass the updated state to handleSaveData
    await handleSaveData(payload);
  };
 
  const handleSaveData = async (payload) => {
    
    if (!payload || payload.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill the form before saving.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    
      return; // Exit the function early if the payload is empty
    }
  console.log("payload",payload)
 const token = localStorage.getItem("access_token");
   try {
      const response = await fetch(`${Live.Port}/hms/rx-records/saveAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // handleSaveerx()
       
        var responseData = await response.json();
        Swal.fire({
          title: 'Success!',
          text: responseData.message,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
           
            navigate('/dashboard/ErxList');
            handleSaveerx()
          }
        });
      }
      
      
      
      
      if(response.status == 400) {
        var responseData = await response.json();
        // throw new Error('Request failed');
        Swal.fire({
          title: 'error',
          text: responseData.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        
        
      }


      if(response.status == 500) {
        var responseData = await response.json();
        setsatte(response.status)
        // throw new Error('Request failed');
        // Swal.fire({
        //   title: 'error',
        //   text: responseData.message,
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // });
       
        
      }


    } catch (error) {
      
      Swal.fire({
        title: 'error',
        text: 'Something went Wrong Please try again',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      console.error('Error:', error);
    }
  };


  const handleSaveerx = async () => {
    
    let erxsavedata = JSON.parse(localStorage.getItem("id")); // Parse stored patient ID
    const inputString = localStorage.getItem("admissionId"); // Get appointment ID
    const id = inputString ? inputString.match(/\d+/)[0] : null; // Extract numeric ID
    const auth = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${Live.Port}/hms/patient/${erxsavedata.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
         
        }
      );
  
      const contentType = response.headers.get("content-type");
  
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json(); // Only parse if JSON
        patientkey(data)
        } else {
          const textData = await response.text(); // Read as text if not JSON
          console.error("Unexpected response format:", textData);
        }
      } else {
        alert(`Failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  



  const patientkey = async (data) => {
   
    let erxsavedata = JSON.parse(localStorage.getItem("id")); // Parse stored patient ID
    const inputString = localStorage.getItem("admissionId"); // Get appointment ID
    const id = inputString ? inputString.match(/\d+/)[0] : null; // Extract numeric ID
    const auth = localStorage.getItem("access_token");
    let  Prescription = {...formState}
    
    try {
      const response = await fetch(
        `${Live.redirect}/erx/raiseCareContextForERX`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({
            patient: data,
            appointmentId: id,
            uniqueIdToken: erxsavedata?.uniqueIdToken,
            prescriptionFilled: Prescription.Prescription ? true : false, 
             
          }),
        }
      );
  
      const contentType = response.headers.get("content-type");
  
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json(); // Only parse if JSON
         
        } else {
          const textData = await response.text(); // Read as text if not JSON
          console.error("Unexpected response format:", textData);
        }
      } else {
        alert(`Failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  
  
  return (
    <div className="buttonsaveclear" style={{display:"flex",justifyContent:"center"}}>
      <button className="btn btn-success" role="button" onClick={handleSave}>Save</button>
     
    
    </div>
  );
}

export default Footer;
