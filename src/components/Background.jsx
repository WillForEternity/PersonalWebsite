import React, { useEffect, useRef } from 'react';

const Background = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const generateSmoothWave = (time) => {
      const numPoints = 5;
      const points = [];
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = t * 160;
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

      const paths = svg.querySelectorAll('path');
      paths.forEach((path) => {
        const newPath = `M ${generateSmoothWave(time)}`;
        path.setAttribute('d', newPath);
      });

      requestAnimationFrame(animateWaves);
    };

    animateWaves();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-700/20 via-gray-950 to-gray-950 animate-flicker"></div>
      
      <svg ref={svgRef} className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waving-grid" width="160" height="160" patternUnits="userSpaceOnUse">
            {[0, 40, 80, 120, 160].map((x, index) => (
              <path 
                key={`v${index}`} 
                d={`M ${x} 0 L ${x} 200`} 
                fill="none" 
                stroke="rgba(255,255,255,2)" 
                strokeWidth="0.5"
                transform={`translate(${x} 0) rotate(90)`}
              />
            ))}
            {[0, 40, 80, 120, 160].map((y, index) => (
              <path 
                key={`h${index}`} 
                d={`M 0 ${y} L 200 ${y}`} 
                fill="none" 
                stroke="rgba(255,255,255,2)" 
                strokeWidth="0.5"
                transform={`translate(0 ${y})`}
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waving-grid)" />
      </svg>
      
      <div className="absolute inset-0 bg-gradient-to-t from-purple-700/20 via-transparent to-transparent animate-flicker-intense"></div>
    </div>
  );
};

export default Background;
