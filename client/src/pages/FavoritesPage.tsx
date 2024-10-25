import EmptyState from "../components/EmptyState";

import FavoritesClient from "../components/FavoritesClient";
import { useRecoilState } from "recoil";
import { favoriteListingsState } from "../recoil/atoms";
import React, { useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const FavoritesPage:React.FC =  () => {
  const [favoriteListings, setFavoriteListings] = useRecoilState(favoriteListingsState);
  

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/favourites`,{
          headers:{
            Authorization: "Bearer " + localStorage.getItem("authToken")
          }
        });
        setFavoriteListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setFavoriteListings([]);
      }
    };

      
    fetchListings();
  }, [setFavoriteListings]);

  if (favoriteListings.length === 0) {
    return (
      
        <EmptyState
          title="No favorites found"
          subtitle="Looks like you have no favorite listings."
        />
      
    );
  }

  return (
      <FavoritesClient
      />
    
  );
}
 
export default FavoritesPage;