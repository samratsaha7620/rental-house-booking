import express , {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../db";
import { authenticationMiddleWare } from "./authMiddleWare";


const JWT_SECRET = process.env.JWT_SECRET||"your_secret_jwt";

const router = express.Router(); 

// const prisma = new PrismaClient();


//User signup route
router.post('/signup', async(req:Request,res:Response) =>{
  const {email,name,password} = req.body;
  try{
    const existingUser = await prisma.user.findUnique({
      where:{email},
    })
    if(existingUser){
      return res.status(400).json({error:"User already exists.."})
    }
    const hashedPassword = await bcrypt.hash(password,12);
    const user = await prisma.user.create({
      data:{
        name,
        email,
        hashedPassword,
      }
    })
    const token = jwt.sign({userId:user.id},JWT_SECRET, {expiresIn:"1h"})
    return res.status(201).json({user,token});
  }catch(error){
    return res.status(500).json({error:"Something went wrong."})
  }
})

//User signin Route
router.post('/signin',async(req:Request,res:Response) =>{
  const {email,password} = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try{
    const user = await prisma.user.findUnique({
      where:{email},
    })
    if(!user){
      return res.status(400).json({error:"Invalid email or password. "})
    }
    
    const isPasswordValid = user.hashedPassword && await bcrypt.compare(password,user.hashedPassword.toString());
    
    if(!user.hashedPassword || !isPasswordValid){
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({userId:user.id},JWT_SECRET , {expiresIn:'1h'});

    return res.status(200).json({ user, token });
  }catch(error){
    return res.status(500).json({ error: 'Something went wrong.' });
  }
})

//get current User route
router.get('/current-user',authenticationMiddleWare , async(req:Request,res:Response)=>{
  try{
    //@ts-ignore
    const userId = req.user?.userId;
    
    if(!userId){
      return res.status(404).json({message:'User not Found'});
    }
    
    const currentUser = await prisma.user.findUnique({
      where:{
        id:userId, 
      }
    })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    })
  }catch(error){
    return res.status(500).json({ message: 'Internal server error' });
  }
})


export default router;


