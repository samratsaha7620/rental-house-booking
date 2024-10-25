import express ,{ Request,Response, Router } from "express";
import prisma from "../db";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { error } from "console";
import { authenticationMiddleWare } from "./authMiddleWare";

const router = Router();

const s3Client = new S3Client({
  credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region: process.env.AWS_DEFAULT_REGION,
});

router.post('/generate-presigned-url',authenticationMiddleWare , async (req:Request,res:Response)=>{
  const {imageName ,imageType} = req.body;
  //@ts-ignore
  const userId = req.user?.userId
  if(!userId){
    return res.status(401).send({message:"Unauthenticated"})
  }
  const allowedImageTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if(!allowedImageTypes.includes(imageType as string)){
    return res.status(404).send({error:"Unsupported Image Type"})
  }
  try{
    const input = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ContentType: imageType as string,
      Key: `/uploads/${userId}/tweets/${imageName}-${Date.now()}` as string,
    }
    const putObjectCommand = new PutObjectCommand(input);
    const signedUrl = await getSignedUrl(s3Client,putObjectCommand);
    return res.status(200).json({ getSignedURLForListing: signedUrl });
  }catch(error){
    console.error("Error generating presigned URL:", error);
    return res.status(500).json({ error: "Failed to generate presigned URL" });
  }
})

export default router;
