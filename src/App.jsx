import React from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import Hero from './components/Hero';
import Technologies from './components/Technologies';
import ScrollingArrow from './components/ScrollingArrow';
import Projects from './components/Projects';

function App() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900">
      <Background />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ScrollingArrow />
        <Technologies />
        <Projects />
      </div>
    </div>
  );
}

export default App;