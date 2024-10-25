import React from "react";
import EmptyState from "../components/EmptyState";
import TripsClient from "../components/TripsClient";
import { useRecoilValue } from "recoil";
import { ListingReservationState, userAuthState } from "../recoil/atoms";

const ReservationsPage:React.FC =  () => {
  const userState  = useRecoilValue(userAuthState)

  if (!userState.isAuthenticated) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login"
      />
    )
  }

  const reservations = useRecoilValue(ListingReservationState(userState.userId));

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        subtitle="Looks like you have no reservations on your properties."
      />  
    );
  }

  return (
    <TripsClient
      reservations={reservations}
    />
  );
}
 
export default ReservationsPage;