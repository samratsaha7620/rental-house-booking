'use client';

import ImageComponent from "../ImageComponent";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  return ( 
    <ImageComponent
      onClick={() => navigate('/')}
      className="hidden md:block cursor-pointer" 
      src="/logo.png" 
      height={100} 
      width={100} 
      alt="Logo" 
    />
   );
}
export default Logo;
