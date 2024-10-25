import React, { useCallback, useState } from "react";
import { useNavigate} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

import Heading from "./Heading";
import Container from "./Container";
import ListingCard from "./ListingCard";
import { BACKEND_URL } from "../config";
import { useRecoilState } from "recoil";
import { userPropertiesState } from "../recoil/atoms";


const PropertiesClient: React.FC<any> = () => {
  const [listings,setUserListings] = useRecoilState(userPropertiesState);
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState('');

  const onDelete = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`${BACKEND_URL}/api/v1/listings/delete-property/${id}`,{
      headers:{
        Authorization:"Bearer " + localStorage.getItem("authToken"),
      }
    })
    .then(() =>{
      toast.success('Listing Deleted');
      
      //@ts-ignore
      setUserListings((prevListings) => prevListings.filter((listing) => listing.id !== id))
    })
    .catch((error) =>{
      toast.error(error?.response?.data?.error)
    })
    .finally(() =>{
      setDeletingId('');
    })
  }, [navigate]);

  return ( 
    <Container>
      <Heading
        title="Properties"
        subtitle="List of your properties"
      />
      <div 
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {listings.map((listing: any) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onDelete}
            disabled={deletingId === listing.id}
            actionLabel="Delete property"
          />
        ))}
      </div>
    </Container>
   );
}
 
export default PropertiesClient;
