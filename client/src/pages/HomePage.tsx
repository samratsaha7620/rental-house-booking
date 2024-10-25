import React, { useEffect } from "react"
import Listing from "../components/Listing"
import { useRecoilState } from "recoil";
import { allListingState } from "../recoil/atoms";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { ListingsParams } from "../types";


interface HomePageProps {
  searchParams: ListingsParams
}

const HomePage:React.FC<HomePageProps>= ({searchParams}) => {
  const [allListings,setAllListings]  = useRecoilState(allListingState);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //@ts-ignore
        const queryString = new URLSearchParams(searchParams).toString();
        const resp = await axios.get(`${BACKEND_URL}/api/v1/listings?${queryString}`);
        setAllListings(resp.data.listing);
        
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, [searchParams ,setAllListings]);
  return (
    <>
      <div className="pb-20 pt-20 px-20">
        <Listing
        allListings={allListings}
        />
      </div>
    </>    
  )
}

export default HomePage;
