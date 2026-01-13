import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Background from './components/Background';
import FishBackground from './components/FishBackground';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Writings from './components/Writings';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isMouseEffectEnabled, setIsMouseEffectEnabled] = useState(true);
  const [isFishEffectEnabled, setIsFishEffectEnabled] = useState(true);
  const [areFishHidden, setAreFishHidden] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => {
      document.body.classList.add('clicking');
    };

    const handleMouseUp = () => {
      document.body.classList.remove('clicking');
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    const contentTimer = setTimeout(() => {
      setIsContentVisible(true);
    }, 500);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(contentTimer);
    };
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'writings':
        return <Writings />;
      case 'projects':
        return <Projects />;
      case 'home':
      default:
        return <Hero />;
    }
  };

  return (
    <div className="relative min-h-screen text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900">
      <Background isEffectEnabled={isMouseEffectEnabled} />
      <FishBackground isEffectEnabled={isFishEffectEnabled} areFishHidden={areFishHidden} />
      
      {/* Main content layer */}
      <div className="relative z-10">
        <Menu currentView={currentView} onNavigate={setCurrentView} />
        {isContentVisible && (
          <div className="animate-fade-in-up">
            {renderView()}
          </div>
        )}
      </div>
      
      {/* Toggle buttons for effects */}
      <div className="fixed bottom-4 right-4 flex flex-row gap-4 z-50">
        <button
          onClick={() => setIsMouseEffectEnabled(!isMouseEffectEnabled)}
          className="text-neutral-500 hover:text-white text-xs font-mono transition-colors duration-200"
        >
          [toggle mouse effect]
        </button>
        <button
          onClick={() => setAreFishHidden(!areFishHidden)}
          className="text-neutral-500 hover:text-white text-xs font-mono transition-colors duration-200"
        >
          [{areFishHidden ? 'show fish' : 'hide fish'}]
        </button>
      </div>
    </div>
  );
}

export default App;
