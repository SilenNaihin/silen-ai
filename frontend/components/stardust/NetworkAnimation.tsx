'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface NetworkAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Neural network animation with electrical pulses
 * Progress 0-0.5: Network forms
 * Progress 0.5-1.0: Electrical pulses animate
 */
export function NetworkAnimation({ progress, className = '' }: NetworkAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Always draw the network
    const networkProgress = Math.min(1, progress * 2); // Form over first 50%
    
    // Calculate neuron lighting timing
    const lightingTime = progress > 0.3 ? (progress - 0.3) / 0.7 : 0;
    
    drawNeuronNetwork(ctx, centerX, centerY, width, height, networkProgress, lightingTime);
    
    // Add pulses after network is partially formed
    if (progress > 0.3) {
      const pulseProgress = (progress - 0.3) / 0.7;
      drawElectricalPulses(ctx, centerX, centerY, width, height, pulseProgress);
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

// Neuron network - spread out with less density in center
function drawNeuronNetwork(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  progress: number,
  lightingTime: number = 0
) {
  const maxNeurons = 35;
  const neuronCount = Math.floor(maxNeurons * progress);
  const neurons: Array<{ x: number; y: number; size: number; layer: number }> = [];

  // Create neurons in circular rings, avoiding dense center
  for (let i = 0; i < neuronCount; i++) {
    const ring = Math.floor((i / maxNeurons) * 3); // 3 rings
    const nodesInRing = Math.ceil(maxNeurons / 3);
    const indexInRing = i % nodesInRing;
    const angleStep = (Math.PI * 2) / nodesInRing;
    
    // Start from outer rings, spread out more
    const minRadius = 60 + ring * 50; // Start further from center
    const maxRadius = minRadius + 40;
    const radius = minRadius + (indexInRing / nodesInRing) * (maxRadius - minRadius);
    
    const angle = angleStep * indexInRing + ring * 0.3 + Math.sin(indexInRing) * 0.2;

    neurons.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      size: 3 + Math.random() * 1.5,
      layer: ring,
    });
  }

  // Create connections with preference for nearby nodes
  const connections: Array<{ 
    from: number; 
    to: number; 
    strength: number;
    isExcitatory: boolean;
  }> = [];

  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const dist = Math.hypot(
        neurons[i].x - neurons[j].x,
        neurons[i].y - neurons[j].y
      );
      const maxDist = 90;

      if (dist < maxDist) {
        const strength = 1 - dist / maxDist;
        // Alternate between excitatory and inhibitory
        const isExcitatory = (i + j) % 3 !== 0;
        connections.push({ from: i, to: j, strength, isExcitatory });
      }
    }
  }

  // Draw connections with varying thickness
  connections.forEach((conn) => {
    const alpha = 0.15 + conn.strength * 0.25;
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.lineWidth = 0.8 + conn.strength * 1.2;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(neurons[conn.from].x, neurons[conn.from].y);
    ctx.lineTo(neurons[conn.to].x, neurons[conn.to].y);
    ctx.stroke();
  });

  // Draw neurons with subtle lighting effect
  // Only 3-4 neurons light up at a time, slowly cycling
  const litNeuronCount = 3;
  const cycleSpeed = 2; // Slow cycle
  const cyclePhase = (lightingTime * cycleSpeed) % 1;
  
  neurons.forEach((neuron, idx) => {
    // Determine if this neuron should be lit
    // Use deterministic pattern so same neurons light up consistently
    const neuronPhase = ((idx * 0.618) % 1 + cyclePhase) % 1; // Golden ratio for good distribution
    const isLit = neuronPhase < (litNeuronCount / neurons.length);
    
    if (isLit && lightingTime > 0) {
      // Lit neuron - brighter and slightly emphasized
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.size + 1.5, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.size + 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal neuron
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.size + 1, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Electrical pulses - flowing lines instead of particles
function drawElectricalPulses(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  progress: number
) {
  const neuronCount = 35;
  const neurons: Array<{ x: number; y: number }> = [];

  // Match the network layout
  for (let i = 0; i < neuronCount; i++) {
    const ring = Math.floor((i / neuronCount) * 3);
    const nodesInRing = Math.ceil(neuronCount / 3);
    const indexInRing = i % nodesInRing;
    const angleStep = (Math.PI * 2) / nodesInRing;
    
    const minRadius = 60 + ring * 50;
    const maxRadius = minRadius + 40;
    const radius = minRadius + (indexInRing / nodesInRing) * (maxRadius - minRadius);
    const angle = angleStep * indexInRing + ring * 0.3 + Math.sin(indexInRing) * 0.2;

    neurons.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  }

  // Get connections
  const connections: Array<{ 
    from: number; 
    to: number; 
    isExcitatory: boolean;
  }> = [];

  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const dist = Math.hypot(
        neurons[i].x - neurons[j].x,
        neurons[i].y - neurons[j].y
      );
      if (dist < 90) {
        const isExcitatory = (i + j) % 3 !== 0;
        connections.push({ from: i, to: j, isExcitatory });
      }
    }
  }

  // Animate flowing pulses as gradient lines
  const pulseProgress = (progress * 3) % 1;

  connections.forEach((conn, idx) => {
    // Stagger the pulses
    const pulsePhase = (pulseProgress + idx * 0.15) % 1;
    
    // Only show pulse for portion of connections at a time
    if (pulsePhase < 0.7) {
      const from = neurons[conn.from];
      const to = neurons[conn.to];
      
      // Calculate pulse position and length
      const pulseLength = 0.3; // Length of the pulse trail
      const pulseStart = Math.max(0, pulsePhase - pulseLength);
      const pulseEnd = pulsePhase;
      
      // Draw gradient line along connection
      const gradient = ctx.createLinearGradient(
        from.x + (to.x - from.x) * pulseStart,
        from.y + (to.y - from.y) * pulseStart,
        from.x + (to.x - from.x) * pulseEnd,
        from.y + (to.y - from.y) * pulseEnd
      );
      
      const color = conn.isExcitatory ? '220, 38, 38' : '37, 99, 235'; // red-600 or blue-600
      gradient.addColorStop(0, `rgba(${color}, 0)`);
      gradient.addColorStop(0.5, `rgba(${color}, 0.8)`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(
        from.x + (to.x - from.x) * pulseStart,
        from.y + (to.y - from.y) * pulseStart
      );
      ctx.lineTo(
        from.x + (to.x - from.x) * pulseEnd,
        from.y + (to.y - from.y) * pulseEnd
      );
      ctx.stroke();
    }
  });
}

