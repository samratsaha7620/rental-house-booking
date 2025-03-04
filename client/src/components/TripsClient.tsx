import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";

import { useNavigate } from "react-router-dom";
import Heading from "./Heading";

import ListingCard from "./ListingCard";
import { BACKEND_URL } from "../config";


interface TripsClientProps {
  reservations: [],
}

const TripsClient:React.FC<TripsClientProps> = ({
  reservations,
}) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`${BACKEND_URL}/api/reservations/${id}`)
    .then(() => {
      toast.success('Reservation cancelled');
      navigate(0);
    })
    .catch((error) => {
      toast.error(error?.response?.data?.error)
    })
    .finally(() => {
      setDeletingId('');
    })
  }, [navigate]);
  return (
    <div>
      <Heading
        title="Trips"
        subtitle="Where you've been and where you're going"
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
        {reservations.map((reservation: any) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel reservation"
          />
        ))}
      </div>
    </div>
   );
}

export default TripsClient;