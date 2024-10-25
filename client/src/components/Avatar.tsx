
import ImageComponent from "./ImageComponent";

interface AvatarProps {
  src: string | null | undefined;
}
const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return ( 
    <ImageComponent 
      className="rounded-full" 
      height={30} 
      width={30} 
      alt="Avatar" 
      src={src || '/avatar.png'}
    />
   );
}
 
export default Avatar;
