'use client';

import { useRef, useEffect, useState } from 'react';
import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface StardustToSiliconAnimationProps {
  progress: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface SiliconAtom {
  x: number;
  y: number;
  connections: number[];
}

/**
 * "From Stardust to Silicon" - A poetic closing animation
 *
 * Phase 1 (0-0.25): Cosmic stardust - stars twinkling in the void
 * Phase 2 (0.25-0.50): Elements forming - particles coalescing
 * Phase 3 (0.50-0.75): Silicon crystalline structure emerging
 * Phase 4 (0.75-1.0): Neural network awakening - thinking emerges
 */
export function StardustToSiliconAnimation({
  progress,
  className = '',
}: StardustToSiliconAnimationProps) {
  const starsRef = useRef<Star[]>([]);
  const siliconRef = useRef<SiliconAtom[]>([]);
  const timeRef = useRef(0);

  // Initialize stars once
  if (starsRef.current.length === 0) {
    for (let i = 0; i < 150; i++) {
      starsRef.current.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 2 + 1,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  // Initialize silicon lattice
  if (siliconRef.current.length === 0) {
    const gridSize = 5;
    const atoms: SiliconAtom[] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = i * gridSize + j;
        const connections: number[] = [];
        if (i > 0) connections.push((i - 1) * gridSize + j);
        if (i < gridSize - 1) connections.push((i + 1) * gridSize + j);
        if (j > 0) connections.push(i * gridSize + (j - 1));
        if (j < gridSize - 1) connections.push(i * gridSize + (j + 1));
        atoms.push({
          x: 0.3 + (j / (gridSize - 1)) * 0.4,
          y: 0.3 + (i / (gridSize - 1)) * 0.4,
          connections,
        });
      }
    }
    siliconRef.current = atoms;
  }

  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const centerX = width / 2;
    const centerY = height / 2;

    timeRef.current += 0.016;
    const time = timeRef.current;

    // Background gradient based on phase
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.max(width, height) * 0.7
    );

    if (progress < 0.25) {
      // Deep space
      gradient.addColorStop(0, '#0a0a15');
      gradient.addColorStop(1, '#000005');
    } else if (progress < 0.5) {
      // Nebula warmth
      const p = (progress - 0.25) / 0.25;
      gradient.addColorStop(0, `rgba(20, 15, 30, 1)`);
      gradient.addColorStop(0.5, `rgba(30, 20, 40, ${0.8 + p * 0.2})`);
      gradient.addColorStop(1, '#050510');
    } else if (progress < 0.75) {
      // Silicon blue
      const p = (progress - 0.5) / 0.25;
      gradient.addColorStop(0, `rgba(15, 25, 45, ${1})`);
      gradient.addColorStop(1, `rgba(5, 10, 20, 1)`);
    } else {
      // Neural awakening - subtle glow
      const p = (progress - 0.75) / 0.25;
      gradient.addColorStop(0, `rgba(20, 30, 50, 1)`);
      gradient.addColorStop(0.7, `rgba(10, 20, 35, 1)`);
      gradient.addColorStop(1, '#050510');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Phase 1: Stars
    if (progress < 0.5) {
      const starAlpha = progress < 0.25 ? 1 : 1 - ((progress - 0.25) / 0.25) * 0.7;
      drawStars(ctx, width, height, time, starAlpha);
    }

    // Phase 2: Particles coalescing
    if (progress >= 0.2 && progress < 0.6) {
      const p = Math.min(1, Math.max(0, (progress - 0.2) / 0.3));
      drawCoalescingParticles(ctx, centerX, centerY, width, height, time, p);
    }

    // Phase 3: Silicon lattice
    if (progress >= 0.45 && progress < 0.85) {
      const p = Math.min(1, (progress - 0.45) / 0.3);
      drawSiliconLattice(ctx, centerX, centerY, width, height, time, p);
    }

    // Phase 4: Neural network emerging
    if (progress >= 0.7) {
      const p = Math.min(1, (progress - 0.7) / 0.3);
      drawNeuralAwakening(ctx, centerX, centerY, width, height, time, p);
    }

    // Title text
    drawPhaseTitle(ctx, centerX, height, progress);
  };

  const drawStars = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    alpha: number
  ) => {
    starsRef.current.forEach((star) => {
      const twinkle =
        0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const brightness = star.brightness * twinkle * alpha;

      ctx.beginPath();
      ctx.arc(
        star.x * width,
        star.y * height,
        star.size,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fill();

      // Glow for brighter stars
      if (star.size > 1.5) {
        const glowGradient = ctx.createRadialGradient(
          star.x * width,
          star.y * height,
          0,
          star.x * width,
          star.y * height,
          star.size * 4
        );
        glowGradient.addColorStop(0, `rgba(200, 220, 255, ${brightness * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const drawCoalescingParticles = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    time: number,
    progress: number
  ) => {
    const numParticles = 60;
    const colors = ['#ff9966', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'];

    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2 + time * 0.3;
      const baseRadius = 100 + Math.sin(i * 0.5 + time) * 20;
      const radius = baseRadius * (1 - progress * 0.7);

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.6;

      const size = 3 + Math.sin(i + time * 2) * 1.5;
      const color = colors[i % colors.length];

      // Particle
      ctx.beginPath();
      ctx.arc(x, y, size * (0.5 + progress * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7 + progress * 0.3;
      ctx.fill();

      // Trail
      ctx.beginPath();
      ctx.moveTo(x, y);
      const trailAngle = angle - 0.3;
      const trailRadius = radius * 1.1;
      ctx.lineTo(
        centerX + Math.cos(trailAngle) * trailRadius,
        centerY + Math.sin(trailAngle) * trailRadius * 0.6
      );
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.3 * (1 - progress);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Central glow
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      80 * progress
    );
    glowGradient.addColorStop(0, `rgba(255, 200, 150, ${progress * 0.5})`);
    glowGradient.addColorStop(0.5, `rgba(255, 150, 100, ${progress * 0.3})`);
    glowGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSiliconLattice = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    time: number,
    progress: number
  ) => {
    const atoms = siliconRef.current;
    const scale = Math.min(width, height) * 0.8;
    const offsetX = centerX - scale * 0.5;
    const offsetY = centerY - scale * 0.5;

    // Draw connections first
    ctx.strokeStyle = `rgba(100, 180, 255, ${progress * 0.6})`;
    ctx.lineWidth = 2;

    atoms.forEach((atom, idx) => {
      const revealThreshold = progress * atoms.length;
      if (idx > revealThreshold) return;

      const ax = offsetX + atom.x * scale;
      const ay = offsetY + atom.y * scale;

      atom.connections.forEach((connIdx) => {
        if (connIdx > idx || connIdx > revealThreshold) return;
        const conn = atoms[connIdx];
        const bx = offsetX + conn.x * scale;
        const by = offsetY + conn.y * scale;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Electron flow along connection
        const flowPos = (time * 2 + idx * 0.5) % 1;
        const ex = ax + (bx - ax) * flowPos;
        const ey = ay + (by - ay) * flowPos;
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 220, 255, ${progress * 0.8})`;
        ctx.fill();
      });
    });

    // Draw atoms
    atoms.forEach((atom, idx) => {
      const revealThreshold = progress * atoms.length;
      if (idx > revealThreshold) return;

      const x = offsetX + atom.x * scale;
      const y = offsetY + atom.y * scale;
      const pulse = 1 + 0.1 * Math.sin(time * 3 + idx);

      // Outer glow
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 15 * pulse);
      glowGradient.addColorStop(0, `rgba(100, 180, 255, ${progress * 0.4})`);
      glowGradient.addColorStop(1, 'rgba(100, 180, 255, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, 15 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(x, y, 6 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 200, 255, ${progress})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(200, 230, 255, ${progress})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // "Si" label
    if (progress > 0.5) {
      ctx.font = 'bold 16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(150, 200, 255, ${(progress - 0.5) * 2})`;
      ctx.fillText('Si', centerX, centerY + scale * 0.35);
    }
  };

  const drawNeuralAwakening = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    time: number,
    progress: number
  ) => {
    // Neural network structure
    const layers = [3, 5, 5, 3];
    const layerSpacing = 70;
    const neuronSpacing = 35;
    const startX = centerX - ((layers.length - 1) * layerSpacing) / 2;

    // Draw connections
    layers.forEach((count, layerIdx) => {
      if (layerIdx === layers.length - 1) return;
      const nextCount = layers[layerIdx + 1];
      const x1 = startX + layerIdx * layerSpacing;
      const x2 = startX + (layerIdx + 1) * layerSpacing;

      for (let i = 0; i < count; i++) {
        const y1 = centerY - ((count - 1) * neuronSpacing) / 2 + i * neuronSpacing;
        for (let j = 0; j < nextCount; j++) {
          const y2 =
            centerY - ((nextCount - 1) * neuronSpacing) / 2 + j * neuronSpacing;

          // Signal pulse along connection
          const signalPhase = (time * 1.5 + i * 0.3 + j * 0.2) % 1;
          const signalX = x1 + (x2 - x1) * signalPhase;
          const signalY = y1 + (y2 - y1) * signalPhase;

          ctx.strokeStyle = `rgba(100, 200, 150, ${progress * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Signal pulse
          if (progress > 0.3) {
            ctx.beginPath();
            ctx.arc(signalX, signalY, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 150, ${progress * 0.8})`;
            ctx.fill();
          }
        }
      }
    });

    // Draw neurons
    layers.forEach((count, layerIdx) => {
      const x = startX + layerIdx * layerSpacing;
      for (let i = 0; i < count; i++) {
        const y = centerY - ((count - 1) * neuronSpacing) / 2 + i * neuronSpacing;
        const activation = 0.5 + 0.5 * Math.sin(time * 2 + layerIdx + i * 0.5);

        // Neuron glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        glowGradient.addColorStop(
          0,
          `rgba(100, 255, 150, ${progress * activation * 0.4})`
        );
        glowGradient.addColorStop(1, 'rgba(100, 255, 150, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Neuron core
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50, ${150 + activation * 100}, 100, ${progress})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(100, 255, 150, ${progress})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // "Thinking" indicator
    if (progress > 0.7) {
      const thinkAlpha = (progress - 0.7) / 0.3;
      ctx.font = 'italic 14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(100, 255, 150, ${thinkAlpha * 0.8})`;

      // Pulsing ellipsis
      const dots = Math.floor((time * 2) % 4);
      const text = 'thinking' + '.'.repeat(dots);
      ctx.fillText(text, centerX, centerY + 90);
    }
  };

  const drawPhaseTitle = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    height: number,
    progress: number
  ) => {
    let title = '';
    let alpha = 0;

    if (progress < 0.2) {
      title = 'Stardust';
      alpha = progress < 0.1 ? progress / 0.1 : 1;
    } else if (progress < 0.25) {
      title = 'Stardust';
      alpha = 1 - (progress - 0.2) / 0.05;
    } else if (progress < 0.45) {
      title = 'Elements Form';
      alpha = progress < 0.3 ? (progress - 0.25) / 0.05 : 1;
    } else if (progress < 0.5) {
      title = 'Elements Form';
      alpha = 1 - (progress - 0.45) / 0.05;
    } else if (progress < 0.7) {
      title = 'Silicon';
      alpha = progress < 0.55 ? (progress - 0.5) / 0.05 : 1;
    } else if (progress < 0.75) {
      title = 'Silicon';
      alpha = 1 - (progress - 0.7) / 0.05;
    } else if (progress < 0.95) {
      title = 'Intelligence';
      alpha = progress < 0.8 ? (progress - 0.75) / 0.05 : 1;
    } else {
      title = 'Intelligence';
      alpha = 1;
    }

    if (alpha > 0) {
      ctx.font = 'bold 24px system-ui';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      ctx.fillText(title, centerX, height * 0.9);
    }
  };

  return (
    <AnimationCanvas
      progress={progress}
      className={`w-full h-full ${className}`}
    >
      {renderAnimation}
    </AnimationCanvas>
  );
}
