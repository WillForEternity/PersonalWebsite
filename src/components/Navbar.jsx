import React, { useEffect, useRef, useState } from 'react';
import logo from "../assets/W.png";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Navbar = () => {
  const svgRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <>
      <div 
        className={`fixed inset-0 bg-white transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <nav className="fixed top-0 left-0 w-full z-20 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="p-4 relative z-10">
            <img 
              src={logo} 
              alt="logo" 
              className={`w-20 h-15 object-contain transition-all duration-300 ${
                isHovered ? 'filter invert' : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </div>
          <div className="relative p-4">
            <svg 
              ref={svgRef} 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 100 50" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fill="none" 
                stroke={isHovered ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"} 
                strokeWidth="0.5" 
              />
            </svg>
            <div className="flex items-center gap-6 text-3xl relative z-10">
              <a 
                href="https://www.linkedin.com/in/will-norden-609377234/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`text-current ${isHovered ? 'text-black' : 'text-white'}`}
              >
                <FaLinkedin className="cursor-pointer hover:text-cyan-500 transition-colors" />
              </a>
              <a 
                href="https://github.com/WillForEternity" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`text-current ${isHovered ? 'text-black' : 'text-white'}`}
              >
                <FaGithub className="cursor-pointer hover:text-red-800 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;