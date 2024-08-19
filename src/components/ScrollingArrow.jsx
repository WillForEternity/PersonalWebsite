import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const ScrollingArrow = () => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate the scroll percentage
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      
      // Make the arrow disappear faster by adjusting the opacity calculation
      const newOpacity = Math.max(0, 1 - scrollPercentage * 4);
      
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none"
      style={{ opacity: opacity }}
    >
      <ChevronDown 
        size={48}
        className="animate-bounce text-blue-300"
      />
    </div>
  );
};

export default ScrollingArrow;