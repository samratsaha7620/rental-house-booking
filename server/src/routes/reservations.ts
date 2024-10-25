import  { Router , Request,Response } from "express";
import { authenticationMiddleWare } from "./authMiddleWare";
import prisma from "../db";


const router = Router();


//get a resrvation by listingId , userId and authorId
router.get("/:listingId?/:userId?/:authorId?", async(req:Request , res:Response) =>{
  try {
    const { listingId ,userId,authorId} = req.params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    };

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservations.findMany({
      where: query,
      include: {
        listing: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(reservations);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


//book a reservation
router.post("/reserve" ,authenticationMiddleWare, async(req:Request , res:Response) =>{

  try{
    //@ts-ignore
    const currentUserId = req.user.userId; 
    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    const {listingId,startDate ,endDate ,totalPrice} =  req.body;

    if(!listingId || !startDate || ! endDate || !totalPrice){
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const listingAndReservation =  await prisma.listing.update({
      where:{
        id:listingId
      },
      data:{
        reservations:{
          create:{
            userId:currentUserId,
            startDate,
            endDate,
            totalPrice,
          }
        }
      }
    })
    return res.status(200).json(listingAndReservation);
  }catch(error){
    console.error('Error creating reservation:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


//cancel a resrvation
router.delete("/:id",authenticationMiddleWare,(req:Request,res:Response) =>{
  const {id} = req.params;
  return res.status(200).json("deleted")
})

export default router;