import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import Hero from './components/Hero';
import Technologies from './components/Technologies';
import ScrollingArrow from './components/ScrollingArrow';
import Projects from './components/Projects';

function App() {
  const [isBlogActive, setIsBlogActive] = useState(false);

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
      <Background />
      <div className="relative z-10">
        <Navbar onBlogStateChange={setIsBlogActive} />
        <Hero />
        <ScrollingArrow />
        <div className="pt-16">
          <Technologies />
          <Projects />
        </div>
      </div>
    </div>
  );
}

export default App;