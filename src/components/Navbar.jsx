import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import logo from "../assets/W.png";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import Blog from './Blog';

const Navbar = () => {
  const svgRef = useRef(null);
  const blogRef = useRef(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isBlogExpanded, setIsBlogExpanded] = useState(false);

  const toggleIconVariants = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1.5, 2, 1.5],
      opacity: [1, 0.3, 1],
      transition: {
        duration: 1,
        times: [0, 0.2, 1], // Adjusted timing for bouncy effect
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }
    }
  };

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

  const handleLogoClick = () => {
    setIsLocked(!isLocked);
    setIsLogoHovered(!isLocked);
    if (!isLocked) {
      setIsBlogExpanded(false);
    }
  };

  const handleLogoHover = (hovered) => {
    if (!isLocked) {
      setIsLogoHovered(hovered);
      if (!hovered) {
        setIsBlogExpanded(false);
      }
    }
  };

  const toggleBlog = () => {
    setIsBlogExpanded(!isBlogExpanded);
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
          <div className="flex items-center p-2 sm:p-4 relative" style={{ zIndex: 30 }}>
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
            <span className="ml-2 text-2xl text-black font-roboto font-thin">
              ill's Blog
            </span>
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
        className={`fixed w-full bg-white text-black transition-all duration-300 ${
          isWhiteBackground ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        style={{ 
          zIndex: 20, 
          height: isBlogExpanded ? '82vh' : '50px',
          bottom: 0,
          transition: 'height 0.3s ease-out',
        }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-12 bg-white border-t border-gray-200 flex items-center justify-center cursor-pointer"
          onClick={toggleBlog}
        >
          <motion.div 
            initial="initial"
            animate="animate"
            variants={toggleIconVariants}
          >
            {isBlogExpanded ? <MdExpandMore size={24} color="black" /> : <MdExpandLess size={24} color="black" />}
          </motion.div>
        </div>
        <div className="h-full overflow-y-auto pt-12">
          <div className="px-4 pb-4">
            <Blog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
