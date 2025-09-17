import React, { useEffect, useRef, useState, useMemo } from 'react';

const Background = ({ isEffectEnabled = true }) => {
  const svgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [waveTime, setWaveTime] = useState(0);
  const [clickRipples, setClickRipples] = useState([]);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [hoverFadeAmount, setHoverFadeAmount] = useState(1); // 1 = full opacity, 0 = hidden

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = target.matches('button, a[href], [onclick], [role="button"], .cursor-pointer, input:not([type="hidden"]), select, textarea') ||
                           target.closest('button, a[href], [onclick], [role="button"], .cursor-pointer, input:not([type="hidden"]), select, textarea');
      
      setIsHoveringButton(isInteractive);
    };

    const handleMouseClick = (e) => {
      // Create a new ripple at click position
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        startTime: Date.now(),
        duration: 600 // Faster 0.6 second ripple duration
      };
      
      setClickRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after duration
      setTimeout(() => {
        setClickRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, newRipple.duration);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseClick);
    };
  }, []);

  // Smooth transition for hover fade effect
  useEffect(() => {
    let animationFrame;
    const targetFade = isHoveringButton ? 0 : 1;
    const fadeSpeed = 0.05; // Adjust speed of fade transition
    
    const animateFade = () => {
      setHoverFadeAmount(current => {
        const diff = targetFade - current;
        if (Math.abs(diff) < 0.01) {
          return targetFade; // Snap to target when very close
        }
        return current + (diff * fadeSpeed);
      });
      
      animationFrame = requestAnimationFrame(animateFade);
    };
    
    animateFade();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isHoveringButton]);

  useEffect(() => {
    const generateSmoothWave = (time) => {
      const numPoints = 5;
      const points = [];
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = t * 128; // Match new pattern width
        const y = Math.sin(t * Math.PI * 2 + time) * 3;
        points.push(`${x} ${y}`);
      }
      return points.join(' L ');
    };

    let time = 0;
    const animateWaves = () => {
      const svg = svgRef.current;
      if (!svg) return;

      time += 0.11;
      setWaveTime(time);

      const paths = svg.querySelectorAll('path');
      paths.forEach((path) => {
        const newPath = `M ${generateSmoothWave(time)}`;
        path.setAttribute('d', newPath);
      });

      requestAnimationFrame(animateWaves);
    };

    animateWaves();
  }, []);

  // Generate wave-following grid squares with proximity-based lighting using cool math
  const waveFollowingSquares = useMemo(() => {
    const squares = [];
    const squareSize = 32; // Smaller squares
    const gridSpacing = 32; // Tighter grid spacing
    
    // Calculate how many squares fit on screen
    const cols = Math.ceil(window.innerWidth / squareSize) + 4;
    const rows = Math.ceil(window.innerHeight / squareSize) + 4;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Base position aligned with wave grid
        const baseX = col * gridSpacing;
        const baseY = row * gridSpacing;
        
        // 🌊 WAVE MATHEMATICS - Multi-layered wave displacement
        // Primary wave (matches background grid - updated to 128px pattern)
        const primaryWaveX = Math.sin((baseX / 128) * Math.PI * 2 + waveTime) * 3;
        const primaryWaveY = Math.sin((baseY / 128) * Math.PI * 2 + waveTime) * 3;
        
        // Secondary perpendicular wave for complexity
        const secondaryWaveX = Math.sin((baseY / 96) * Math.PI * 1.5 + waveTime * 0.7) * 2;
        const secondaryWaveY = Math.sin((baseX / 96) * Math.PI * 1.5 + waveTime * 0.7) * 2;
        
        // Tertiary diagonal wave for organic feel
        const diagonalPhase = ((baseX + baseY) / 160) * Math.PI + waveTime * 0.5;
        const tertiaryWaveX = Math.sin(diagonalPhase) * 1.5;
        const tertiaryWaveY = Math.cos(diagonalPhase) * 1.5;
        
        // 🎯 FINAL POSITION - Combine all wave effects
        const finalX = baseX + primaryWaveX + secondaryWaveX + tertiaryWaveX;
        const finalY = baseY + primaryWaveY + secondaryWaveY + tertiaryWaveY;
        
        // 📏 MOUSE PROXIMITY CALCULATION - Distance to wave-displaced position
        const distance = Math.sqrt(
          Math.pow(mousePos.x - (finalX + squareSize/2), 2) + 
          Math.pow(mousePos.y - (finalY + squareSize/2), 2)
        );
        
        // 💡 DYNAMIC LIGHTING - Fast fade with dimmer outer rings
        let opacity = 0;
        let scale = 1;
        if (distance < 35) {
          opacity = 0.5; // Brightest core (unchanged)
          scale = 1.2; // Slight scale up for closest squares
        } else if (distance < 70) {
          opacity = 0.2; // Dimmer inner ring (was 0.25)
          scale = 1.1;
        } else if (distance < 105) {
          opacity = 0.08; // Much dimmer medium ring (was 0.15)
        } else if (distance < 140) {
          opacity = 0.04; // Very dim far ring (was 0.08)
        } else if (distance < 175) {
          opacity = 0.015; // Barely visible edge (was 0.03)
        }
        
        // ✨ WAVE-BASED INTENSITY MODULATION
        // Modulate opacity based on wave intensity for extra dynamism
        const waveIntensity = Math.abs(primaryWaveX + primaryWaveY) / 6;
        opacity *= (0.7 + waveIntensity * 0.3); // 70-100% based on wave intensity
        
        // 🌊 CLICK RIPPLE EFFECT
        // Add pulsing effect from click ripples
        let rippleBoost = 0;
        const currentTime = Date.now();
        
        for (const ripple of clickRipples) {
          const elapsed = currentTime - ripple.startTime;
          const progress = elapsed / ripple.duration; // 0 to 1
          
          if (progress <= 1) {
            // Calculate distance from square to ripple center
            const rippleDistance = Math.sqrt(
              Math.pow(finalX + squareSize/2 - ripple.x, 2) + 
              Math.pow(finalY + squareSize/2 - ripple.y, 2)
            );
            
            // Ripple radius expands from 0 to 175px (matches max proximity zone) over duration
            const rippleRadius = progress * 175;
            const rippleThickness = 25; // How thick the ripple wave is
            
            // Check if square is within the ripple wave
            if (Math.abs(rippleDistance - rippleRadius) < rippleThickness) {
              // Calculate ripple intensity (much stronger at center, dramatic falloff)
              const wavePosition = Math.abs(rippleDistance - rippleRadius) / rippleThickness;
              const centerFalloff = 1 - (rippleRadius / 175); // Stronger near click center
              const edgeFalloff = Math.pow(1 - wavePosition, 2); // Quadratic falloff from wave center
              const timeFalloff = 1 - Math.pow(progress, 0.6); // Much faster fade over time
              
              const rippleIntensity = centerFalloff * edgeFalloff * timeFalloff;
              rippleBoost = Math.max(rippleBoost, rippleIntensity * 5.0); // Max 5x boost for stronger effect
            }
          }
        }
        
        opacity += rippleBoost;
        
        // 🎯 GRADUAL BUTTON HOVER FADE - Smoothly fade squares when hovering over interactive elements
        // 🔄 TOGGLE CONTROL - Hide squares when effect is disabled
        if (!isEffectEnabled) {
          opacity = 0; // Instantly hide when effect disabled
        } else {
          opacity *= hoverFadeAmount; // Apply gradual fade based on hover state
        }
        
        if (opacity > 0.01) {
          squares.push(
            <rect
              key={`${row}-${col}`}
              x={finalX}
              y={finalY}
              width={squareSize * scale}
              height={squareSize * scale}
              fill="rgba(255,255,255,1)"
              opacity={opacity}
              rx={2} // Subtle rounded corners
              style={{
                transition: 'opacity 0.15s ease-out',
                transformOrigin: 'center'
              }}
            />
          );
        }
      }
    }
    
    return squares;
  }, [mousePos.x, mousePos.y, waveTime, clickRipples, hoverFadeAmount, isEffectEnabled]); // Memoize based on mouse position, wave time, ripples, fade amount, and effect toggle

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gray-950 cursor-none">
      <svg ref={svgRef} className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waving-grid" width="128" height="128" patternUnits="userSpaceOnUse">
            {[0, 32, 64, 96, 128].map((x, index) => (
              <path 
                key={`v${index}`} 
                d={`M ${x} 0 L ${x} 160`} 
                fill="none" 
                stroke="rgba(255,255,255,0.7)" 
                strokeWidth="0.7"
                transform={`translate(${x} 0) rotate(90)`}
              />
            ))}
            {[0, 32, 64, 96, 128].map((y, index) => (
              <path 
                key={`h${index}`} 
                d={`M 0 ${y} L 160 ${y}`} 
                fill="none" 
                stroke="rgba(255,255,255,0.7)" 
                strokeWidth="1.5"
                transform={`translate(0 ${y})`}
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waving-grid)" />
      </svg>
      
      {/* Wave-following interactive grid squares that light up near mouse */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {waveFollowingSquares}
      </svg>
      
    </div>
  );
};

export default Background;
