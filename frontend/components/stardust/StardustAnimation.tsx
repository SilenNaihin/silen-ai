'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface StardustAnimationProps {
  scrollProgress: number;
  startOffset?: number; // Optional offset to start animation ahead (e.g., 0.2 to start at 20%)
  className?: string;
}

/**
 * Stardust animation that progresses through different scenes based on scroll
 *
 * Simplified animation sequence:
 * 0.0 - 0.5: Particles filling in from sparse to dense
 * 0.4 - 0.7: Network forming from particles
 * 0.65 - 1.0: Electrical pulses through network
 */
export function StardustAnimation({
  scrollProgress,
  startOffset = 0,
  className = '',
}: StardustAnimationProps) {
  // Apply start offset to scroll progress
  const adjustedProgress = Math.min(1, scrollProgress + startOffset);

  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const centerX = width / 2;
    const centerY = height / 2;

    // Helper function to calculate opacity for overlapping scenes
    const getSceneOpacity = (
      start: number,
      peak: number,
      end: number,
      progress: number
    ) => {
      if (progress < start) return 0;
      if (progress < peak) return (progress - start) / (peak - start);
      if (progress < end) return 1 - (progress - peak) / (end - peak);
      return 0;
    };

    // Scene 1: Particles filling in (0.0 - 0.5)
    const particlesOpacity = getSceneOpacity(0.0, 0.3, 0.6, adjustedProgress);
    if (particlesOpacity > 0) {
      const sceneProgress = Math.min(1, adjustedProgress / 0.5);
      drawParticlesFilling(
        ctx,
        centerX,
        centerY,
        width,
        height,
        sceneProgress,
        particlesOpacity
      );
    }

    // Scene 2: Network forming (0.4 - 0.7)
    const networkOpacity = getSceneOpacity(0.4, 0.55, 0.75, adjustedProgress);
    if (networkOpacity > 0) {
      const sceneProgress = Math.min(1, (adjustedProgress - 0.4) / 0.3);
      drawNeuronNetwork(
        ctx,
        centerX,
        centerY,
        width,
        height,
        sceneProgress,
        networkOpacity
      );
    }

    // Scene 3: Electrical pulses (0.65 - 1.0)
    const pulsesOpacity = getSceneOpacity(0.65, 0.75, 1.1, adjustedProgress);
    if (pulsesOpacity > 0) {
      const sceneProgress = Math.min(1, (adjustedProgress - 0.65) / 0.35);
      drawElectricalPulses(
        ctx,
        centerX,
        centerY,
        width,
        height,
        sceneProgress,
        pulsesOpacity
      );
    }
  };

  return (
    <AnimationCanvas
      progress={adjustedProgress}
      className={`w-full h-full ${className}`}
    >
      {renderAnimation}
    </AnimationCanvas>
  );
}

