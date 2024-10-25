import express, { Request, Response } from "express";
import { authenticationMiddleWare } from "./authMiddleWare";
import prisma from "../db";

const router = express.Router();


router.get('/',authenticationMiddleWare,async(req:Request,res:Response) =>{

  try{
    //@ts-ignore
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoriteIds: true },
    });

    if (!user || !user.favoriteIds.length) {
      return []; 
    }
    const favoriteListings = await prisma.listing.findMany({
      where: {
        id: {
          in: user.favoriteIds,
        },
      },
    });
    return res.status(200).json(favoriteListings);
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


router.post('/like',authenticationMiddleWare,async(req:Request,res:Response)=>{
  try{
    //@ts-ignore
    const userId = req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const {listingId} = req.body;
    if (!listingId || typeof listingId !== 'string') {
      return res.status(400).json({ error: 'Invalid Listing ID' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoriteIds: true },
    });
    if(!user){
      return res.status(404).json({message:"User Not Found"})
    }
    let favoriteIds = [...(user.favoriteIds || [])];
    
    const isAlreadyLiked = favoriteIds.find((id) => id === listingId)
    if(isAlreadyLiked){
      return res.status(402).json({message:"Not allowed to like more than once"})
    }

    favoriteIds.push(listingId);

    const updateUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        favoriteIds
      }
    });
    return res.status(200).json(favoriteIds);
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


router.post('/unlike',authenticationMiddleWare,async(req:Request,res:Response)=>{
  try{
    //@ts-ignore
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const {listingId} = req.body;
    if (!listingId || typeof listingId !== 'string') {
      return res.status(400).json({ error: 'Invalid Listing ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoriteIds: true },
    });

    if(!user){
      return res.status(404).json({message:"User Not Found"})
    }

    let favoriteIds = [...(user.favoriteIds || [])];
    
    favoriteIds = favoriteIds.filter((id) => id !== listingId);

    const updateUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        favoriteIds
      }
    });
    return res.status(200).json(favoriteIds);
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


export default router;