import axios from "axios";
import { atom, atomFamily, selectorFamily } from "recoil";
import { BACKEND_URL } from "../../config";


const getLocalStorageValue = (key: string, defaultValue: any) => {
  const savedValue = localStorage.getItem(key);
  return savedValue !== null ? JSON.parse(savedValue) : defaultValue;
};

const setLocalStorageValue = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const userAuthState = atom({
  key:"useAuthState",
  default: getLocalStorageValue('useAuthState', { 
    isAuthenticated: false, 
    userId: "" ,
    favoriteIds: [] as string[],
  }),
  effects: [
    ({ onSet }) => {
      // Whenever the atom state changes, save it to localStorage
      onSet((newValue) => {
        setLocalStorageValue('useAuthState', newValue);
      });
    },
  ],
})


export const currentUserState = atom({
  key: 'CurrentUserState',
  default: null,
});

export const allListingState = atom({
  key: 'AllListingState',
  default: [], 
});

export const publicListingsState = atomFamily({
  key: 'publicListingsState',
  default: selectorFamily({
    key: "listingSelectorFamily",
    get: (id) => async () => {
      const res = await axios.get(`${BACKEND_URL}/api/v1/listings/${String(id)}`);
      return res.data;
    },
  })
})

export const favoriteListingsState = atom({
  key: 'favoriteListingsState', 
  default: [],
});
 
export const userPropertiesState = atom({
  key: 'userPropertiesState', 
  default: [],
});

type ReservationParams = {
  listingId?: string;
  userId?: string;
  authorId?: string;
  refreshTrigger?: boolean;
};

export const ListingReservationState = atomFamily({
  key: 'ListingReservationState',
  default: selectorFamily({
    key: "ReservationSelectorFamily",
    get: ({listingId ,userId , authorId,refreshTrigger}:ReservationParams) => async () => {
      let queryParams = [];
    
      if (listingId) queryParams.push(`listingId=${listingId}`);
      if (userId) queryParams.push(`userId=${userId}`);
      if (authorId) queryParams.push(`authorId=${authorId}`);
    
      const queryString = queryParams.length ? `?${queryParams.join('&')}` : ''
      const res = await axios.get(`${BACKEND_URL}/api/v1/reservations/${queryString}`);
      return res.data;
    },
  })
})






