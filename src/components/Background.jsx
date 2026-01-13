import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const Background = ({ isEffectEnabled = true }) => {
  const svgRef = useRef(null);
  // Use separate x/y state to avoid Safari's object comparison issues with useMemo
  const [mousePosX, setMousePosX] = useState(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const [mousePosY, setMousePosY] = useState(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const [waveTime, setWaveTime] = useState(0);
  const [clickRipples, setClickRipples] = useState([]);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [hoverFadeAmount, setHoverFadeAmount] = useState(1); // 1 = full opacity, 0 = hidden
  const [isMouseActive, setIsMouseActive] = useState(false); // Start inactive until user moves mouse
  const [mouseTransitionAmount, setMouseTransitionAmount] = useState(0); // Start centered
  const [renderTime, setRenderTime] = useState(Date.now()); // Synced time for ripple calculations
  const lastMouseMoveRef = useRef(0); // Start with 0 so timeout triggers immediately
  const pendingMouseFrameRef = useRef(null);
  const latestMousePosRef = useRef({ x: mousePosX, y: mousePosY });
  const hoverFadeRef = useRef(hoverFadeAmount);
  const mouseTransitionRef = useRef(mouseTransitionAmount);
  const hoverFadeRafRef = useRef(null);
  const mouseTransitionRafRef = useRef(null);
  const previousMousePosRef = useRef({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  });
  const hasMouseMovedRef = useRef(false); // Track if mouse has ever moved
  const lastWaveFrameTimeRef = useRef(performance.now()); // For time-based animation

  // Keep refs in sync with state (so rAF loops can read the latest values without closing over stale state)
  useEffect(() => {
    hoverFadeRef.current = hoverFadeAmount;
  }, [hoverFadeAmount]);

  useEffect(() => {
    mouseTransitionRef.current = mouseTransitionAmount;
  }, [mouseTransitionAmount]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newX = e.clientX;
      const newY = e.clientY;
      const previousPos = previousMousePosRef.current;
      
      // Only update timestamp if mouse actually moved (not just scrolling)
      const mouseMoved = Math.abs(newX - previousPos.x) > 0 || Math.abs(newY - previousPos.y) > 0;
      
      if (mouseMoved) {
        hasMouseMovedRef.current = true; // Mark that mouse has moved at least once
        lastMouseMoveRef.current = Date.now();
        setIsMouseActive(true);
        previousMousePosRef.current = { x: newX, y: newY };
      }
      
      // Throttle mouse state updates to rAF to avoid flooding React renders
      latestMousePosRef.current = { x: newX, y: newY };
      if (!pendingMouseFrameRef.current) {
        pendingMouseFrameRef.current = requestAnimationFrame(() => {
          pendingMouseFrameRef.current = null;
          const pos = latestMousePosRef.current;
          // Update x and y separately to ensure Safari detects changes
          setMousePosX(pos.x);
          setMousePosY(pos.y);
        });
      }
      
      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = target.matches('button, a[href], [onclick], [role="button"], .cursor-pointer, input:not([type="hidden"]), select, textarea') ||
                           target.closest('button, a[href], [onclick], [role="button"], .cursor-pointer, input:not([type="hidden"]), select, textarea');
      
      setIsHoveringButton((prev) => (prev === isInteractive ? prev : isInteractive));
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
      if (pendingMouseFrameRef.current) {
        cancelAnimationFrame(pendingMouseFrameRef.current);
        pendingMouseFrameRef.current = null;
      }
    };
  }, []);

  // Smooth transition for hover fade effect
  useEffect(() => {
    const targetFade = isHoveringButton ? 0 : 1;
    const fadeSpeed = 0.05; // Adjust speed of fade transition

    if (hoverFadeRafRef.current) {
      cancelAnimationFrame(hoverFadeRafRef.current);
      hoverFadeRafRef.current = null;
    }

    const step = () => {
      const current = hoverFadeRef.current;
      const diff = targetFade - current;

      if (Math.abs(diff) < 0.01) {
        hoverFadeRef.current = targetFade;
        setHoverFadeAmount(targetFade);
        hoverFadeRafRef.current = null;
        return;
      }

      const next = current + diff * fadeSpeed;
      hoverFadeRef.current = next;
      setHoverFadeAmount(next);
      hoverFadeRafRef.current = requestAnimationFrame(step);
    };

    hoverFadeRafRef.current = requestAnimationFrame(step);

    return () => {
      if (hoverFadeRafRef.current) {
        cancelAnimationFrame(hoverFadeRafRef.current);
        hoverFadeRafRef.current = null;
      }
    };
  }, [isHoveringButton]);

  // Mouse activity timeout checker
  useEffect(() => {
    const checkMouseActivity = () => {
      // Only check timeout if mouse has moved at least once
      if (!hasMouseMovedRef.current) {
        return;
      }
      
      const now = Date.now();
      const timeSinceLastMove = now - lastMouseMoveRef.current;
      const shouldBeActive = timeSinceLastMove < 3000; // 3 seconds
      
      if (shouldBeActive !== isMouseActive) {
        setIsMouseActive(shouldBeActive);
      }
    };

    const interval = setInterval(checkMouseActivity, 100); // Check every 100ms
    return () => clearInterval(interval);
  }, [isMouseActive]);

  // Smooth transition for mouse position (center vs actual mouse)
  useEffect(() => {
    const targetTransition = isMouseActive ? 1 : 0;
    const transitionSpeed = 0.05; // Same speed as hover fade

    if (mouseTransitionRafRef.current) {
      cancelAnimationFrame(mouseTransitionRafRef.current);
      mouseTransitionRafRef.current = null;
    }

    const step = () => {
      const current = mouseTransitionRef.current;
      const diff = targetTransition - current;

      if (Math.abs(diff) < 0.01) {
        mouseTransitionRef.current = targetTransition;
        setMouseTransitionAmount(targetTransition);
        mouseTransitionRafRef.current = null;
        return;
      }

      const next = current + diff * transitionSpeed;
      mouseTransitionRef.current = next;
      setMouseTransitionAmount(next);
      mouseTransitionRafRef.current = requestAnimationFrame(step);
    };

    mouseTransitionRafRef.current = requestAnimationFrame(step);

    return () => {
      if (mouseTransitionRafRef.current) {
        cancelAnimationFrame(mouseTransitionRafRef.current);
        mouseTransitionRafRef.current = null;
      }
    };
  }, [isMouseActive]);

  // Interpolated between actual mouse and screen center (avoid extra state/renders)
  // Use primitive dependencies (not objects) to ensure Safari correctly detects changes
  const displayMousePosX = useMemo(() => {
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    return mousePosX * mouseTransitionAmount + centerX * (1 - mouseTransitionAmount);
  }, [mousePosX, mouseTransitionAmount]);

  const displayMousePosY = useMemo(() => {
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    return mousePosY * mouseTransitionAmount + centerY * (1 - mouseTransitionAmount);
  }, [mousePosY, mouseTransitionAmount]);

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

    let rafId;
    const animateWaves = (now) => {
      const svg = svgRef.current;
      if (!svg) {
        rafId = requestAnimationFrame(animateWaves);
        return;
      }

      // Time-based animation: advance by elapsed time (in seconds) * speed factor
      // This ensures consistent animation speed regardless of frame rate (Safari vs Chrome)
      const elapsed = now - lastWaveFrameTimeRef.current;
      lastWaveFrameTimeRef.current = now;
      
      // ~0.11 per 16.67ms (60fps) = 6.6 per second; so speed = 6.6
      const speed = 6.6;
      const deltaTime = elapsed / 1000; // Convert to seconds
      
      setWaveTime((prev) => prev + deltaTime * speed);
      setRenderTime(Date.now()); // Sync render time for ripple calculations

      const paths = svg.querySelectorAll('path');
      // Use the ref's current waveTime for immediate DOM updates
      const currentTime = waveTime + deltaTime * speed;
      paths.forEach((path) => {
        const newPath = `M ${generateSmoothWave(currentTime)}`;
        path.setAttribute('d', newPath);
      });

      rafId = requestAnimationFrame(animateWaves);
    };

    rafId = requestAnimationFrame(animateWaves);
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [waveTime]);

  // Generate wave-following grid squares with proximity-based lighting using cool math
  const waveFollowingSquares = useMemo(() => {
    const squares = [];
    const squareSize = 32; // Smaller squares
    const gridSpacing = 32; // Tighter grid spacing

    // Performance: only iterate squares near the cursor (others are always opacity ~0 anyway).
    // This is especially important on Safari, which tends to repaint large SVG trees more slowly.
    const maxEffectRadius = 175;
    const range = Math.ceil((maxEffectRadius + squareSize) / gridSpacing) + 3; // generous padding
    const centerCol = Math.floor(displayMousePosX / gridSpacing);
    const centerRow = Math.floor(displayMousePosY / gridSpacing);

    const minCol = centerCol - range;
    const maxCol = centerCol + range;
    const minRow = centerRow - range;
    const maxRow = centerRow + range;

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
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
        
        // 📏 MOUSE PROXIMITY CALCULATION - Distance to wave-displaced position (using display position)
        const distance = Math.sqrt(
          Math.pow(displayMousePosX - (finalX + squareSize/2), 2) + 
          Math.pow(displayMousePosY - (finalY + squareSize/2), 2)
        );
        
        // 💡 DYNAMIC LIGHTING - Fast fade with dimmer outer rings
        let opacity = 0;
        let scale = 1;
        if (distance < 35) {
          opacity = 0.6; // Brighter core (was 0.5)
          scale = 1.2; // Slight scale up for closest squares
        } else if (distance < 70) {
          opacity = 0.25; // Brighter inner ring (was 0.2)
          scale = 1.1;
        } else if (distance < 105) {
          opacity = 0.12; // Brighter medium ring (was 0.08)
        } else if (distance < 140) {
          opacity = 0.06; // Brighter far ring (was 0.04)
        } else if (distance < 175) {
          opacity = 0.025; // Brighter edge (was 0.015)
        }
        
        // ✨ WAVE-BASED INTENSITY MODULATION
        // Modulate opacity based on wave intensity for extra dynamism
        const waveIntensity = Math.abs(primaryWaveX + primaryWaveY) / 6;
        opacity *= (0.7 + waveIntensity * 0.3); // 70-100% based on wave intensity
        
        // 🌊 CLICK RIPPLE EFFECT
        // Add pulsing effect from click ripples (use synced renderTime, not Date.now())
        let rippleBoost = 0;
        
        for (const ripple of clickRipples) {
          const elapsed = renderTime - ripple.startTime;
          const progress = elapsed / ripple.duration; // 0 to 1
          
          if (progress <= 1 && progress >= 0) {
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
          // Keep scaled squares centered (Safari can look "fragmented" when sizes change but anchors don't).
          const scaledSize = squareSize * scale;
          const offset = (scaledSize - squareSize) / 2;

          squares.push(
            <rect
              key={`${row}-${col}`}
              x={finalX - offset}
              y={finalY - offset}
              width={scaledSize}
              height={scaledSize}
              fill="rgba(255,255,255,1)"
              opacity={opacity}
              rx={2} // Subtle rounded corners
              // Remove CSS transition - Safari's SVG transition can cause opacity "ghosting"
            />
          );
        }
      }
    }
    
    return squares;
  }, [displayMousePosX, displayMousePosY, waveTime, clickRipples, renderTime, hoverFadeAmount, isEffectEnabled]); // Memoize based on primitives for Safari compatibility

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gray-950 cursor-none touch-none" style={{ backgroundColor: '#070e1a' }}>
      <svg ref={svgRef} className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waving-grid" width="128" height="128" patternUnits="userSpaceOnUse">
            {[0, 32, 64, 96, 128].map((x, index) => (
              <path 
                key={`v${index}`} 
                d={`M ${x} 0 L ${x} 160`} 
                fill="none" 
                stroke="rgba(255,255,255,0.7)" 
                strokeWidth="1.5"
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
