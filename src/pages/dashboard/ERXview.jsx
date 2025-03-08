import React, { useState, useEffect } from 'react';

const DynamicSections = ({ data,profile }) => {


  const [loading, setLoading] = useState(true);
  
  
  const safeParse = (jsonStr) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Error parsing description JSON:', e);
      return {}; // Return an empty object in case of error
    }
  };

  // Rendering functions for each section
  const renderMedicationsTable = (description) => {
   
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>
         Medications
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={styles.header}>Medication Name</th>
              <th style={styles.header}>Purpose</th>
              <th style={styles.header}>Dosage</th>
              <th style={styles.header}>Route</th>
              <th style={styles.header}>Frequency</th>
            </tr>
          </thead>
          <tbody>
          {description.medications?.map((medication, index) => {
  // Normalize the keys of the medication object
  const normalizedMedication = Object.fromEntries(
    Object.entries(medication).map(([key, value]) => [key.trim(), value])
  );

  return (
    <tr key={index}>
      <td style={styles.cell}>{normalizedMedication.Medicine?.medicine || 'NA'}</td>
      <td style={styles.cell}>{normalizedMedication.Instruction || 'NA'}</td>
      <td style={styles.cell}>{normalizedMedication.Dosage || 'NA'}</td>
      <td style={styles.cell}>{normalizedMedication.Route?.rootName || 'NA'}</td>
      <td style={styles.cell}>{normalizedMedication.Frequency || 'NA'}</td>
    </tr>
  );
})}

          </tbody>
        </table>
      </div>
    );
  };

  const renderPrescription = (description) => {
    debugger
    // Normalize keys for consistent access
    const normalizedDescription = Object.fromEntries(
      Object.entries(description).map(([key, value]) => [key.trim(), value])
    );
  
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Prescription</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={styles.header}>Medicine</th>
              <th style={styles.header}>Dosage</th>
              <th style={styles.header}>Route</th>
              <th style={styles.header}>Frequency</th>
              <th style={styles.header}>Instruction</th>
            </tr>
          </thead>
          <tbody>
            {normalizedDescription.medications?.map((medication, index) => (
              <tr key={index}>
                <td style={styles.cell}>{medication.Medicine?.drugName || 'NA'}</td>
                <td style={styles.cell}>{medication['Dosage'] || 'NA'}</td>
                <td style={styles.cell}>{medication.Route?.routeName || 'NA'}</td>
                <td style={styles.cell}>{medication['Frequency'] || 'NA'}</td>
                <td style={styles.cell}>{medication['Instruction Note'] || 'NA'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

  const renderQuickNotes = (description) => {
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Quick Notes</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={styles.header}>Content</th>
              <th style={styles.header}>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.cell}>{description.content || 'NA'}</td>
              <td style={styles.cell}>{description.textArea || 'NA'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  

  const renderComplaintsTable = (description) => {
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Complaints</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={styles.header}>Complaint</th>
              <th style={styles.header}>Frequency</th>
              <th style={styles.header}>Severity</th>
              <th style={styles.header}>Duration</th>
              <th style={styles.header}>Date</th>
            </tr>
          </thead>
          <tbody>
           {description.table?.map((complaint, index) => {
  // Normalize the keys of the complaint object
  const normalizedComplaint = Object.fromEntries(
    Object.entries(complaint).map(([key, value]) => [key.trim(), value])
  );

  return (
    <tr key={index}>
      <td style={styles.cell}>{normalizedComplaint.Complaint?.complaint || 'NA'}</td>
      <td style={styles.cell}>{normalizedComplaint.Frequency || 'NA'}</td>
      <td style={styles.cell}>{normalizedComplaint.Severity || 'NA'}</td>
      <td style={styles.cell}>{normalizedComplaint.Duration || 'NA'}</td>
      <td style={styles.cell}>{normalizedComplaint.Date || 'NA'}</td>
    </tr>
  );
})}

          </tbody>
        </table>
      </div>
    );
  };

  const renderHistory = (description) => {
    // Normalize keys for consistent access
    const normalizedDescription = Object.fromEntries(
      Object.entries(description).map(([key, value]) => [key.trim(), value])
    );
  
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={styles.header}>Surgical History</th>
              <th style={styles.header}>Family History</th>
              <th style={styles.header}>Addictions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.cell}>
                {normalizedDescription['Surgical History'] || 'NA'}
              </td>
              <td style={styles.cell}>
                {normalizedDescription['Any Family History'] || 'NA'}
              </td>
              <td style={styles.cell}>
                {normalizedDescription.Addiction?.map((add) => add.Addiction).join(', ') || 'NA'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  

  const renderNextVisit = (description) => {
    
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Follow up </h2>
        <p style={styles.text}>
          <strong>Date: </strong> {description.medications[0]?.Date || 'NA'}
        </p>
      </div>
    );
  };


  const renderInvestigations = (description) => {
    // Normalize the keys to ensure consistent access
    const normalizedDescription = Object.fromEntries(
      Object.entries(description).map(([key, value]) => [key.trim(), value])
    );
  
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Investigations</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={styles.header}>Test Name</th>
              <th style={styles.header}>Rate</th> 
            </tr>
          </thead>
          <tbody>
            {normalizedDescription.medications?.map((medication, index) => (
              <tr key={index}>
                <td style={styles.cell}>{medication['Test Name']?.TestName || 'NA'}</td>
                <td style={styles.cell}>{medication['Test Name']?.rate || 'NA'}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderAdvice = (description) => {
    // Normalize the keys for consistent access
    const normalizedDescription = Object.fromEntries(
      Object.entries(description).map(([key, value]) => [key.trim(), value])
    );
  
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Advice</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={styles.header}>Note</th>
            </tr>
          </thead>
          <tbody>
            {normalizedDescription.medications?.map((medication, index) => (
              <tr key={index}>
                <td style={styles.cell}>{medication.note || 'NA'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

  const renderProcedure = (description) => {
    // Normalize the keys for consistent access
    const normalizedDescription = Object.fromEntries(
      Object.entries(description).map(([key, value]) => [key.trim(), value])
    );
  
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Procedure</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={styles.header}>Procedure Name</th>
              <th style={styles.header}>Note</th>
              <th style={styles.header}>Complication</th>
              <th style={styles.header}>Performed Date</th>
            </tr>
          </thead>
          <tbody>
            {normalizedDescription.medications?.map((medication, index) => (
              <tr key={index}>
                <td style={styles.cell}>{medication.Procedure?.procedurename || 'NA'}</td>
                <td style={styles.cell}>{medication['Note'] || 'NA'}</td>
                <td style={styles.cell}>
                  {medication.Complication?.complaint || 'NA'}
                </td>
                <td style={styles.cell}>{medication['Performed Date'] || 'NA'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  const renderReferredTo = (description) => {
    
    // Normalize the keys for consistent access
    const normalizedDescription = Object.fromEntries(
      Object.entries(description).map(([key, value]) => [key.trim(), value])
    );
  
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Referred To</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={styles.header}>Doctor Name</th>
             
              <th style={styles.header}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {normalizedDescription.medications?.map((medication, index) => (
              <tr key={index}>
                <td style={styles.cell}>{medication['Doctor Name'] || 'NA'}</td>
            
                <td style={styles.cell}>{medication['Phone'] || 'NA'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderAllergy = (description) => {
    // Normalize the keys for consistent access
    const normalizedDescription = Object.fromEntries(
      Object.entries(description).map(([key, value]) => [key.trim(), value])
    );
  
    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Allergy</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={styles.header}>Allergy</th>
              <th style={styles.header}>Allergy Description</th>
            </tr>
          </thead>
          <tbody>
            {normalizedDescription.medications?.map((medication, index) => (
              <tr key={index}>
                 <td style={styles.cell}>{medication["Allergy History"]?.name || "N/A"}</td> 
              
                <td style={styles.cell}>{medication["Allergy Description"]?.trim() || "No Description"}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderVitals = (description) => {
 
    const normalizedDescription = Object.fromEntries(
      Object.entries(description).map(([key, value]) => [key.trim(), value])
    );

    return (
      <div>
        <h2 style={{ textAlign: 'left', color: '#7f1147' }}>Vitals</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={styles.header}>Parameter</th>
              <th style={styles.header}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.cell}>Blood Pressure</td>
              <td style={styles.cell}>
  {normalizedDescription.Vitals.Pressure_Systolic && normalizedDescription.Vitals.Pressure_Diastolic
    ? `${normalizedDescription.
      Vitals.Pressure_Systolic}/${normalizedDescription.
        Vitals.Pressure_Diastolic}`
    : 'NA'}
</td>            </tr>
            <tr>
              <td style={styles.cell}>Temperature</td>
              <td style={styles.cell}>
                {normalizedDescription.Vitals?.Temp?.value
                  ? `${normalizedDescription.Vitals.Temp.value} ${
                      normalizedDescription.Vitals.Temp.fahrenheit ? '°F' : '°C'
                    }`
                  : 'NA'}
              </td>
            </tr>
            <tr>
              <td style={styles.cell}>Pulse</td>
              <td style={styles.cell}>
                {normalizedDescription.Vitals?.Pulse?.value || 'NA'}{' '}
              
              </td>
            </tr>



          
          </tbody>
        </table>
      </div>
    );
  };
  
  // A mapping of section labels to rendering functions
  const renderFunctions = {
    Prescription: renderMedicationsTable,
    'Quick Notes': renderQuickNotes,
    complaints: renderComplaintsTable,
    History: renderHistory,
    'Follow up ': renderNextVisit,
    Prescription: renderPrescription,
    Investigations:renderInvestigations,
    Advice:renderAdvice,
    Procedure:  renderProcedure,
    'Referred To' : renderReferredTo,
    Allergy : renderAllergy,
    Vitals : renderVitals
  
  };

  // Main render function for dynamic sections
  const renderSection = (sectionLabel) => {
    const sectionData = data.find((item) => item.sectionLabel === sectionLabel);
    if (!sectionData) {
      return null; // Return nothing if section data is not available
    }

    // Parse the description safely
    const description = safeParse(sectionData.description);

    // Get the rendering function from the mapping
    const renderFunction = renderFunctions[sectionLabel];
    return renderFunction ? renderFunction(description) : null;
  };

  // Styles
  const styles = {
    header: { padding: '8px', textAlign: 'left', border: '1px solid #ddd' },
    cell: { padding: '8px', border: '1px solid #ddd' },
    text: { marginBottom: '10px' },
  };

  return (
    <div>
      {data?.map((section) => (
        <div key={section.sectionLabel}>{renderSection(section.sectionLabel)}</div>
      ))}
    </div>
  );
};

export default DynamicSections;
