import React, { useRef, useEffect, useMemo, useState } from 'react';

const FishBackground = ({ isEffectEnabled = true, areFishHidden = false }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const creaturesRef = useRef([]);
  const foodRef = useRef([]);
  const mousePositionRef = useRef({ x: 0, y: 0, isActive: false });
  const lastMouseMoveRef = useRef(0); // Start with 0 so timeout triggers immediately
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const hasMouseMovedRef = useRef(false); // Track if mouse has ever moved
  const lastFoodSpawnRef = useRef(Date.now());
  const areFishHiddenRef = useRef(areFishHidden);
  
  // Seeded random number generator for predictable results
  const seedRef = useRef(11111); // Fixed seed for consistent results
  const seededRandom = () => {
    seedRef.current = (seedRef.current * 9301 + 49297) % 233280;
    return seedRef.current / 233280;
  };
  
  // Configuration
  const config = useMemo(() => ({
    fishCount: 200,
    predatorCount: 2,
    maxFoodCount: 20,
    foodSpawnInterval: 50, 
    fishSize: 4,
    predatorSize: 12,
    maxTrailLength: 3,
    trailUpdateRate: 2
  }), []);

  // Utility functions
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  
  const seek = (position, target, maxSpeed) => {
    const desired = {
      x: target.x - position.x,
      y: target.y - position.y
    };
    const d = Math.sqrt(desired.x ** 2 + desired.y ** 2);
    if (d === 0) return { x: 0, y: 0 };
    desired.x = (desired.x / d) * maxSpeed;
    desired.y = (desired.y / d) * maxSpeed;
    return { x: desired.x, y: desired.y };
  };

  const flee = (position, target, maxSpeed) => {
    const desired = {
      x: position.x - target.x,
      y: position.y - target.y
    };
    const d = Math.sqrt(desired.x ** 2 + desired.y ** 2);
    if (d === 0) return { x: 0, y: 0 };
    desired.x = (desired.x / d) * maxSpeed;
    desired.y = (desired.y / d) * maxSpeed;
    return { x: desired.x, y: desired.y };
  };

  const limitForce = (force, max) => {
    const magnitude = Math.sqrt(force.x ** 2 + force.y ** 2);
    if (magnitude > max) {
      force.x = (force.x / magnitude) * max;
      force.y = (force.y / magnitude) * max;
    }
    return force;
  };

  // Fish class
  class Fish {
    constructor(canvas, species = 'herbivore') {
      this.position = {
        x: seededRandom() * canvas.width,
        y: seededRandom() * canvas.height
      };
      const angle = seededRandom() * 2 * Math.PI;
      this.velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
      this.acceleration = { x: 0, y: 0 };
      
      this.species = species;
      this.size = species === 'carnivore' ? config.predatorSize : config.fishSize;
      this.maxSpeed = species === 'carnivore' ? 2.5 : 1.5; // Faster fish
      this.baseMaxSpeed = this.maxSpeed;
      this.maxForce = 0.1;
      this.perceptionRadius = species === 'carnivore' ? 80 : 60;
      
      // Predator-specific properties
      this.isPursuing = false;
      this.pursuitBoost = 1.8; // Speed multiplier when chasing prey
      
      this.trail = [];
      this.age = 0;
    }

    update(canvas) {
      // Update velocity
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;

      // Limit speed
      const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
      if (speed > this.maxSpeed) {
        this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
        this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
      }

      // Update trail only for predators
      if (this.species === 'carnivore' && this.age % config.trailUpdateRate === 0) {
        this.trail.unshift({
          x: this.position.x,
          y: this.position.y,
          angle: Math.atan2(this.velocity.y, this.velocity.x),
          size: this.size
        });
        
        if (this.trail.length > config.maxTrailLength) {
          this.trail.pop();
        }
      }

      // Update position
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // Reset acceleration
      this.acceleration.x = 0;
      this.acceleration.y = 0;

      // Handle screen boundaries differently for predators vs fish
      if (this.species === 'carnivore') {
        // Predators are constrained to screen bounds (no wrapping, no bouncing)
        if (this.position.x > canvas.width - this.size) {
          this.position.x = canvas.width - this.size;
        }
        if (this.position.x < this.size) {
          this.position.x = this.size;
        }
        if (this.position.y > canvas.height - this.size) {
          this.position.y = canvas.height - this.size;
        }
        if (this.position.y < this.size) {
          this.position.y = this.size;
        }
      } else {
        // Fish wrap around edges as before
        if (this.position.x > canvas.width) {
          this.position.x = 0;
          this.trail = [];
        }
        if (this.position.x < 0) {
          this.position.x = canvas.width;
          this.trail = [];
        }
        if (this.position.y > canvas.height) {
          this.position.y = 0;
          this.trail = [];
        }
        if (this.position.y < 0) {
          this.position.y = canvas.height;
          this.trail = [];
        }
      }

      this.age += 1;
    }

    applyForce(force) {
      this.acceleration.x += force.x;
      this.acceleration.y += force.y;
    }

    behaviors(creatures, foods, canvas) {
      let steer = { x: 0, y: 0 };
      let nearPredator = false;

      if (this.species === 'herbivore') {
        // Seek nearest food
        let closestFood = null;
        let minDist = Infinity;

        for (let i = foods.length - 1; i >= 0; i--) {
          const food = foods[i];
          const d = distance(this.position, food.position);
          
          // Fish can see food from very long range (6x perception radius)
          if (d < this.perceptionRadius * 6 && d < minDist) {
            minDist = d;
            closestFood = food;
          }

          // Eat food when close enough
          if (d < 5) {
            // Remove eaten food (no immediate respawn - clusters spawn every 5 seconds)
            foods.splice(i, 1);
          }
        }

        if (closestFood) {
          const seekForce = seek(this.position, closestFood.position, this.maxSpeed);
          steer.x += seekForce.x * 0.7;
          steer.y += seekForce.y * 0.7;
        }

        // Avoid predators
        for (let other of creatures) {
          if (other.species === 'carnivore') {
            const d = distance(this.position, other.position);
            if (d < this.perceptionRadius) {
              nearPredator = true;
              const fleeForce = flee(this.position, other.position, this.maxSpeed);
              steer.x += fleeForce.x * 15;
              steer.y += fleeForce.y * 15;
            }
          }
        }

        // Speed boost when near predators
        if (nearPredator) {
          this.maxSpeed = this.baseMaxSpeed * 6; // Higher fleeing speed
        } else {
          this.maxSpeed = this.baseMaxSpeed;
        }

        // Separation behavior (avoid overlapping)
        let separationForce = { x: 0, y: 0 };
        let separationCount = 0;
        const separationRadius = this.size * 3; // Minimum distance between fish

        for (let other of creatures) {
          if (other !== this && other.species === 'herbivore') {
            const d = distance(this.position, other.position);
            
            // Separation - avoid overlapping
            if (d < separationRadius && d > 0) {
              const diff = {
                x: this.position.x - other.position.x,
                y: this.position.y - other.position.y
              };
              // Normalize and weight by distance (closer = stronger repulsion)
              const magnitude = Math.sqrt(diff.x ** 2 + diff.y ** 2);
              if (magnitude > 0) {
                diff.x = (diff.x / magnitude) / d; // Inverse distance weighting
                diff.y = (diff.y / magnitude) / d;
                separationForce.x += diff.x;
                separationForce.y += diff.y;
                separationCount++;
              }
            }
          }
        }

        // Apply separation force
        if (separationCount > 0) {
          separationForce.x /= separationCount;
          separationForce.y /= separationCount;
          
          // Normalize and scale
          const sepMagnitude = Math.sqrt(separationForce.x ** 2 + separationForce.y ** 2);
          if (sepMagnitude > 0) {
            separationForce.x = (separationForce.x / sepMagnitude) * this.maxSpeed;
            separationForce.y = (separationForce.y / sepMagnitude) * this.maxSpeed;
            
            steer.x += separationForce.x * 2.0; // Strong separation force
            steer.y += separationForce.y * 2.0;
          }
        }

        // Schooling behavior (weaker than separation)
        let centerX = 0;
        let centerY = 0;
        let count = 0;

        for (let other of creatures) {
          if (other !== this && other.species === 'herbivore') {
            const d = distance(this.position, other.position);
            if (d < this.perceptionRadius * 2 && d > separationRadius) { // Only school with fish not too close
              centerX += other.position.x;
              centerY += other.position.y;
              count++;
            }
          }
        }

        if (count > 0) {
          centerX = centerX / count;
          centerY = centerY / count;
          const socialForce = seek(this.position, {x: centerX, y: centerY}, this.maxSpeed);
          steer.x += socialForce.x * 0.1;
          steer.y += socialForce.y * 0.1;
        }

      } else if (this.species === 'carnivore') {
        // Separation behavior for predators (avoid overlapping with other predators)
        let separationForce = { x: 0, y: 0 };
        let separationCount = 0;
        const separationRadius = this.size * 2; // Minimum distance between predators

        for (let other of creatures) {
          if (other !== this && other.species === 'carnivore') {
            const d = distance(this.position, other.position);
            
            if (d < separationRadius && d > 0) {
              const diff = {
                x: this.position.x - other.position.x,
                y: this.position.y - other.position.y
              };
              const magnitude = Math.sqrt(diff.x ** 2 + diff.y ** 2);
              if (magnitude > 0) {
                diff.x = (diff.x / magnitude) / d;
                diff.y = (diff.y / magnitude) / d;
                separationForce.x += diff.x;
                separationForce.y += diff.y;
                separationCount++;
              }
            }
          }
        }

        // Apply predator separation force
        if (separationCount > 0) {
          separationForce.x /= separationCount;
          separationForce.y /= separationCount;
          
          const sepMagnitude = Math.sqrt(separationForce.x ** 2 + separationForce.y ** 2);
          if (sepMagnitude > 0) {
            separationForce.x = (separationForce.x / sepMagnitude) * this.maxSpeed;
            separationForce.y = (separationForce.y / sepMagnitude) * this.maxSpeed;
            
            steer.x += separationForce.x * 1.5; // Moderate separation force for predators
            steer.y += separationForce.y * 1.5;
          }
        }

        // Hunt prey
        let closestPrey = null;
        let minDist = Infinity;
        this.isPursuing = false;

        // Find densest cluster in predator's screen section
        const clusterCenter = this.findDensestCluster(creatures, canvas);

        for (let other of creatures) {
          if (other.species === 'herbivore') {
            const d = distance(this.position, other.position);
            if (d < this.perceptionRadius && d < minDist) {
              minDist = d;
              closestPrey = other;
            }

            // Catch prey
            if (d < this.size * 1.5) {
              // Respawn the caught fish - at mouse location if mouse is active, otherwise random
              const mousePos = mousePositionRef.current;
              if (mousePos.isActive) {
                // Respawn at mouse location with some random spread
                const spreadRadius = 30;
                const angle = seededRandom() * 2 * Math.PI;
                const spreadDistance = seededRandom() * spreadRadius;
                other.position.x = mousePos.x + Math.cos(angle) * spreadDistance;
                other.position.y = mousePos.y + Math.sin(angle) * spreadDistance;
                
                // Clamp to screen bounds
                other.position.x = Math.max(0, Math.min(canvas.width, other.position.x));
                other.position.y = Math.max(0, Math.min(canvas.height, other.position.y));
              } else {
                // Respawn at random location
                other.position.x = seededRandom() * canvas.width;
                other.position.y = seededRandom() * canvas.height;
              }
              
              other.velocity.x = Math.cos(seededRandom() * 2 * Math.PI);
              other.velocity.y = Math.sin(seededRandom() * 2 * Math.PI);
              other.trail = [];
            }
          }
        }

        if (closestPrey) {
          this.isPursuing = true;
          // Apply speed boost when pursuing
          this.maxSpeed = this.baseMaxSpeed * this.pursuitBoost;
          
          const huntForce = seek(this.position, closestPrey.position, this.maxSpeed);
          steer.x += huntForce.x * 3; // Increased hunting force
          steer.y += huntForce.y * 3;
        } else {
          // Return to normal speed when not pursuing
          this.maxSpeed = this.baseMaxSpeed;
          
          if (clusterCenter) {
            // Move toward densest cluster in section
            const clusterForce = seek(this.position, clusterCenter, this.maxSpeed);
            steer.x += clusterForce.x * 1.5;
            steer.y += clusterForce.y * 1.5;
          } else {
            // Wander when no clusters found
            const wanderAngle = Math.sin(Date.now() * 0.001) * Math.PI * 2;
            const wanderPoint = {
              x: this.position.x + Math.cos(wanderAngle) * 100,
              y: this.position.y + Math.sin(wanderAngle) * 100
            };
            const wanderForce = seek(this.position, wanderPoint, this.maxSpeed);
            steer.x += wanderForce.x * 0.5;
            steer.y += wanderForce.y * 0.5;
          }
        }
      }

      steer = limitForce(steer, this.maxForce);
      this.applyForce(steer);
    }

    findDensestCluster(creatures, canvas) {
      // Divide screen into 4x4 grid (16 sections)
      const sectionsX = 4;
      const sectionsY = 4;
      const sectionWidth = canvas.width / sectionsX;
      const sectionHeight = canvas.height / sectionsY;
      
      // Determine which section this predator is in
      const predatorSectionX = Math.floor(this.position.x / sectionWidth);
      const predatorSectionY = Math.floor(this.position.y / sectionHeight);
      
      // Clamp to valid section indices
      const sectionX = Math.max(0, Math.min(sectionsX - 1, predatorSectionX));
      const sectionY = Math.max(0, Math.min(sectionsY - 1, predatorSectionY));
      
      // Define bounds of predator's section
      const sectionLeft = sectionX * sectionWidth;
      const sectionRight = (sectionX + 1) * sectionWidth;
      const sectionTop = sectionY * sectionHeight;
      const sectionBottom = (sectionY + 1) * sectionHeight;
      
      // Find all fish in this section
      const fishInSection = [];
      for (let creature of creatures) {
        if (creature.species === 'herbivore' && 
            creature.position.x >= sectionLeft && creature.position.x < sectionRight &&
            creature.position.y >= sectionTop && creature.position.y < sectionBottom) {
          fishInSection.push(creature);
        }
      }
      
      if (fishInSection.length < 3) return null; // Need at least 3 fish to form a cluster
      
      // Find densest cluster using simple grid analysis
      const clusterRadius = 60; // Radius to consider for clustering
      let bestClusterCenter = null;
      let maxDensity = 0;
      
      // Sample potential cluster centers within the section
      const samples = 8; // 8x8 sampling grid within section
      const stepX = sectionWidth / samples;
      const stepY = sectionHeight / samples;
      
      for (let i = 0; i < samples; i++) {
        for (let j = 0; j < samples; j++) {
          const centerX = sectionLeft + (i + 0.5) * stepX;
          const centerY = sectionTop + (j + 0.5) * stepY;
          
          // Count fish within cluster radius of this point
          let density = 0;
          for (let fish of fishInSection) {
            const dist = distance({ x: centerX, y: centerY }, fish.position);
            if (dist < clusterRadius) {
              density++;
            }
          }
          
          if (density > maxDensity) {
            maxDensity = density;
            bestClusterCenter = { x: centerX, y: centerY };
          }
        }
      }
      
      return maxDensity >= 3 ? bestClusterCenter : null; // Return center if cluster has 3+ fish
    }

    draw(ctx, areFishHidden = false) {
      if (!isEffectEnabled) return;
      
      const opacity = 0.25;
      
      // Draw predator field of view
      // if (this.species === 'carnivore') {
      //   this.drawFieldOfView(ctx, opacity);
      // }
      
      // Draw trail only for predators
      if (this.species === 'carnivore') {
        this.trail.forEach((pos, index) => {
          const alpha = (config.maxTrailLength - index) / config.maxTrailLength * opacity * 0.5;
          
          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate(pos.angle);
          
          // Draw three-segment predator trail
          this.drawPredatorBody(ctx, alpha, areFishHidden);
          ctx.restore();
        });
      }

      // Draw current creature
      const angle = Math.atan2(this.velocity.y, this.velocity.x);

      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(angle);

      if (this.species === 'carnivore') {
        // Draw three-segment predator body
        this.drawPredatorBody(ctx, opacity, areFishHidden);
      } else {
        // Draw regular fish with three identical segments
        this.drawFishBody(ctx, opacity, areFishHidden);
      }
      ctx.restore();
    }

    drawPredatorBody(ctx, alpha, areFishHidden = false) {
      const segmentLength = this.size * 0.8;
      const segmentWidth = this.size * 0.6;
      const color = areFishHidden ? '0, 0, 0' : '255, 255, 255';
      
      // Front segment (largest)
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size * 2.2, 0);
      ctx.lineTo(0, this.size);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();
      
      // Middle segment
      ctx.beginPath();
      ctx.moveTo(-segmentLength, -segmentWidth);
      ctx.lineTo(0, 0);
      ctx.lineTo(-segmentLength, segmentWidth);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color}, ${alpha * 0.8})`;
      ctx.fill();
      
      // Rear segment (smallest)
      ctx.beginPath();
      ctx.moveTo(-segmentLength * 1.8, -segmentWidth * 0.7);
      ctx.lineTo(-segmentLength, 0);
      ctx.lineTo(-segmentLength * 1.8, segmentWidth * 0.7);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color}, ${alpha * 0.6})`;
      ctx.fill();
    }

    drawFishBody(ctx, alpha, areFishHidden = false) {
      const segmentLength = this.size * 0.7;
      const color = areFishHidden ? '0, 0, 0' : '255, 255, 255';
      
      // Front segment (head) - identical to the other segments
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size * 2, 0);
      ctx.lineTo(0, this.size);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();
      
      // Middle segment - identical size and shape
      ctx.beginPath();
      ctx.moveTo(-segmentLength, -this.size);
      ctx.lineTo(0, 0);
      ctx.lineTo(-segmentLength, this.size);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();
      
      // Rear segment - identical size and shape
      ctx.beginPath();
      ctx.moveTo(-segmentLength * 2, -this.size);
      ctx.lineTo(-segmentLength, 0);
      ctx.lineTo(-segmentLength * 2, this.size);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();
    }

    // drawFieldOfView(ctx, baseOpacity) {
    //   const angle = Math.atan2(this.velocity.y, this.velocity.x);
    //   const fovOpacity = baseOpacity * 1.2; // Much brighter cone glow
    //   const coneAngle = Math.PI / 8; // 30 degree cone (15 degrees each side) - narrower beams
    //   const eyeOffset = this.size * 1.2; // Distance from center along body - moved forward
    //   const eyeSeparation = this.size * 0.5; // Distance between eyes - closer together
    //   
    //   ctx.save();
    //   ctx.translate(this.position.x, this.position.y);
    //   ctx.rotate(angle);
    //   
    //   // Draw two side-mounted eye cones (shark-like) with narrower beams
    //   this.drawSideEyeCone(ctx, fovOpacity, coneAngle, eyeOffset, -eyeSeparation / 2, -Math.PI / 25); // Left eye (less angled)
    //   this.drawSideEyeCone(ctx, fovOpacity, coneAngle, eyeOffset, eyeSeparation / 2, Math.PI / 25);   // Right eye (less angled)
    //   
    //   ctx.restore();
    // }

    // drawSideEyeCone(ctx, fovOpacity, coneAngle, eyeOffset, eyeY, eyeAngle) {
    //   ctx.save();
    //   
    //   // Position at eye location (side of head)
    //   ctx.translate(eyeOffset, eyeY);
    //   ctx.rotate(eyeAngle); // Angle the eye outward from the head
    //   
    //   // Create cone-shaped field of view from eye position
    //   ctx.beginPath();
    //   ctx.moveTo(0, 0); // Start at eye position
    //   
    //   // Draw cone arc angled outward - extended range
    //   ctx.arc(0, 0, this.perceptionRadius * 1.0, -coneAngle / 2, coneAngle / 2);
    //   ctx.closePath();
    //   
    //   // Create gradient from eye position to edge of cone
    //   const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.perceptionRadius * 1.0);
    //   gradient.addColorStop(0, `rgba(255, 255, 255, ${fovOpacity * 0.6})`);
    //   gradient.addColorStop(0.3, `rgba(255, 255, 255, ${fovOpacity * 0.35})`);
    //   gradient.addColorStop(0.7, `rgba(255, 255, 255, ${fovOpacity * 0.15})`);
    //   gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    //   
    //   ctx.fillStyle = gradient;
    //   ctx.fill();
    //   
    //   ctx.restore();
    // }
  }

  // Food class (visible white dots with glow)
  class Food {
    constructor(canvas, x = null, y = null) {
      this.position = {
        x: x !== null ? x : seededRandom() * canvas.width,
        y: y !== null ? y : seededRandom() * canvas.height
      };
      this.size = 2;
      this.glowPhase = seededRandom() * Math.PI * 2; // Random starting phase for glow
      this.glowSpeed = 0.001 + seededRandom() * 0.02; // Much slower glow speeds
    }

    draw(ctx) {
      if (!isEffectEnabled) return;
      
      // Calculate pulsing glow (0.2 to 0.5 opacity range)
      const glowIntensity = 0.2 + 0.3 * (Math.sin(Date.now() * this.glowSpeed + this.glowPhase) * 0.5 + 0.5);
      
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
      ctx.fill();
    }
  }

  // Single food spawning
  const spawnSingleFood = (canvas, foods) => {
    // Only spawn if under the limit
    if (foods.length < config.maxFoodCount) {
      const x = seededRandom() * canvas.width;
      const y = seededRandom() * canvas.height;
      foods.push(new Food(canvas, x, y));
    }
  };

  // Initialize ecosystem
  const initializeEcosystem = (canvas) => {
    const creatures = [];
    const foods = [];

    // Create fish
    for (let i = 0; i < config.fishCount; i++) {
      creatures.push(new Fish(canvas, 'herbivore'));
    }

    // Create predators
    for (let i = 0; i < config.predatorCount; i++) {
      creatures.push(new Fish(canvas, 'carnivore'));
    }

    // Create initial food items (up to max count)
    for (let i = 0; i < config.maxFoodCount; i++) {
      foods.push(new Food(canvas));
    }

    return { creatures, foods };
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check mouse activity timeout (3 seconds) - only if mouse has moved at least once
    if (hasMouseMovedRef.current) {
      const now = Date.now();
      const timeSinceLastMove = now - lastMouseMoveRef.current;
      const shouldBeActive = timeSinceLastMove < 3000; // 3 seconds
      
      if (shouldBeActive !== mousePositionRef.current.isActive) {
        mousePositionRef.current.isActive = shouldBeActive;
      }
    }

    const ctx = canvas.getContext('2d');
    const creatures = creaturesRef.current;
    const foods = foodRef.current;

    // Clear canvas completely transparent - don't interfere with background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    for (let food of foods) {
      food.draw(ctx);
    }

    // Update and draw creatures
    for (let creature of creatures) {
      creature.behaviors(creatures, foods, canvas);
      creature.update(canvas);
      creature.draw(ctx, areFishHiddenRef.current);
    }

    // Spawn new food item periodically (if under limit)
    const currentTime = Date.now();
    if (currentTime - lastFoodSpawnRef.current >= config.foodSpawnInterval) {
      spawnSingleFood(canvas, foods);
      lastFoodSpawnRef.current = currentTime;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };


    // Mouse tracking for respawn location
    const handleMouseMove = (event) => {
      if (!isEffectEnabled) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const newMousePos = { x: mouseX, y: mouseY };
      const previousPos = previousMousePosRef.current;
      
      // Only update timestamp if mouse actually moved (not just scrolling)
      const mouseMoved = Math.abs(newMousePos.x - previousPos.x) > 0 || Math.abs(newMousePos.y - previousPos.y) > 0;
      
      if (mouseMoved) {
        hasMouseMovedRef.current = true; // Mark that mouse has moved at least once
        lastMouseMoveRef.current = Date.now();
        previousMousePosRef.current = newMousePos;
        mousePositionRef.current.isActive = true;
      }
      
      mousePositionRef.current.x = mouseX;
      mousePositionRef.current.y = mouseY;
    };

    const handleMouseLeave = () => {
      mousePositionRef.current.isActive = false;
    };

    // Mouse click handler for placing food
    const handleMouseClick = (event) => {
      if (!isEffectEnabled) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Create dense food area around click
      const numFoodItems = 150;
      const maxRadius = 120;
      const foods = foodRef.current;
      
      for (let i = 0; i < numFoodItems; i++) {
        // Use exponential distribution for denser food near center
        const randomRadius = Math.pow(Math.random(), 2) * maxRadius;
        const angle = Math.random() * 2 * Math.PI;
        
        const x = mouseX + Math.cos(angle) * randomRadius;
        const y = mouseY + Math.sin(angle) * randomRadius;
        
        // Ensure food stays within canvas bounds
        const clampedX = Math.max(0, Math.min(canvas.width, x));
        const clampedY = Math.max(0, Math.min(canvas.height, y));
        
        foods.push(new Food(canvas, clampedX, clampedY));
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('click', handleMouseClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Initialize ecosystem
    const { creatures, foods } = initializeEcosystem(canvas);
    creaturesRef.current = creatures;
    foodRef.current = foods;

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleMouseClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isEffectEnabled]);

  // Update the ref when areFishHidden changes
  useEffect(() => {
    areFishHiddenRef.current = areFishHidden;
  }, [areFishHidden]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1, pointerEvents: isEffectEnabled ? 'auto' : 'none' }}
    />
  );
};

export default FishBackground;
