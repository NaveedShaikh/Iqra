import { useEffect, useRef } from "react";

const ParalaxCard = ({ videoSrc, title, description, index }:any) => {
  const cardRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (cardRef.current) {
        cardRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={cardRef} className="scroll-card">
      <div className="scroll-card-bg-image">
        <video
          className="absolute top-0 left-0 right-0 bottom-0 h-full w-full object-cover z-0"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className="scroll-card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <span>{index}/5</span>
      </div>
    </div>
  );
};

export default ParalaxCard;
