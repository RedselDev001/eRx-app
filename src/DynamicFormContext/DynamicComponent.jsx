import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Live} from '../pages/auth/Config'; // Adjust the path as necessary

const useData = () => {
  const [data, setData] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('Note');
  const [patientData, setPatientData] = useState(null); // State to store fetched patient data
  const [complain, setComplaints] = useState({
    result1: [],
    Complain: [],
    investigations: [],
    medicinedrug: [],
    allergy: [],
    procedure: [],
  });

  const [apiStatus, setApiStatus] = useState({
    masterList: false,
    complaints: false,
    medicinedrug: false,
    medallergy: false,
    investigations: false,
    procedure: false,
  });

 
 const markApiSuccess = (apiName) => {
    setApiStatus((prevStatus) => ({
      ...prevStatus,
      [apiName]: true,
    }));
  };

  const fetchMasterList = async () => {
    
  
    if (apiStatus.masterList) return; // Prevent multiple calls

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(
        `${Live.Port}/hms/Rx/masterList?facility=opd&speciality=general_medicine`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error('API request failed');

      const result1 = await response.json();
      setData(result1);
      markApiSuccess('masterList');
    } catch (error) {
      console.error('Error fetching master list:', error);
    }
  };

  const fetchComplaints = async () => {
    if (apiStatus.complaints) return; // Prevent multiple calls

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${Live.Port}/hms/complaint/getList`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('API request failed');

      const Complain = await response.json();
      setComplaints((prevData) => ({
        ...prevData,
        Complain: Complain.map((item) => ({
          complaint: item.complaint,
          complaintCode: item.complaintCode,
        })),
      }));
      markApiSuccess('complaints');
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchMedicinedrug = async () => {
    if (apiStatus.medicinedrug) return; // Prevent multiple calls

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${Live.Port}/hms/drugMaster/getMaster`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('API request failed');

      const medicinedrug = await response.json();
      setComplaints((prevData) => ({
        ...prevData,
        medicinedrug: medicinedrug.map((item) => ({
          medicinedrug: item.name,
          complaintCode: item.drugCode,
          routeCode: item.routeCode,
          drugRoute: item.drugRoute,
        })),
      }));
      markApiSuccess('medicinedrug');
    } catch (error) {
      console.error('Error fetching medicinedrug:', error);
    }
  };

  const fetchMedallergy = async () => {
    if (apiStatus.medallergy) return; // Prevent multiple calls

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${Live.Port}/hms/allergy/getList`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('API request failed');

      const allergy = await response.json();
      setComplaints((prevData) => ({
        ...prevData,
        allergy: allergy.map((item) => ({
          Historyname: item.allergy,
          HistoryCode: item.allergyCode,
        })),
      }));
      markApiSuccess('medallergy');
    } catch (error) {
      console.error('Error fetching allergies:', error);
    }
  };

  const fetchInvestigation = async () => {
    if (apiStatus.investigations) return; // Prevent multiple calls

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${Live.Port}/hms/rate/getAllRates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('API request failed');

      const rates = await response.json();
      const investigations = rates
        .filter((item) => item.serviceType === 'Investigation')
        .map((item) => ({
          serviceName: item.serviceName,
          rate: item.rate,
          cptcode: item.cptcode,
        }));

      setComplaints((prevData) => ({
        ...prevData,
        investigations,
      }));
      markApiSuccess('investigations');
    } catch (error) {
      console.error('Error fetching investigations:', error);
    }
  };

  const fetchProcedure = async () => {
    if (apiStatus.procedure) return; // Prevent multiple calls

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${Live.Port}/hms/procedure/getList`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('API request failed');

      const procedure = await response.json();
      setComplaints((prevData) => ({
        ...prevData,
        procedure: procedure.map((item) => ({
          procedurename: item.procedure,
          procedureCode: item.procedureCode,
        })),
      }));
      markApiSuccess('procedure');
    } catch (error) {
      console.error('Error fetching procedures:', error);
    }
  };






  
      const fetchPatientDetails = async () => {
   
        try {
          const token = localStorage.getItem('access_token'); // Get the token from localStorage
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
          setPatientData(data); // Set the fetched data in state
        
          localStorage.setItem("id", JSON.stringify({
            id: data.patientId,
            uhid: data.uhid
        }));
        } catch (error) {
          console.error('Error fetching patient details:', error);
        }
      };
  
    
    

   useEffect(() => {
    const fetchData = async () => {
      await fetchMasterList();
      await fetchComplaints();
      await fetchMedicinedrug();
      await fetchMedallergy();
      await fetchInvestigation();
      await fetchProcedure();
    };


    fetchData();
   }, []); // Empty dependency array ensures this runs only once after component mounts.

  const handleCardClick = useCallback((label) => {
    setSelectedLabel(label);
  }, []);

  const addictionOptions = [
    { value: 'Tobacco', label: 'Tobacco' },
    { value: 'Chewing', label: 'Chewing' },
    { value: 'Alcohol', label: 'Alcohol' },
    { value: 'Drugs', label: 'Drugs' },
    { value: 'Smoking', label: 'Smoking' },
  ];

  const instruction = [
    { value: 'After Lunch', label: 'After Lunch' },
    // Other options...
  ];

  return {
    data,
    selectedLabel,
    handleCardClick,
    setComplaints,
    complain,
    fetchPatientDetails,
    instruction,
    addictionOptions,
    patientData,
  };
};

export default useData;
