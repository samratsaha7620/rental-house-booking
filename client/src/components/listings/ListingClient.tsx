import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { differenceInDays,eachDayOfInterval } from 'date-fns';

import { useLoginModal } from '../../hooks/useLoginModal'
import { categories } from '../navbar/Categories';
import ListingHead from './ListingHead';
import ListingInfo from './ListingInfo';
import ListingReservation from './ListingReservation';
import { useRecoilValue } from 'recoil';
import { ListingReservationState, userAuthState } from '../../recoil/atoms';
import toast from 'react-hot-toast';
import { Range } from 'react-date-range';
import axios from 'axios';
import { BACKEND_URL } from '../../config';


const initialDateRange = {
  startDate: new Date(),
  endDate:new Date(),
  key:"selection"
}

const ListingClient:React.FC<any> = ({
  listing,
  id
}) => {
  const [refreshTrigger,setRefreshTrigger] = useState(false);
  const userState   = useRecoilValue(userAuthState)
  const loginModal = useLoginModal();
  const navigate =  useNavigate();
  const reservations = useRecoilValue(ListingReservationState({listingId:id,refreshTrigger }));

  const disabledDates = useMemo(() =>{
    let dates: Date[] = [];

    reservations.forEach((reservation:any) =>{
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates , ...range];
    })
    console.log(dates);
    return dates;
  },[reservations])

  const category = useMemo(() =>{
    return categories.find((item) =>
    item.label === listing.category
    )
  },[listing.category])

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onCreateReservation = useCallback(() =>{
    if(!userState.isAuthenticated){
      return loginModal.onOpen();
    }
    setIsLoading(true);
    console.log(totalPrice,dateRange.startDate,dateRange.endDate,listing.id)
    axios.post(`${BACKEND_URL}/api/v1/reservations/reserve`,{
      totalPrice,
      startDate:dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id
    },{
      headers:{
        Authorization: "Bearer " + localStorage.getItem("authToken")
      }
    })
    .then(() =>{
      toast.success('Listing reserved!');
      setDateRange(initialDateRange);
      setRefreshTrigger(prev => !prev);
      navigate('/trips')
    })
    .catch(() => {
      toast.error('Something went wrong. ')
    })
    .finally(() =>{
      setIsLoading(false);
    })
    
  },[totalPrice, 
    dateRange, 
    listing?.id,
    navigate,
    userState,
    loginModal])

  useEffect(() =>{
    if(dateRange.startDate && dateRange.endDate){
      const dayCount = differenceInDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if(dayCount && listing.price){
        setTotalPrice(dayCount * listing.price)
      }else{
        setTotalPrice(listing.price)
      }
    }
  },[dateRange , listing.price])

  return (
    <>
      <div className="
          max-w-screen-lg 
          mx-auto
        ">
          <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imagesrc={listing.imagesrc}
            locationValue={listing.locationValue}
            id={listing.id}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListingClient;
