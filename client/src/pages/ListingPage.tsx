import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil'
import {publicListingsState } from '../recoil/atoms'
import EmptyState from '../components/EmptyState';
import ListingClient from '../components/listings/ListingClient';


const Loading = () => {
  return(
    <div>
      <EmptyState/>
    </div>
  )
}

const ListingPage:React.FC<any> = () => {
  const {id} = useParams<{id:string}>();
  const listing = useRecoilValue(publicListingsState(id));
  
  return (
    <div  className='pt-24'>
      <ListingClient
      listing= {listing}
      id ={id}
      />
    </div>
  )
}
const ListingClientWithSuspense = () => (
  <Suspense fallback={<Loading />}>
    <ListingPage />
  </Suspense>
);
export default ListingClientWithSuspense;


