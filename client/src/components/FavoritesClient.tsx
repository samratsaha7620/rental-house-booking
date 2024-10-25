import Heading from "./Heading";
import Container from "./Container";
import ListingCard from "./ListingCard";
import { useRecoilValue } from "recoil";
import { favoriteListingsState } from "../recoil/atoms";

const FavoritesClient: React.FC<any> = () => {
  const favoriteListings = useRecoilValue(favoriteListingsState);
  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of places you favorited!"
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
        {favoriteListings.map((listing: any) => (
          <ListingCard
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
   );
}
 
export default FavoritesClient;