// Scene 1: Particles filling in from sparse to dense
function drawParticlesFilling(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  progress: number,
  opacity: number = 1
) {
  const maxParticles = 400;
  const particleCount = Math.floor(maxParticles * progress); // Start with few, add more as we go

  // Create deterministic particle positions (same seed for consistency)
  for (let i = 0; i < particleCount; i++) {
    // Use pseudo-random but deterministic positions
    const seed = i * 2654435761; // Large prime for good distribution
    const angle = ((seed % 1000) / 1000) * Math.PI * 2;
    const radiusFactor = (seed % 500) / 500;

    // Distribute in concentric layers
    const layer = Math.floor((i / maxParticles) * 5);
    const baseRadius = 20 + layer * 35 + radiusFactor * 30;

    // Add some organic variation
    const angleOffset = Math.sin(i * 0.5) * 0.3;
    const finalAngle = angle + angleOffset;

    const x = cx + Math.cos(finalAngle) * baseRadius;
    const y = cy + Math.sin(finalAngle) * baseRadius;

    // Particles appear layer by layer from center outward
    // Layer 0 (center): appears from progress 0.0 - 0.2
    // Layer 1: appears from progress 0.15 - 0.35
    // Layer 2: appears from progress 0.3 - 0.5
    // Layer 3: appears from progress 0.45 - 0.65
    // Layer 4 (outer): appears from progress 0.6 - 0.8
    const layerStartProgress = layer * 0.15;

    // Calculate appearance within the layer's time window
    const particleIndexInLayer = i % 80; // 400 particles / 5 layers = 80 per layer
    const particleDelayInLayer = (particleIndexInLayer / 80) * 0.15;

    const appearProgress = Math.max(
      0,
      Math.min(1, (progress - layerStartProgress - particleDelayInLayer) / 0.1)
    );

    if (appearProgress > 0) {
      // Size varies for visual interest
      const size = (1.5 + (seed % 10) / 10) * appearProgress;

      // Alpha based on appearance progress
      const alpha = appearProgress * 0.7 * opacity;

      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Scene 2: Neuron network
function drawNeuronNetwork(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  progress: number,
  opacity: number = 1
) {
  const maxNeurons = 40;
  const neuronCount = Math.floor(maxNeurons * progress);
  const neurons: Array<{ x: number; y: number; size: number; layer: number }> =
    [];

  // Create layered neuron positions (more realistic network structure)
  for (let i = 0; i < neuronCount; i++) {
    const layer = Math.floor((i / maxNeurons) * 4); // 4 layers
    const layerProgress = (i % (maxNeurons / 4)) / (maxNeurons / 4);

    const angle = layerProgress * Math.PI * 2 + layer * 0.5;
    const radius = (30 + layer * 40) * (0.8 + Math.sin(angle * 3) * 0.2);

    neurons.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      size: 2 + Math.random() * 2,
      layer: layer,
    });
  }

  // Draw connections between nearby neurons
  const connections: Array<{ from: number; to: number; strength: number }> = [];

  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const dist = Math.hypot(
        neurons[i].x - neurons[j].x,
        neurons[i].y - neurons[j].y
      );
      const maxDist = 70;

      if (dist < maxDist) {
        const strength = 1 - dist / maxDist;
        connections.push({ from: i, to: j, strength });
      }
    }
  }

  // Draw connections with varying opacity
  connections.forEach((conn) => {
    const alpha = (0.1 + conn.strength * 0.2) * opacity;
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.lineWidth = 0.5 + conn.strength;

    ctx.beginPath();
    ctx.moveTo(neurons[conn.from].x, neurons[conn.from].y);
    ctx.lineTo(neurons[conn.to].x, neurons[conn.to].y);
    ctx.stroke();
  });

  // Draw neurons with gradient
  neurons.forEach((neuron) => {
    const gradient = ctx.createRadialGradient(
      neuron.x,
      neuron.y,
      0,
      neuron.x,
      neuron.y,
      neuron.size
    );
    gradient.addColorStop(0, `rgba(0, 0, 0, ${0.9 * opacity})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${0.6 * opacity})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2);
    ctx.fill();

    // Highlight ring
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.3 * opacity})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });
}

// Scene 6: Electrical pulses (stable state with animation)
function drawElectricalPulses(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  progress: number,
  opacity: number = 1
) {
  const neuronCount = 30;
  const neurons: Array<{ x: number; y: number }> = [];

  // Create fixed neuron positions
  for (let i = 0; i < neuronCount; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 50 + ((i * 17) % 30) * 3; // Pseudo-random but stable
    neurons.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  }

  // Draw connections
  ctx.strokeStyle = `rgba(0, 0, 0, ${0.2 * opacity})`;
  ctx.lineWidth = 1;
  const connections: Array<{ from: number; to: number }> = [];

  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const dist = Math.hypot(
        neurons[i].x - neurons[j].x,
        neurons[i].y - neurons[j].y
      );
      if (dist < 80) {
        ctx.beginPath();
        ctx.moveTo(neurons[i].x, neurons[i].y);
        ctx.lineTo(neurons[j].x, neurons[j].y);
        ctx.stroke();
        connections.push({ from: i, to: j });
      }
    }
  }

  // Draw neurons
  ctx.fillStyle = `rgba(0, 0, 0, ${0.8 * opacity})`;
  neurons.forEach((neuron) => {
    ctx.beginPath();
    ctx.arc(neuron.x, neuron.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Animate pulses along connections
  const pulseProgress = (progress * 5) % 1; // Repeating animation

  connections.forEach((conn, idx) => {
    // Stagger pulses
    const pulsePhase = (pulseProgress + idx * 0.1) % 1;

    if (pulsePhase < 0.8) {
      const from = neurons[conn.from];
      const to = neurons[conn.to];
      const x = from.x + (to.x - from.x) * pulsePhase;
      const y = from.y + (to.y - from.y) * pulsePhase;

      // Alternate colors for excitatory/inhibitory
      const isExcitatory = idx % 2 === 0;
      const color = isExcitatory
        ? `rgba(200, 0, 0, ${0.6 * opacity})`
        : `rgba(0, 0, 200, ${0.6 * opacity})`;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
