import React, { useCallback, useEffect } from 'react'; 
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentUserState, favoriteListingsState, userAuthState } from '../recoil/atoms';
import toast from 'react-hot-toast';
import { useLoginModal } from '../hooks/useLoginModal';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface HeartButtonProps {
  listingId: string,
}

const HeartButton: React.FC<HeartButtonProps> = ({ 
  listingId,
}) => {
  const loginModal = useLoginModal();
  const setFavoriteListings  = useSetRecoilState(favoriteListingsState);
  const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
  const [userState,setUserState] = useRecoilState(userAuthState)
  const favoriteIds:string[] = userState.favoriteIds;

  const hasFavorited =  favoriteIds.find((id) => id === listingId);
  
  useEffect(() => {
    if(userState.isAuthenticated){
      const fetchUserData = async() =>{
        try{
          const resp = await axios.get(`${BACKEND_URL}/api/v1/auth/current-user`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("authToken"),
            }
          });
          setCurrentUser(resp.data); 
        }catch (error) {
          console.error('Error fetching listings:', error);
        }
      }
      fetchUserData();
    }
  },[userState.isAuthenticated,setCurrentUser])
  
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!userState.isAuthenticated) {
        return loginModal.onOpen();
      }

      try {  
        let updatedFavoriteIds :string[]= []  ;
        if (hasFavorited) {
          updatedFavoriteIds= await axios.post(`${BACKEND_URL}/api/v1/favourites/unlike`,{
            listingId
          },{
            headers:{
              Authorization:"Bearer " + localStorage.getItem("authToken")
            }
          });
          //@ts-ignore
          setFavoriteListings((prevstate) => prevstate.filter((listing) => listing.id !== listingId));
        } else {     
          updatedFavoriteIds = await axios.post(`${BACKEND_URL}/api/v1/favourites/like`,{
            listingId
          },{
            headers:{
              Authorization:"Bearer " + localStorage.getItem("authToken")
            }
          });
        }
        setUserState(({prevState}:{prevState:{}}) =>({
          ...prevState,
          isAuthenticated:true,
          //@ts-ignore
          userId: currentUser?.id,
          //@ts-ignore
          favoriteIds:updatedFavoriteIds.data
        }))
        toast.success('Success');
        //navigate(0);
      } catch (error) {
        console.log(error);
        
        toast.error('Something went wrong.');
      }
    },
    [currentUser, hasFavorited, listingId, loginModal]
  );

  return (
    <div 
      onClick={toggleFavorite}
      className="
        relative
        hover:opacity-80
        transition
        cursor-pointer
      "
    >
      <AiOutlineHeart
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />
      <AiFillHeart
        size={24}
        className={
          hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
        }
      />
    </div>
   );
}
 
export default HeartButton;


