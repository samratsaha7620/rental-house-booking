import React from 'react'

interface ImageContentProps{
  onClick?: ()=> void;
  className?: string;
  src:string;
  alt:string;
  width?:number;
  height?:number
}

const ImageComponent:React.FC<ImageContentProps> = ({onClick,className, src,alt,width,height}) => {
  return (
    <img onClick={onClick} src={src} alt={alt} width={width} height={height} className={className}/>
  )
}
export default ImageComponent;
