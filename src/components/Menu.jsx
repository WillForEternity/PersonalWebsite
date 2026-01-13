import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Menu = ({ currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const menuItems = [
    { id: 'home', label: 'Home', icon: '◈' },
    { id: 'writings', label: 'Writings', icon: '✎' },
    { id: 'projects', label: 'Projects', icon: '⬡' },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Add a small delay to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleNavigate = (viewId) => {
    onNavigate(viewId);
    setIsOpen(false);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        staggerChildren: 0.03,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-4 sm:px-8 py-4 sm:py-6 z-50">
      <div className="flex justify-between items-center">
        {/* Hamburger Menu */}
        <div ref={menuRef} className="relative">
          <motion.button
            onClick={() => setIsOpen(prev => !prev)}
            className="group flex flex-col justify-center items-center w-12 h-12 rounded-full transition-all duration-300"
            aria-label="Menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="flex flex-col justify-center items-center gap-1.5"
              animate={isOpen ? "open" : "closed"}
            >
              <motion.span
                className="block w-6 h-0.5 bg-white rounded-full origin-center"
                variants={{
                  closed: { rotate: 0, y: 0, width: 24 },
                  open: { rotate: 45, y: 8, width: 28 }
                }}
                transition={{ duration: 0.4, ease: [0.68, -0.6, 0.32, 1.6] }}
              />
              <motion.span
                className="block w-4 h-0.5 bg-white/70 rounded-full"
                variants={{
                  closed: { opacity: 1, scaleX: 1, x: 0 },
                  open: { opacity: 0, scaleX: 0, x: 20 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-white rounded-full origin-center"
                variants={{
                  closed: { rotate: 0, y: 0, width: 24 },
                  open: { rotate: -45, y: -8, width: 28 }
                }}
                transition={{ duration: 0.4, ease: [0.68, -0.6, 0.32, 1.6] }}
              />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="absolute top-full left-0 mt-3 w-56 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden"
              >
                {/* Decorative gradient line */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    variants={itemVariants}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-all duration-200 group/item relative ${
                      currentView === item.id
                        ? 'text-white bg-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {/* Active indicator */}
                    {currentView === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <span className={`text-lg transition-transform duration-200 ${
                      currentView === item.id ? 'text-cyan-400' : 'text-white/40 group-hover/item:text-white/60'
                    }`}>
                      {item.icon}
                    </span>
                    
                    <span className="font-light tracking-wide text-sm">
                      {item.label}
                    </span>
                    
                    {currentView === item.id && (
                      <span className="ml-auto text-xs text-cyan-400/60 font-mono">●</span>
                    )}
                  </motion.button>
                ))}
                
                {/* Decorative gradient line */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a 
            href="https://www.linkedin.com/in/william-norden/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/70 hover:text-cyan-400 transition-colors duration-300"
          >
            <FaLinkedin className="text-2xl sm:text-3xl" />
          </a>
          <a 
            href="https://github.com/WillForEternity" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/70 hover:text-white transition-colors duration-300"
          >
            <FaGithub className="text-2xl sm:text-3xl" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
