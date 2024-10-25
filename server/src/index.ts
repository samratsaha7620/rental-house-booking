import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import listingRoutes from "./routes/listing";
import generatePresignedUrl from "./routes/generateUrl";
import reservationRoutes from "./routes/reservations";
import favouritesRoutes from "./routes/favourites"
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(cors());


app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/listings',listingRoutes);
app.use('/api/v1/favourites',favouritesRoutes)
app.use('/api/v1/img',generatePresignedUrl);
app.use('/api/v1/reservations',reservationRoutes)
app.get('/',(req,res)=>{
  res.send("Health is ok")
})

app.listen(PORT, ()=>{
  console.log(`Server Running On Port:${PORT}`);
})

