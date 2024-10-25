import { useRecoilState, useRecoilValue } from "recoil";
import EmptyState from "../components/EmptyState";
import PropertiesClient from "../components/PropertiesClient";
import { userAuthState, userPropertiesState } from "../recoil/atoms";
import { useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const PropertiesPage:React.FC = () => {
  const userState  = useRecoilValue(userAuthState)

  if (!userState.isAuthenticated) {
    return <EmptyState
      title="Unauthorized"
      subtitle="Please login"
    />
  }

  const [listings,setListings] = useRecoilState(userPropertiesState);

  useEffect(()=>{
    const fetchProperties = async () => {
      try {
        const resp = await axios.get(`${BACKEND_URL}/api/v1/listings/my-properties`,{
          headers:{
            Authorization: "Bearer " + localStorage.getItem("authToken")
          }
        });
        setListings(resp.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    fetchProperties();
  },[setListings])

  if (listings.length === 0) {
    return (   
        <EmptyState
          title="No properties found"
          subtitle="Looks like you have no properties."
        /> 
    );
  }

  return (
      <PropertiesClient
      />
  );
}

export default PropertiesPage;
