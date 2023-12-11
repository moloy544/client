'use client'
import { useEffect, useRef, useState } from 'react';

function LazyLoadingImage({ imageStyle, actualSrc, alt }) {

    const placeholderSrc = "https://th.bing.com/th/id/OIP.cwVFTGI_fvDRm8qmZbt86wAAAA?pid=ImgDet&w=188&h=332&c=7&dpr=1.5";

    const [isIntersecting, setIsIntersecting] = useState(false);

    const imageRef = useRef();
  
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.unobserve(imageRef.current);
          }
        });
      });
  
      observer.observe(imageRef.current);
  
      // Capture the imageRef.current value inside the useEffect closure
      const currentImageRef = imageRef.current;
  
      return () => {
        observer.unobserve(currentImageRef); // Use the captured value here
      };
    }, []);
  
    return (

      <img
        ref={imageRef}
        className={imageStyle}
        src={isIntersecting ? actualSrc : placeholderSrc}
        alt={alt}
      />
    );
  };
  
  export default LazyLoadingImage;
  


