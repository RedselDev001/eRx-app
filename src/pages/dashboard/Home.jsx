import React, { useState,useEffect } from 'react';
import { Card, CardBody, FormGroup, Input, Label, Button, Table, Row, Col,Container} from 'reactstrap';
import PatientHeader from '../../DynamicFormContext/Profile';
import useData from '../../DynamicFormContext/DynamicComponent';
import Footer from "../../DynamicFormContext/Footer";
import Select from 'react-select'; // Import React-Select
import options from '../../DynamicFormContext/options.json';
import {Live} from "../auth/Config";

const DynamicForm = () => {
  const { addictionOptions, Dosagetime, instruction, method } = options;
  const [formState, setFormState] = useState({});


  useEffect(() => {
    const fetchPatientDetails = async () => {
    
      try {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        const inputString = localStorage.getItem('admissionId'); // Assuming you now store the patientId
        const id = inputString.match(/\d+/)[0]; 
       
     

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
       
        const initialData = {
          "Follow up": [
            {
              "Date": data.endDate || null // Default to null if endDate doesn't exist
            },
            {
              "Time": new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false // Use 24-hour format
              }) // Default to the current time
            }
            
          ]
        };




// ++++++++++++
const formattedDateTime = `${initialData["Follow up"][0]["Date"]}T${
  initialData["Follow up"][1]["Time"].slice(0, 5) // Slice to get HH:mm
}`;


const initialDatafinal  = {
  "Follow up": [
    {
      "Date": formattedDateTime || null // Default to null if endDate doesn't exist
    },
    {
      "Time": new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false // Use 24-hour format
      }) // Default to the current time
    }
    
  ]
};

// +++++++++++++++++
setFormState(initialDatafinal)
  } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, []);

  const [error, setError] = useState(""); // State to track error messages
 const [collapsedSections, setCollapsedSections] = useState({});
const [loading, setLoading] = useState(false);
const {data,complain } = useData();

const complaintOptions = complain.Complain.map((option) => ({
  value: { complaint: option.complaint, complaintCode: option.complaintCode,complaintCode: option.complaintCode },
  label: option.complaint,  
}));

const HistoryOptions = complain.Complain.map((option) => ({
  value: { HistoryName: option.complaint, HistoryCode: option.HistoryCode,HistoryCode: option.complaintCode },
  label: option.complaint,  
}));


const procedure = complain.procedure.map((option) => ({
  value: { procedurename: option.procedurename, procedureCode: option.procedureCode},
  label: option.procedurename,  
}));

const investigations = complain.investigations.map((option) => ({
  value: { TestName: option.serviceName, TestCode: option.cptcode ,rate:option.rate},
  label: option.serviceName,  
}));


const medicineOptions = complain.medicinedrug.map((option) => ({
  value:{drugName : option.medicinedrug,drugCode:option.complaintCode} , 
  label: option.medicinedrug,     
}));

const root = complain.medicinedrug.map((option) => ({
  value:{routeName : option.drugRoute,routeCode:option.routeCode} , 
  label: option.drugRoute,     
}));


