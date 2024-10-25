import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authenticationMiddleWare = (req:AuthenticatedRequest,res:Response,next:NextFunction) =>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(401).json({message:"Unauthorized"});
  }

  jwt.verify(token, process.env.JWT_SECRET as string ,(err:any ,user:any)=>{
    if(err){
      return res.status(403).json({message:"Forbidden"})
    }
    req.user = user;
    next();
  })
}

