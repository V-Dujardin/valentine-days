"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const images = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg",
  "/image5.jpeg",
  "/image6.jpeg",
  "/image7.jpeg",
  "/image8.jpeg",
  "/image9.jpg",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  color: string;
  exploded: boolean;
}

function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];
    const colors = [
      "#ff4a8d",
      "#ff6b9d",
      "#ffd700",
      "#ff69b4",
      "#ff1493",
      "#ff6347",
      "#ffa500",
      "#ff00ff",
      "#00ffff",
      "#7fff00",
    ];

    function spawnRocket() {
      rockets.push({
        x: Math.random() * canvas!.width,
        y: canvas!.height,
        targetY: Math.random() * canvas!.height * 0.5,
        speed: 4 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        exploded: false,
      });
    }

    function explode(rocket: Rocket) {
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: rocket.color,
          size: 2 + Math.random() * 3,
        });
      }
    }

    let animId: number;
    let frame = 0;

    function animate() {
      ctx!.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      frame++;
      if (frame % 40 === 0) spawnRocket();

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y -= r.speed;

        ctx!.beginPath();
        ctx!.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = r.color;
        ctx!.fill();

        if (r.y <= r.targetY) {
          explode(r);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha -= 0.012;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = Math.max(p.alpha, 0);
        ctx!.fill();
        ctx!.globalAlpha = 1;

        if (p.alpha <= 0) particles.splice(i, 1);
      }

      animId = requestAnimationFrame(animate);
    }

    spawnRocket();
    spawnRocket();
    spawnRocket();
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default function Home() {
  const [imageIndex, setImageIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [victory, setVictory] = useState(false);

  const handleNo = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
    setYesScale((prev) => prev + 0.2);
  };

  if (victory) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-100 font-sans overflow-hidden relative">
        <Fireworks />
        <main className="flex-col items-center justify-between bg-white/80 backdrop-blur-sm p-6 rounded-lg z-10 relative">
          <div className="flex flex-col items-center gap-6 text-center">
            <Image
              src="/victoire.jpg"
              alt="Victoire"
              width={300}
              height={300}
              className="rounded-lg object-cover victory-image"
            />
            <h1 className="text-4xl font-bold text-pink-600">
              Je t'aime aussi bb
            </h1>
            <div className="hearts-rain">
              {Array.from({ length: 20 }, (_, i) => (
                <span
                  key={i}
                  className="floating-heart"
                  style={
                    {
                      "--heart-left": `${Math.random() * 100}%`,
                      "--heart-delay": `${Math.random() * 3}s`,
                      "--heart-duration": `${2 + Math.random() * 3}s`,
                      "--heart-size": `${16 + Math.random() * 20}px`,
                    } as React.CSSProperties
                  }
                >
                  &#10084;
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-100 font-sans">
      <main className="flex-col items-center justify-between bg-white sm:items-start p-2 rounded-lg">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <Image
            src={images[imageIndex]}
            alt="Valentine"
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
            Veux-tu être ma Valentine ?
          </h1>
          <div className="flex flex-row gap-4 text-base font-medium items-center">
            <button
              onClick={() => setVictory(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-full px-5 text-background transition-all hover:bg-[#383838] md:min-w-[158px] cursor-pointer bg-pink-200"
              style={{ transform: `scale(${yesScale})` }}
            >
              Oui
            </button>
            <button
              onClick={handleNo}
              className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] md:min-w-[158px] cursor-pointer"
            >
              Non
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
