import React, { useRef, useEffect } from "react";
import "./Background.css";

const Background = () => {
  const mouseBlobRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const offsetX = mouseBlobRef.current.offsetWidth / 2;
      const offsetY = mouseBlobRef.current.offsetHeight / 2;
      mouseBlobRef.current.style.transform = `translate(${e.clientX - offsetX}px, ${e.clientY - offsetY}px)`;
    };

    let animationFrameId;
    const optimizedMouseMove = (e) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => handleMouseMove(e));
    };

    document.addEventListener("mousemove", optimizedMouseMove);

    return () => {
      document.removeEventListener("mousemove", optimizedMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="background-wrapper">
      <div className="blob-1"></div>
      <div className="blob-2"></div>
      <div className="blob-4"></div>
      <div className="blob-5" ref={mouseBlobRef}></div> {/* The interactive mouse blob */}
      <div className="noise-bg"></div> {/* Noise effect background */}
    </div>
  );
};

export default Background;
