import React, { useEffect, useRef, useState } from 'react';
import logo from "../assets/W.png";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdDragHandle } from "react-icons/md";
import Blog from './Blog';

const Navbar = () => {
  const svgRef = useRef(null);
  const blogRef = useRef(null);
  const dragHandleRef = useRef(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const minBlogHeight = 15; // Minimum height of the blog section in vh
  const [blogHeight, setBlogHeight] = useState(minBlogHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  useEffect(() => {
    const generateChaoticPath = () => {
      // ... (keep existing path generation logic)
    };

    const animatePath = () => {
      // ... (keep existing path animation logic)
    };

    animatePath();
  }, []);

  useEffect(() => {
    const handleMove = (clientY) => {
      const delta = startY - clientY;
      const newHeight = Math.max(minBlogHeight, Math.min(startHeight + delta / window.innerHeight * 100, 90));
      setBlogHeight(newHeight);
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, startY, startHeight]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(blogHeight);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(blogHeight);
  };

  const handleLogoClick = () => {
    setIsLocked(!isLocked);
    setIsLogoHovered(!isLocked);
    if (!isLocked) {
      setBlogHeight(minBlogHeight);
    }
  };

  const handleLogoHover = (hovered) => {
    if (!isLocked) {
      setIsLogoHovered(hovered);
      if (!hovered) {
        setBlogHeight(minBlogHeight);
      }
    }
  };

  const isWhiteBackground = isLogoHovered || isLocked;

  return (
    <div className="relative">
      <div 
        className={`fixed inset-0 bg-white transition-opacity duration-300 ${
          isWhiteBackground ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 10 }}
      />
      <nav className="fixed top-0 left-0 w-full px-4 sm:px-8 py-4 sm:py-6" style={{ zIndex: 30 }}>
        <div className="flex justify-between items-center">
          <div className="p-2 sm:p-4 relative" style={{ zIndex: 30 }}>
            <img 
              src={logo} 
              alt="logo" 
              className={`w-16 h-12 sm:w-20 sm:h-15 object-contain transition-all duration-300 cursor-pointer ${
                isWhiteBackground ? 'filter invert' : ''
              }`}
              onMouseEnter={() => handleLogoHover(true)}
              onMouseLeave={() => handleLogoHover(false)}
              onClick={handleLogoClick}
            />
          </div>
          <div className="relative p-2 sm:p-4">
            <svg 
              ref={svgRef} 
              className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 ${
                isWhiteBackground ? 'filter invert' : ''
              }`}
              viewBox="0 0 100 50" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fill="none" 
                stroke="rgba(255,255,255,0.5)" 
                strokeWidth="0.5" 
              />
            </svg>
            <div className={`flex items-center gap-4 sm:gap-6 text-2xl sm:text-3xl relative z-10 transition-all duration-300 ${
              isWhiteBackground ? 'filter invert' : ''
            }`}>
              <a 
                href="https://www.linkedin.com/in/will-norden-609377234/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white"
              >
                <FaLinkedin className="cursor-pointer hover:text-cyan-500 transition-colors" />
              </a>
              <a 
                href="https://github.com/WillForEternity" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white"
              >
                <FaGithub className="cursor-pointer hover:text-red-800 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div 
        ref={blogRef}
        className={`fixed w-full bg-white text-black transition-all duration-300 border-t border-gray-200 ${
          isWhiteBackground ? 'opacity-100 bottom-0' : 'opacity-0 bottom-[-100%] pointer-events-none'
        }`} 
        style={{ 
          zIndex: 20, 
          height: `${blogHeight}vh`, 
          maxHeight: `calc(100vh - 64px)`, // Adjusted for smaller navbar on mobile
          overflowY: 'auto',
          transition: 'height 0.1s ease-out',
        }}
      >
        <div 
          ref={dragHandleRef}
          className="absolute top-0 left-0 w-full h-6 cursor-ns-resize flex items-center justify-center"
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
        >
          <MdDragHandle size={24} color="black" />
        </div>
        <div className="pt-0">
          <Blog />
        </div>
      </div>
    </div>
  );
};

export default Navbar;