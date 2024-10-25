export interface User {
  id: string;
  name: string;
  email: string,
  emailVerified: boolean,
  image: string,
  hashedPassword: string,
  createdAt: string,
  updatedAt: string,
  favoriteIds: string[];
}

export interface ListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}