import React, { useEffect, useRef } from 'react';

interface Star {
  radius: number; // Distance from center
  angle: number;  // Current angle in radians
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
  speed: number; // Angular velocity
}

const CosmicParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let centerX = 0;
    let centerY = 0;
    let maxRadius = 0;

    // Configuration
    const STAR_COUNT = 800; // Dense starfield
    const BASE_ANGULAR_SPEED = 0.0003; // Base rotation speed (radians per frame)

    const initStars = () => {
      stars = [];
      // Calculate max radius to cover corners
      maxRadius = Math.sqrt(centerX * centerX + centerY * centerY) + 50;

      for (let i = 0; i < STAR_COUNT; i++) {
        // Random radius with uniform distribution logic (more stars further out to prevent clustering at center)
        const r = Math.sqrt(Math.random()) * maxRadius;
        
        // Depth simulation: 
        // We use 'size' and 'speed' to simulate depth.
        // Smaller stars (further away) might move slower or just differently.
        // Here, we'll make the rotation roughly rigid but with slight variance for organic feel.
        const sizeBase = Math.random();
        const size = Math.max(0.5, sizeBase * 2); // 0.5 to 2.0
        
        stars.push({
          radius: r,
          angle: Math.random() * Math.PI * 2,
          size: size,
          brightness: Math.random(),
          twinkleSpeed: Math.random() * 0.03 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          // Closer stars (larger) appear to move slightly faster angularly for parallax, 
          // or keeping it uniform for a giant structure feel. Let's do uniform for majesty.
          speed: BASE_ANGULAR_SPEED * (0.8 + Math.random() * 0.4), 
        });
      }
    };

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        initStars();
      }
    };

    const render = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // 1. Update Twinkle
        star.twinklePhase += star.twinkleSpeed;
        const twinkleVal = Math.sin(star.twinklePhase);
        
        // Map sin wave (-1 to 1) to opacity range
        const opacity = (star.brightness * 0.6) + (twinkleVal * 0.3) + 0.2;
        
        // 2. Update Rotation (Clockwise)
        star.angle += star.speed;

        // 3. Calculate Cartesian Position
        const x = centerX + Math.cos(star.angle) * star.radius;
        const y = centerY + Math.sin(star.angle) * star.radius;

        // 4. Draw Star (Only if on screen, optimization)
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            // Use white with varying opacity
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;
            ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setup
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block"
    />
  );
};

export default CosmicParticles;