const allergyOptions = complain.allergy.map((option) => ({

  value:{name : option.Historyname,code:option.HistoryCode} , 
  label: option.Historyname, 

}));
function validateDateInput(input) {
    // Extract the value of the input
    let value = input?.value || "";

    if (!value) return; // If value is empty or undefined, exit the function

    // Check if the value matches the date format (YYYY-MM-DD)
    const dateParts = value.split("-");
    if (dateParts.length === 3) {
      // Extract the year, month, and day
      let year = dateParts[0];

      // Validate the year part: Ensure it is exactly 4 digits
      if (year.length > 4) {
        // Truncate year to 4 characters
        year = year.substring(0, 4);
      }

      // Reconstruct the valid date and update the input
      input.value = `${year}-${dateParts[1] || ""}-${dateParts[2] || ""}`;
    }
  }
  const complaint = ()=>{
    if (formState.Complaints && Array.isArray(formState.Complaints) && formState.Complaints.length > 0) {
      const flattenedComplaints = formState.Complaints.map((entry) => {
        if (entry.Complaint) {
          const { complaint, complaintCode } = entry.Complaint;
          return {
            ...entry,
            complaint,
            complaintCode,
          };
        }
        return entry;
      }) // Remove the old Complaint key
  
      setFormState((prevState) => ({
        ...prevState,
        Complaints: flattenedComplaints
      }));
    }
  }

  const handlePrescription = () => {
    if (formState.Prescription && Array.isArray(formState.Prescription) && formState.Prescription.length > 0) {
      const updatedPrescription = formState.Prescription.map((entry) => {
        // Destructure necessary values from Medicine and Route
        if (entry.Medicine) {
          const { drugName, drugCode } = entry.Medicine;
  
          // Check if Route exists and destructure its values
          const routeName = entry.Route ? entry.Route.routeName : null;
          const routeCode = entry.Route ? entry.Route.routeCode : null;
  
          // Flatten the structure and remove Medicine and Route
          return {
            ...entry,
            drugName,    // Add drugName at the top level
            drugCode,    // Add drugCode at the top level
            routeName,   // Add routeName at the top level (if exists)
            routeCode,   // Add routeCode at the top level (if exists)
            // Remove the Medicine and Route keys from the result
          };
        }
        return entry;
      });
  
      // Set the updated form state
      setFormState((prevState) => ({
        ...prevState,
        Prescription: updatedPrescription
      }));
    }
  };
  
  const handleProcedure = () => {
    if (formState.Procedure && Array.isArray(formState.Procedure) && formState.Procedure.length > 0) {
      const updatedProcedure = formState.Procedure.map((entry) => {
        // Destructure necessary values from Procedure and Complication
        if (entry.Procedure) {
          const { procedurename, procedureCode } = entry.Procedure;
          
          // Destructure Complication values if available
          const complaint = entry.Complication ? entry.Complication.complaint : null;
          const complaintCode = entry.Complication ? entry.Complication.complaintCode : null;
  
          // Flatten the structure and remove Procedure and Complication
          return {
            ...entry,
            procedurename,    // Add procedurename at the top level
            procedureCode,    // Add procedureCode at the top level
            complaint,        // Add complaint at the top level (if exists)
            complaintCode,    // Add complaintCode at the top level (if exists)
            // Remove the Procedure and Complication keys from the result
          };
        }
        return entry;
      });
  
      // Set the updated form state
      setFormState((prevState) => ({
        ...prevState,
        Procedure: updatedProcedure
      }));
    }
  };

  const handleAllergy = () => {
    if (formState.Allergy && Array.isArray(formState.Allergy) && formState.Allergy.length > 0) {
      const updatedAllergy = formState.Allergy.map((entry) => {
        // Destructure necessary values from Allergy History
        if (entry['Allergy History']) {
          const { name, code } = entry['Allergy History'];
  
          // Flatten the structure and remove Allergy History
          return {
            ...entry,
            name,    // Add name at the top level
            code,    // Add code at the top level
            // Remove the Allergy History key from the result
          };
        }
        return entry;
      });
  
      // Set the updated form state
      setFormState((prevState) => ({
        ...prevState,
        Allergy: updatedAllergy
      }));
    }
  };
  
function validatePhone(input) {

    let value = input?.value || "";

    // Remove non-numeric characters
    const sanitizedValue = value.replace(/\D/g, "");

    // Ensure length is within 10 digits
    if (sanitizedValue.length > 10) {
        input.value = sanitizedValue.substring(0, 10);
    } else {
        input.value = sanitizedValue;
    }

    // Update error state
    if (sanitizedValue.length == 0) {
        setError("");
    } 
    
    
    else if (sanitizedValue.length < 10) {
        setError("Phone number must be exactly 10 digits.");
    } else {
        setError(""); // Clear error when valid
    }
}



