import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import Hero from './components/Hero';
import Technologies from './components/Technologies';
import ScrollingArrow from './components/ScrollingArrow';
import Projects from './components/Projects';

function App() {
  const [isBlogActive, setIsBlogActive] = useState(false);
  const [isMouseEffectEnabled, setIsMouseEffectEnabled] = useState(true);

  useEffect(() => {
    const handleMouseDown = () => {
      document.body.classList.add('clicking');
    };

    const handleMouseUp = () => {
      document.body.classList.remove('clicking');
    };

    // Add global mouse event listeners
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className={`flex flex-col min-h-screen overflow-x-hidden text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900 ${isBlogActive ? 'blog-active' : ''}`}>
      <Background isEffectEnabled={isMouseEffectEnabled} />
      <div className="relative z-10">
        <Navbar onBlogStateChange={setIsBlogActive} />
        <Hero />
        <ScrollingArrow />
        <div className="pt-16">
          <Technologies />
          <Projects />
        </div>
      </div>
      
      {/* Toggle button for mouse effect - outside Background component */}
      <button
        onClick={() => setIsMouseEffectEnabled(!isMouseEffectEnabled)}
        className="fixed bottom-4 right-4 text-neutral-500 hover:text-white text-xs font-mono transition-colors duration-200 z-50"
      >
        [toggle mouse effect]
      </button>
    </div>
  );
}

export default App;