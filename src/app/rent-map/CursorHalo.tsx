"use client";
import { useEffect, useState } from 'react';

function lightenColor(color: string, amount = 0.2) {
  // Only works for rgb(a) or hex
  let r = 180, g = 190, b = 255; // fallback
  if (color.startsWith('rgb')) {
    const nums = color.match(/\d+/g)?.map(Number) || [r, g, b];
    [r, g, b] = nums;
  } else if (color.startsWith('#')) {
    if (color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }
  }
  // Lighten and add alpha
  r = Math.min(255, Math.floor(r + (255 - r) * amount));
  g = Math.min(255, Math.floor(g + (255 - g) * amount));
  b = Math.min(255, Math.floor(b + (255 - b) * amount));
  return `rgba(${r},${g},${b},0.10)`;
}

export default function CursorHalo({ color }: { color?: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [bg, setBg] = useState('rgba(180,190,255,0.10)');

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (el) {
        const style = window.getComputedStyle(el);
        const base = color === 'green' ? '#34d399' : style.backgroundColor || '#b4beff';
        setBg(lightenColor(base));
      } else {
        setBg(color === 'green' ? 'rgba(52,211,153,0.10)' : 'rgba(180,190,255,0.10)');
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [color]);

  return (
    <div
      style={{
        left: pos.x - 28,
        top: pos.y - 28,
        pointerEvents: 'none',
        position: 'fixed',
        zIndex: 9999,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: bg,
        filter: 'blur(6px)',
        transition: 'left 0.08s cubic-bezier(.4,0,.2,1), top 0.08s cubic-bezier(.4,0,.2,1), background 0.2s',
      }}
      aria-hidden
    />
  );
} 