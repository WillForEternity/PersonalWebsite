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
  const maxBlogHeight = 80; // Maximum height of the blog section in vh
  const [blogHeight, setBlogHeight] = useState(minBlogHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  useEffect(() => {
    const generateChaoticPath = () => {
      const numPoints = 50;
      const radius = 40;
      const centerX = 50;
      const centerY = 25;
      let path = `M${centerX + radius} ${centerY}`;

      for (let i = 1; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius * (1 + Math.random() * 0.1);
        const y = centerY + Math.sin(angle) * radius * (1 + Math.random() * 0.1);
        path += ` L${x} ${y}`;
      }

      path += 'Z';
      return path;
    };

    const animatePath = () => {
      const path = svgRef.current.querySelector('path');
      path.setAttribute('d', generateChaoticPath());
      requestAnimationFrame(animatePath);
    };

    animatePath();
  }, []);

  useEffect(() => {
    const handleMove = (clientY) => {
      const delta = startY - clientY;
      const newHeight = Math.max(minBlogHeight, Math.min(startHeight + delta / window.innerHeight * 100, maxBlogHeight));
      setBlogHeight(newHeight);
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        e.preventDefault();
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
      document.body.style.userSelect = 'auto';
    };

    if (isDragging) {
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.body.style.userSelect = 'auto';
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
              className={`w-16 h-16 sm:w-15 sm:h-15 object-contain transition-all duration-300 cursor-pointer ${
                isWhiteBackground ? '' : 'filter invert'
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
          transition: 'height 0.05s ease-out', // Faster transition
        }}
      >
        <div 
          ref={dragHandleRef}
          className="sticky top-0 left-0 w-full h-6 cursor-ns-resize flex items-center justify-center bg-white z-10"
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
        >
          <MdDragHandle size={24} color="black" />
        </div>
        <div className="relative" style={{
          top: `-${blogHeight}vh`,
          transition: 'top 0.05s ease-out',
        }}>
          <Blog />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
