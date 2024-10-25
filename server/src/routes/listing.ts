import express ,{ Request,Response } from "express";
import { authenticationMiddleWare } from "./authMiddleWare";
import prisma from "../db";


const router =  express.Router();

//all listings
router.get('/' , async(req:Request , res:Response) =>{
  try{
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category
    } = req.query;
  
  
    let query :any ={};
  
    if (userId) {
      query.userId = userId;
    }
  
    if (category) {
      query.category = category;
    }
  
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount
      }
    }
  
    if (guestCount) {
      query.guestCount = {
        gte: +guestCount
      }
    }
  
    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount
      }
    }
  
    if (locationValue) {
      query.locationValue = locationValue;
    }
  
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate }
              }
            ]
          }
        }
      }
    }
  
    const listing  = await prisma.listing.findMany({
      where:query,
      orderBy:{
        createdAt:"desc",
      }
    })
    return res.status(200).json({
      listing
    })
  }catch(error){
    console.error('Error fetching listings:', error);
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
})

router.get('/my-properties' , authenticationMiddleWare , async(req:Request , res:Response)=>{
  //@ts-ignore
  const currentUserId = req.user.userId; 
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  try {
    const userListings = await prisma.listing.findMany({
      where: {
        userId: currentUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(userListings);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    return res.status(500).json({ error: 'Failed to fetch user properties' });
  }
})

//get listing by iDS
router.get('/:listingId', async (req: Request, res: Response) => {
  const { listingId } = req.params;
  try {
    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const formattedListing = {
      ...listing,
      user: {
        ...listing.user,
      },
    };

    return res.status(200).json(formattedListing);
  } catch (error: any) {
    console.error('Error fetching listing by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//add a property
router.post('/add-property',authenticationMiddleWare, async(req:Request,res:Response)=>{
  //@ts-ignore
  const currentUserId = req.user.userId; 
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  const {
    title,
    description,
    imagesrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = req.body;

  const missingFields = Object.keys(req.body).filter((key) => !req.body[key]);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
  }

  try {
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        imagesrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUserId,
      },
    });
    return res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    return res.status(500).json({ error: 'Failed to create listing' });
  }
})

//delete a property by ID
router.delete('/delete-property/:listingId', authenticationMiddleWare, async (req: Request, res: Response) => {
  const { listingId } = req.params;

  //@ts-ignore
  const currentUserId = req.user.userId; 
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  if (!listingId) {
    return res.status(400).json({ error: 'Listing ID is required' });
  }

  try {
    // Check if the listing exists and belongs to the current user
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.userId !== currentUserId) {
      return res.status(403).json({ error: 'Unauthorized to delete this listing' });
    }

    // Delete the listing
    await prisma.listing.delete({
      where: {
        id: listingId,
      },
    });

    return res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({ error: 'Failed to delete property' });
  }
});



export default router;