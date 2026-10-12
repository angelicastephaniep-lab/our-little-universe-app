import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  symbol: string;
}

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clickHearts, setClickHearts] = useState<Array<{ id: number; x: number; y: number; symbol: string }>>([]);
  const { theme, isGreen } = useTheme();

  // Keep a ref to isGreen so canvas render loop always sees latest without full reset
  const isGreenRef = useRef(isGreen);
  useEffect(() => {
    isGreenRef.current = isGreen;
  }, [isGreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Stars array
    const starCount = Math.min(140, Math.floor((width * height) / 8000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      hueOffset: Math.random(),
    }));

    // Ambient floating particles
    const greenSymbols = ['🌿', '💚', '🍃', '🤍'];
    const ambientHearts: FloatingHeart[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 10,
      speed: Math.random() * 0.4 + 0.2,
      opacity: Math.random() * 0.25 + 0.1,
      rotation: Math.random() * 30 - 15,
      symbol: greenSymbols[i % greenSymbols.length],
    }));

    // Shooting star
    let shootingStar: { x: number; y: number; length: number; speed: number; angle: number; active: boolean; opacity: number } | null = null;
    let nextShootingStarTime = Date.now() + 3000 + Math.random() * 4000;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isGreenActive = isGreenRef.current;

      // Galactic / Forest background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );

      if (isGreenActive) {
        bgGrad.addColorStop(0, '#0f2c1f'); // Deep forest night center
        bgGrad.addColorStop(0.4, '#091c14');
        bgGrad.addColorStop(1, '#040d08');
      } else {
        bgGrad.addColorStop(0, '#190a36'); // Galactic purple center
        bgGrad.addColorStop(0.4, '#0e0622');
        bgGrad.addColorStop(1, '#070311');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle nebulae
      const nebula1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 10, width * 0.2, height * 0.3, 400);
      nebula1.addColorStop(0, isGreenActive ? 'rgba(82, 183, 136, 0.14)' : 'rgba(168, 85, 247, 0.12)');
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, 450);
      nebula2.addColorStop(0, isGreenActive ? 'rgba(163, 177, 138, 0.12)' : 'rgba(192, 132, 252, 0.08)');
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Draw and twinkle stars
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.speed = -star.speed;
        }

        // Hue calculation based on theme
        let starHue: number;
        if (isGreenActive) {
          // Sage green, emerald, and warm gold shimmers
          starHue = star.hueOffset > 0.4 ? (star.hueOffset > 0.7 ? 145 : 155) : 48;
        } else {
          // Purple, lavender, violet
          starHue = star.hueOffset > 0.6 ? 275 : star.hueOffset > 0.3 ? 290 : 260;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${starHue}, 80%, ${isGreenActive && starHue === 48 ? '90%' : '85%'}, ${Math.max(0.1, Math.min(1, star.alpha))})`;
        ctx.shadowBlur = star.radius * 3;
        ctx.shadowColor = isGreenActive ? 'rgba(216, 243, 220, 0.8)' : 'rgba(216, 180, 254, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Handle shooting star
      const now = Date.now();
      if (!shootingStar && now > nextShootingStarTime) {
        shootingStar = {
          x: Math.random() * (width * 0.7),
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 80,
          speed: Math.random() * 8 + 8,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          active: true,
          opacity: 1,
        };
      }

      if (shootingStar && shootingStar.active) {
        const dx = Math.cos(shootingStar.angle) * shootingStar.speed;
        const dy = Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.x += dx;
        shootingStar.y += dy;
        shootingStar.opacity -= 0.02;

        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        if (isGreenActive) {
          grad.addColorStop(0, 'rgba(183, 228, 199, 0)');
          grad.addColorStop(1, `rgba(254, 250, 224, ${Math.max(0, shootingStar.opacity)})`);
        } else {
          grad.addColorStop(0, 'rgba(216, 180, 254, 0)');
          grad.addColorStop(1, `rgba(255, 255, 255, ${Math.max(0, shootingStar.opacity)})`);
        }

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar = null;
          nextShootingStarTime = Date.now() + 4000 + Math.random() * 7000;
        }
      }

      // Draw ambient gentle floating elements
      ambientHearts.forEach((heart, idx) => {
        heart.y -= heart.speed;
        if (heart.y < -30) {
          heart.y = height + 20;
          heart.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.rotate((heart.rotation * Math.PI) / 180);
        ctx.fillStyle = isGreenActive
          ? `rgba(183, 212, 184, ${heart.opacity})`
          : `rgba(192, 132, 252, ${heart.opacity})`;
        ctx.font = `${heart.size}px serif`;
        ctx.fillText(isGreenActive ? heart.symbol : '💜', 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Global click handler to spawn an interactive particle with soft pop
  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

    soundManager.playPop();
    const symbol = isGreen 
      ? (Math.random() > 0.5 ? '🌿' : '💚')
      : '💜';

    const newHeart = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY, symbol };
    setClickHearts(prev => [...prev.slice(-12), newHeart]);

    setTimeout(() => {
      setClickHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden" 
      onClick={handleGlobalClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* Interactive clicked particles */}
      {clickHearts.map(h => (
        <div
          key={h.id}
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 text-xl select-none"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            animation: 'popAndFloat 1.2s ease-out forwards',
          }}
        >
          {h.symbol}
        </div>
      ))}
    </div>
  );
};
