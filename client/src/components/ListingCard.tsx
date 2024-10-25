import { useCallback, useMemo } from "react";
//import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import useCountries from "../hooks/useCountries";
// import { 
//   SafeListing, 
//   SafeReservation, 
//   SafeUser 
// } from "@/app/types";

import Button from "./Button";
import ImageComponent from "./ImageComponent";
import HeartButton from "./HeartButton";
import { format } from "date-fns";
// import ClientOnly from "../ClientOnly";

interface ListingCardProps {
  data: any;
  reservation?: any;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
};

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
}) => {
  const navigate = useNavigate();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    onAction?.(actionId)
  }, [disabled, onAction, actionId]);

  const price = useMemo(() => {
    return data.price;
  }, [data.price]);

  const reservationDate = useMemo(() =>{
    if(!reservation){
      return null;
    }
    const start = new Date(reservation.startDate);
    const end =  new Date(reservation.endDate);

    return `${format(start , 'PP')} - ${format(end , 'PP')}`
  },[reservation])

  return (
    <div 
      onClick={() => navigate(`/listings/${data.id}`)} 
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div 
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <ImageComponent
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.imagesrc}
            alt="Listing"
          />
          <div className="
            absolute
            top-3
            right-3
          ">
            <HeartButton
            listingId = {data.id}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate ||data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {price}
          </div>
          {!reservation && (
            <div className="font-light">night</div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel} 
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
   );
}

export default ListingCard;