const handleSingleSelectChange = (sectionLabel, rowIndex, key, selectedOption) => {

if(key == 'Frequency'){
    const selectedValue = selectedOption ? selectedOption.value : null; // Handle null selection
    handleChange(sectionLabel, rowIndex, 'frequency', selectedValue);
  }

  if(key == 'Dosage'){
    const selectedValue = selectedOption ? selectedOption.value : null; // Handle null selection
    handleChange(sectionLabel, rowIndex, 'dosage', selectedValue);
  }
else{
    const selectedValue = selectedOption ? selectedOption.value : null; // Handle null selection
    handleChange(sectionLabel, rowIndex, key, selectedValue);
    
  }
 
};


const toggleSection = (sectionLabel) => {
  setCollapsedSections((prev) => ({
    ...prev,
    [sectionLabel]: !prev[sectionLabel], // Toggle the current state
  }));
};

const handleChangeadiction = (sectionLabel, rowIndex, key, selectedOptions) => {
const selectedValues = selectedOptions.map(option => ({
  Addiction: option.value 
  }));

  handleChange(sectionLabel, rowIndex, key, selectedValues);
};

function validatePulse(value, min, max) {
  // Remove non-numeric characters
  const sanitizedValue = value.replace(/\D/g, "");

  // Convert sanitized value to a number (default to 0 if empty)
  const numberValue = parseInt(sanitizedValue || "0", 10);

  // Clamp the value within the specified range
  if (numberValue > max) return max.toString();
  if (numberValue < min) return min.toString();
  return sanitizedValue; // Return the sanitized and valid value
}




function onInputPulse(event, sectionLabel, idx, attrLabel, min, max) {
  const inputValue = event.target.value;

  // Debounce to ensure smooth user experience
  setTimeout(() => {
    const validValue = validatePulse(inputValue, min, max);
    handleChange(sectionLabel, idx, attrLabel, validValue);
  }, 100); // Adjust delay as needed
}

