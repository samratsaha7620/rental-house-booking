import useCountries from "../../hooks/useCountries";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import ImageComponent from "../ImageComponent";


interface ListingHeadProps {
  title: string;
  locationValue: string;
  imagesrc: string;
  id: string;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  imagesrc,
  id,
}) => {
  const { getByValue } = useCountries();

  const location = getByValue(locationValue);

  return ( 
    <>
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="
          w-full
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
        <ImageComponent
          src={imagesrc}
          className="object-cover w-full"
          alt="Image"
        />
        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          <HeartButton 
            listingId={id}
          />
        </div>
      </div>
    </>
   );
}

export default ListingHead;