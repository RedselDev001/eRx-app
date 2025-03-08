import { useEffect } from "react";
// import { useAuth } from "./authContext";
import { useNavigate } from "react-router-dom";
import {Live} from "./Config";
function Callback() {
  // const { setToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchToken = async () => {
      debugger
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      const state = urlParams.get('state'); 
      if (code) {
        try {
          const credentials = btoa("react-ui-client-7050:react_secret7050");
          const response = await fetch(`${Live.Auth}/oauth2/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${credentials}`,
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: `${Live.redirectUri}/login/oauth2/code/react-ui-client-7050-oidc`,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch token");
          }
          const data = await response.json();
          // setToken(data.access_token);
          localStorage.setItem('admissionId', state);
          localStorage.setItem("access_token", data.access_token);
          // navigate("/dashboard/Home");
          if (state) {
            // Store admissionId in localStorage
            localStorage.setItem('admissionId', state);
          
            // Determine navigation path using a switch case
            switch (true) {
              case state.includes('new'):
                // Redirect to HomeErx if 'new' is in state
                navigate('/dashboard/Home');
                break;
          
              case state.includes('view'):
                // Redirect to Pdf page if 'view' is in state
             
                const retrievedData = JSON.parse(localStorage.getItem("id"));
              
                 const encodedId = btoa(retrievedData.id);
                // Navigate with the encrypted id in the URL
                navigate(`/dashboard/Pdf/${encodedId}`);
              
                break;
          
              default:
                // Default case for admissionSheet
                navigate(`/dashboard/analytics`);
                break;
            }
          } 
          
          else {
            // Default navigation if state is missing
            navigate('/dashboard/analytics');
          }
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }
    };
    fetchToken();
  }, [ navigate]);
  return null;
}
export default Callback;