const handleChange = (sectionLabel, rowIndex, key, value) => {
 
  complaint()
  handlePrescription()
  handleProcedure()
  handleAllergy()

  
  
  
       setFormState((prevState) => {
        const sectionData = prevState[sectionLabel] || [];
        const updatedRow = { ...sectionData[rowIndex], [key]: value };
        const updatedSectionData = [
          ...sectionData.slice(0, rowIndex),
          updatedRow,
          ...sectionData.slice(rowIndex + 1),
        ];
  
        return {
          ...prevState,
          [sectionLabel]: updatedSectionData,
        };
      });
    };




    


    const handleAddRow = (sectionLabel) => {
      setFormState(prevState => ({
          ...prevState,
          [sectionLabel]: [...(prevState[sectionLabel] || [{}]), {}],
        }));
      }
   
    





  

  const handleChangeaHistoryOptions = (sectionLabel, rowIndex, key, selectedOptions) => {
    
    const selectedValues = selectedOptions.map(option => ({
      History: option.value 
      }));
    
      handleChange(sectionLabel, rowIndex, key, selectedValues);
    };

  const handleDeleteRow = (sectionLabel, rowIndex) => {
    if (formState.hasOwnProperty(sectionLabel)) { // Check if sectionLabel exists in formState
        const currentSection = formState[sectionLabel];
      if (currentSection.length > 0) {
          const updatedSection = currentSection.filter((_, idx) => idx !== rowIndex);
           if (updatedSection.length === 0) {
            setFormState((prevState) => {
                    const { [sectionLabel]: _, ...rest } = prevState; 
                    return rest; 
                });
           
            } else {
              
                setFormState((prevState) => ({
                    ...prevState,
                    [sectionLabel]: updatedSection,
                }));
             
            }
        } else {
        }
    } else {
   
    }
};

  const renderInput = (inputType, sectionLabel, objectAttributes) => {
    const attributes = objectAttributes ? objectAttributes.split(',') : [];
    if (inputType === "text_area") {
      return (
        <FormGroup>
          <Input
            type="textarea"
            value={formState[sectionLabel]?.[0]?.note || ""}
            onChange={(e) => handleChange(sectionLabel, 0, 'note', e.target.value)}
            id="notes"
            rows="3"
            placeholder="Enter your notes here"
          />
        </FormGroup>
      );
    }


if (inputType === "tabular_form") {
  const headers = attributes;
  const rows = formState[sectionLabel] || [{}];
 
  return (
    <div>
      <Table>
        <thead>
          <tr>
            {headers.map((attr, idx) => (
              <th key={idx}>

               {attr}
              </th>
            ))}
            <th style={{display:"flex",justifyContent:"flex-end"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
        {rows.map((row, rowIndex) => (
  <tr key={rowIndex}>
    {headers.map((attr, idx) => (
      

     
      <td key={idx}>
        {attr === "Allergy History" ? (
          <Select
            
            options={allergyOptions}
            value={
              row[attr]
                ? {
                    value: row[attr],
                    label: row[attr].name
                    ,
                  }
                : null
            }
            onChange={(selectedOption) =>
              handleSingleSelectChange(sectionLabel, rowIndex, attr, selectedOption)
            }
            placeholder="Select allergies"
          />
        ) : attr === "Complaint" ? (
          <Select
          options={complaintOptions}
          value={
            row[attr]
              ? {
                  value: row[attr],
                  label: row[attr].complaint,
                }
              : null
          }
          onChange={(selectedOption) =>
            handleSingleSelectChange(sectionLabel, rowIndex, attr, selectedOption)
          }
          placeholder="Select a complaint"


          styles={{
            control: (base) => ({
              ...base,
              width: 'max-content', // Adjust the control width
               minWidth: '100px', // Optional: Set a minimum width for better appearance
               maxWidth:'190px',
               minHeight:'12px',
               maxHeight:'80px'
            }),
           
          }}
        />
        ) 


        : attr === "Method" ? (
          <Select
                    options={method}
                    onChange={(selectedOption) =>
                      handleSingleSelectChange(sectionLabel, rowIndex, 'method', selectedOption)
                    }
                    placeholder="Instruction"
                    id="medicine"
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: 'max-content', // Adjust the control width
                         minWidth: '100px', // Optional: Set a minimum width for better appearance
                         maxWidth:'120px'
                      }),
                     
                    }}
                  />
        ) 
        
:

 attr === "Reason" ? (
  <Input
            options={method}
            // onChange={(selectedOption) =>
            //   handleSingleSelectChange(sectionLabel, rowIndex, 'eason', selectedOption)
            // }


            onChange={(e) => handleChange(sectionLabel, rowIndex, 'reason', e.target.value)}
            placeholder="reason"
            id="medicine"
            styles={{
              control: (base) => ({
                ...base,
                width: 'max-content', // Adjust the control width
                 minWidth: '100px', // Optional: Set a minimum width for better appearance
                 maxWidth:'120px'
              }),
             
            }}
          />
) 
:

 attr === "Rotation in days" ? (
  <Input
            options={method}
            // onChange={(selectedOption) =>
            //   handleSingleSelectChange(sectionLabel, rowIndex, 'eason', selectedOption)
            // }


            onChange={(e) => handleChange(sectionLabel, rowIndex, 'days', e.target.value)}
            placeholder="Days"
            id="medicine"
            styles={{
              control: (base) => ({
                ...base,
                width: 'max-content', // Adjust the control width
                 minWidth: '100px', // Optional: Set a minimum width for better appearance
                 maxWidth:'130px'
              }),
             
            }}
          />
) 
:
        attr === "Dose Time" ? (
          <Select
          options={Dosagetime}
          onChange={(selectedOption) =>
            handleSingleSelectChange(sectionLabel, rowIndex, 'Dosage', selectedOption)
          }
          placeholder="Dosage"
            styles={{
            control: (base) => ({
              ...base,
              width: 'max-content', // Adjust the control width
               minWidth: '100px', // Optional: Set a minimum width for better appearance
               maxWidth:'100px'
            }),
           
          }}
        />
        ) 
        : 
        attr === "Medicine" ? (


<Select
          options={medicineOptions}
          value={
            row[attr]
              ? {
                  value: row[attr],
                  label: row[attr].drugName,
                }
              : null
          }
          onChange={(selectedOption) =>
            handleSingleSelectChange(sectionLabel, rowIndex, attr, selectedOption)
          }
          placeholder="Medicine"
          id='medicine'
          styles={{
            control: (base) => ({
              ...base,
              width: 'max-content', // Adjust the control width
               minWidth: '100px', // Optional: Set a minimum width for better appearance
               maxWidth:'120px'
            }),
           
          }}
        />

        ) 
        
        
        
        :
        
        attr === "Route" ? (


          <Select
          options={root}
          onChange={(selectedOption) =>
            handleSingleSelectChange(sectionLabel, rowIndex, attr, selectedOption)
          }
          placeholder="Route"
          id="medicine"
          styles={{
            control: (base) => ({
              ...base,
              width: 'max-content', // Adjust the control width
               minWidth: '100px', // Optional: Set a minimum width for better appearance
               maxWidth:'120px'
            }),
           
          }}
        />
          
         )
         :
        
         
        
                  attr === "Instruction" ? (
          
                   <Select
                    options={instruction}
                    onChange={(selectedOption) =>
                      handleSingleSelectChange(sectionLabel, rowIndex, 'instruction', selectedOption)
                    }
                    placeholder="Instruction"
                    id="medicine"
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: 'max-content', // Adjust the control width
                         minWidth: '100px', // Optional: Set a minimum width for better appearance
                         maxWidth:'120px'
                      }),
                     
                    }}
                  />
                    
                            
                    
                            )
                  
                            :     

                            attr === "Procedure" ? (
                              <Select
                                       options={procedure}

                                       value={
                                        row[attr]
                                          ? {
                                              value: row[attr],
                                              label: row[attr].procedurename,
                                            }
                                          : null
                                      }
                                       onChange={(selectedOption) =>
                                         handleSingleSelectChange(sectionLabel, rowIndex, attr, selectedOption)
                                       }
                                       placeholder="Select procedure"
                                       id="medicine"
                                       styles={{
                                         control: (base) => ({
                                           ...base,
                                           width: 'max-content', // Adjust the control width
                                           // minWidth: '150px', // Optional: Set a minimum width for better appearance
                                         }),
                                        
                                       }}
                                     />
                                    )
                  
                                    :  



                                    attr === "Complication" ? (
                                      <Select
                                               options={complaintOptions}
                                               onChange={(selectedOption) =>
                                                 handleSingleSelectChange(sectionLabel, rowIndex, attr, selectedOption)
                                               }
                                               placeholder="Select Complication"
                                               id="medicine"
                                               styles={{
                                                 control: (base) => ({
                                                   ...base,
                                                   width: 'max-content', // Adjust the control width
                                                   // minWidth: '150px', // Optional: Set a minimum width for better appearance
                                                 }),
                                                
                                               }}
                                             />
                                            )
                          
                                            :  





                                            attr === "Test Name" ? (
                                              <Select
                                                       options={investigations}


                                                       value={
                                                        row[attr]
                                                          ? {
                                                              value: row[attr],
                                                              label: row[attr].TestName,
                                                            }
                                                          : null
                                                      }
                                                      
                                                       onChange={(selectedOption) =>
                                                         handleSingleSelectChange(sectionLabel, rowIndex, attr, selectedOption)
                                                       }
                                                       placeholder="Select Test"
                                                       id="Test"
                                                       styles={{
                                                         control: (base) => ({
                                                           ...base,
                                                           width: 'max-content', // Adjust the control width
                                                           // minWidth: '150px', // Optional: Set a minimum width for better appearance
                                                         }),
                                                        
                                                       }}
                                                     />
                                                    )
                                  
                                                  
                                                            :  


                                                   
                                                    attr.includes("Investigation Rate")  ? (
                                                      <Input
                                                      placeholder='Rate'
      value={
        formState.Investigations
          ? formState.Investigations.map((investigation, index) =>
              // Check if Test Name exists and rate is available for each investigation
              investigation["Test Name"] && investigation["Test Name"].rate
                ? investigation["Test Name"].rate // If rate exists, use it
                : "" // If not, fallback to an empty string
            )[rowIndex] || "" // Target the rate at the current index
          : "" // Default to an empty string if Investigations are not present
      }
    />
                                                            )
                                          
                                                            :  






                                                            

        
        (
          <Input
  type={attr !== "Date" && attr !== "Performed Date" ? "text" : "date"}
  value={row[attr] || ""}
  placeholder={` ${attr}`}
  onChange={(e) => handleChange(sectionLabel, rowIndex, attr, e.target.value)}
  onInput={(e) => validateDateInput(e.target)}
  id="dateInput"
  
  {...(attr === "Performed Date"
    ? {
      max: new Date().toISOString().split("T")[0],
      }
    : attr === "Date"
    ? {
        max: new Date().toISOString().split("T")[0], // Restrict to past dates for "Date"
      }
    : {})}


    
/>

        
        )}
      </td>
    ))}
    <td style={{display:"flex",justifyContent:"flex-end"}}>
    <Button 
    color="danger" 
    onClick={() => handleDeleteRow(sectionLabel, rowIndex)} 
    // disabled={rowIndex === 0} // Disable button if rowIndex is 0
