import React from 'react';


import EmptyState from './EmptyState';
import ListingCard from './ListingCard';

interface ListingProps{
  allListings:any,
}
const Listing:React.FC<ListingProps>= ({allListings}) => {

  if (allListings.length === 0) {
    return (
      <EmptyState showReset />
    );
  }
  return (
   
    <div className='
    my-14
    pt-24
    grid 
    grid-cols-1 
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-4
    xl:grid-cols-5
    2xl:grid-cols-6
    gap-8
    '>
      {allListings.map((listing: any) => (
        <ListingCard
          key={listing.id}
          data={listing}
        />
      ))}
    </div>
    
  )
}

export default Listing;