>
    Delete
</Button>

    </td>
  </tr>
))}
 </tbody>
      </Table>
      <Button
        color="success"
        onClick={() => handleAddRow(sectionLabel)}
        style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      >
        Add {sectionLabel}
      </Button>
    </div>
  );
}



  const attributesList = objectAttributes.split(',');
    return (
      <div className="history" style={{ display: "flex", flexDirection: "row", gap: "1rem" ,justifyContent:"space-between"}}>
      {attributesList.map((attribute, idx) => {
       
        if (attribute.includes("Addiction")) {
          // Render select dropdown for Addiction with a list of options
       
          return (
            <FormGroup key={idx}>
              <Label for="addiction">Addiction</Label>
              <Select
    isMulti
    id="addiction"
    options={addictionOptions}
   
    onChange={(selectedOptions) => 
      handleChangeadiction(
        sectionLabel,
        0,
        "Addiction",
        selectedOptions
      )
    }
    placeholder="Select addictions"
  />
            </FormGroup>
          );
        } 
        
        




        else if (attribute.includes("Phone")) {
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
              <div style={{ marginBottom: "16px" }}>
            <Input
                type="text" // "text" for better control
                placeholder="Enter Phone Number"
                maxLength={10} // Limit input length to 10 characters
                onInput={(e) => validatePhone(e.target)} // Validate on input
                onChange={(e) => handleChange(sectionLabel, 0, "Phone", e.target.value)} // Update parent state
                style={{
                    border: error ? "1px solid red" : "1px solid #ccc", // Red border if there's an error
                    outline: "none",
                    padding: "8px",
                    borderRadius: "4px",
                    width: "100%",
                }}
            />
            {error && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {error}
                </div>
            )}
        </div>
            </FormGroup>
          );
        }



        else if (attribute.includes("Doctor Name")) {
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
              <Input
                type="text" // Use "text" to allow fine-grained control
                placeholder="Enter Doctor Name"
             
              // onInput={(e) => validatePhone(e.target)}
                onChange={(e) => handleChange(sectionLabel, 0, 'Doctor Name', e.target.value)}
              
              />
            </FormGroup>
          );
        }
        
        
          

          
        else if (attribute.includes("Medical History")) {
        
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
             








<Select
        isMulti
        options={HistoryOptions}
         
        onChange={(selectedOption) =>
          handleChangeaHistoryOptions(sectionLabel,  0, "Medical History", selectedOption)
        }



        
        placeholder="Select a History"
      />


            </FormGroup>
          );
        }


      





        
        else if (attribute.includes("Surgical History")) {
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
              <Input
                type="textarea"
                id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
                placeholder={`Enter ${attrLabel}`}
              />
            </FormGroup>
          );
        }



        else if (attribute.includes("Performed Date")) {
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
              <Input
                type="date"
                id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}

                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
                onInput={(e) => validateDateInput(e.target)}
                placeholder={`Enter ${attrLabel}`}
              />
            </FormGroup>
          );
        }
        
        else if (attribute.includes("Note")) {
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
              <Input
                type="textarea"
                id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
                placeholder={`Enter ${attrLabel}`}
              />
            </FormGroup>
          );
        }


         else if (attribute.includes("Date")) {
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
              <Input
  type="datetime-local"
  id='followupdate'
  value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
  onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
  onInput={(e) => validateDateInput(e.target)}
  placeholder={`Enter ${attrLabel}`}
  min={new Date().toISOString().split("T")[0]} // Set the minimum date to today
/>

            </FormGroup>
          );
        }
        

        else if (attribute.includes("Any Family History")) {
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
              <Input
                type="textarea"
                id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
                placeholder={`Enter ${attrLabel}`}
              />
            </FormGroup>
          );
        }





        else if (attribute.includes("Pulse")) {

          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
             

              <Input
                type="number"
             min="20"
             max='300'
              id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
                onBlur={(e) => onInputPulse(e, sectionLabel, 0, attrLabel, 20, 300)}               />
              
            </FormGroup>
          );
        }

        else if (attribute.includes("Respiration")) {
          
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
             

              <Input
                type="number"
              
  step="1" 
   min="20"
             max='300'
                id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
                onBlur={(e) => onInputPulse(e, sectionLabel, 0, attrLabel,  10, 200)} // Pass parameters specific to "Respiration"                placeholder="per min"
              />
              
            </FormGroup>
          );
        }


        else if (attribute.includes("Temperature")) {
          let digit  = 3
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
             

              <Input
                type="number"
             min='95'
             max='115'
  step="1" // Optional: Defines the step increment for the number
                id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
            
                onBlur={(e) => onInputPulse(e, sectionLabel, 0, attrLabel, 95,115 )} // Pass parameters specific to "Pulse"

                placeholder="°F"
              />
              
            </FormGroup>
          );
        }


        else if (attribute.includes("JVP")) {
          let digit  = 3
          // Render default text input for other attributes
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
             

              <Input
                type="number"
             min='1'
             max='99'
  step="1" // Optional: Defines the step increment for the number
                id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
            
                onBlur={(e) => onInputPulse(e, sectionLabel, 0, attrLabel, 1,99)} // Pass parameters specific to "Pulse"

                placeholder="°F"
              />
              
            </FormGroup>
          );
        }



        else if (attribute.includes("Blood Pressure")) {
          // Normalize the attribute to replace spaces with underscores
          const attrLabel = attribute.trim().replace(/\s+/g, "_"); // Replace spaces with underscores
          const systolicValue =
              formState[sectionLabel]?.[0]?.[`${attrLabel}_Systolic`] || ""; // Systolic value
          const diastolicValue =
              formState[sectionLabel]?.[0]?.[`${attrLabel}_Diastolic`] || ""; // Diastolic value
      
          const handleSystolicChange = (e) => {
              const value = e.target.value;
              if (!isNaN(value) && value <= 300) { // Validate systolic input
                  handleChange(sectionLabel, 0, `${attrLabel}_Systolic`, value);
              }
          };
      
          const handleDiastolicChange = (e) => {
              const value = e.target.value;
              if (!isNaN(value) && value <= 200) { // Validate diastolic input
                  handleChange(sectionLabel, 0, `${attrLabel}_Diastolic`, value);
              }
          };
      
          return (
              <FormGroup key={idx}>
                  <Label for={attrLabel}>{attribute}</Label> {/* Keep original label for display */}
                  <div style={{ display: "flex", gap: "10px" }}>
                      <Input
                          type="number"
                          min="50"
                          max="300"
                          id={`${attrLabel}_Systolic`}
                          value={systolicValue}
                          onChange={handleSystolicChange}

                          onBlur={(e) => onInputPulse(e, sectionLabel, 0, attrLabel, 50,300)} // Pass parameters specific to "Pulse"

                          
                          placeholder="Systolic"
                      />
                      <Input
                          type="number"
                          min="30"
                          max="200"
                          id={`${attrLabel}_Diastolic`}
                          value={diastolicValue}
                          onChange={handleDiastolicChange}
                          onBlur={(e) => onInputPulse(e, sectionLabel, 0, attrLabel, 30,200)} // Pass parameters specific to "Pulse"

                          placeholder="Diastolic"
                      />
                  </div>
              </FormGroup>
          );
      }
      
        



        else {
          // Render default text input for other attributes
          let digit  = 2
          const attrLabel = attribute.trim();
          return (
            <FormGroup key={idx}>
              <Label for={attrLabel}>{attrLabel}</Label>
              <Input
                type="text"
                
                id={attrLabel}
                value={formState[sectionLabel]?.[0]?.[attrLabel] || ""}
                onChange={(e) => handleChange(sectionLabel, 0, attrLabel, e.target.value)}
                // onInput={(e) => validatePulse(e.target,digit)}
                // onBlur={(e) => onInputPulse(e, sectionLabel, 0, attrLabel, 2, 1, 99)} // Pass parameters specific to "Pulse"

                placeholder={`${attrLabel}`}
              />
            </FormGroup>
          );
        }
      })}
    </div>
    
    
    );
  };

  const renderVitals = () => (
    <Row style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      <Col md={2}>
        <FormGroup>
          <Label for="pulse">Pulse</Label>
          <Input
            type="text"
            
            value={formState['vitals']?.[0]?.Pulse || ""}
            onChange={(e) => handleChange('vitals', 0, 'Pulse', e.target.value)}
            id="pulse"
            placeholder="e.g., 72 bpm"
          />
        </FormGroup>
      </Col>
      <Col md={2}>
        <FormGroup>
          <Label for="respiration">Respiration</Label>
          <Input
            type="text"
            value={formState['vitals']?.[0]?.Respiration || ""}
            onChange={(e) => handleChange('vitals', 0, 'Respiration', e.target.value)}
            id="respiration"
            placeholder="e.g., 16 breaths/min"
          />
        </FormGroup>
      </Col>
      <Col md={2}>
        <FormGroup>
          <Label for="temperature">Temperature</Label>
          <Input
            type="text"
            value={formState['vitals']?.[0]?.Temperature || ""}
            onChange={(e) => handleChange('vitals', 0, 'Temperature', e.target.value)}
            id="temperature"
            placeholder="e.g., 36.6 °C"
          />
        </FormGroup>
      </Col>
      <Col md={2}>
        <FormGroup>
          <Label for="bloodPressure">Blood Pressure</Label>
          <Input
            type="text"
            value={formState['vitals']?.[0]?.BloodPressure || ""}
            onChange={(e) => handleChange('vitals', 0, 'BloodPressure', e.target.value)}
            id="bloodPressure"
            placeholder="e.g., 120/80 mmHg"
          />
        </FormGroup>
      </Col>
      <Col md={2}>
        <FormGroup>
          <Label for="jvp">JVP</Label>
          <Input
            type="text"
            value={formState['vitals']?.[0]?.JVP || ""}
            onChange={(e) => handleChange('vitals', 0, 'JVP', e.target.value)}
            id="jvp"
            placeholder="e.g., Normal"
          />
        </FormGroup>
      </Col>
    </Row>
  );

  return (
    <Container  style={{
      border: '1px solid black',
      padding: '10px',
      margin: '0 auto',
      // maxWidth: '1200px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
    <Card>
      {/* <CardBody> */}

        <h2 className="text-center mt-2 header-text_Erx">Electronic Prescription Form</h2>

        <PatientHeader />
        {data?.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <h5 
              style={{ cursor: 'pointer' }} 
              onClick={() => toggleSection(section.sectionLabel)}
            >
              {section.sectionLabel} {collapsedSections[section.sectionLabel] ? '' : ''}
            </h5>
            {!collapsedSections[section.sectionLabel] && (
              <div>
                {section.sectionLabel === 'vitals' 
                  ? renderVitals() 
                  : renderInput(section.inputType, section.sectionLabel, section.objectAttributes)
                }
              </div>
            )}
          </div>
        ))}
        <Footer formState={formState} setFormState={setFormState} />
      {/* </CardBody> */}
    </Card>
  </Container>
  );
};

export default DynamicForm;

