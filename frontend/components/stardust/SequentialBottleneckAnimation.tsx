'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface SequentialBottleneckAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Sequential Bottleneck Animation - Why RNNs/LSTMs have fundamental limitations
 *
 * Phase 1 (0-0.25): Sequential processing - tokens must wait, no parallelization
 * Phase 2 (0.25-0.50): Long-range dependency - information fades with distance
 * Phase 3 (0.50-0.75): Fixed context window - can only "see" limited history
 * Phase 4 (0.75-1.0): Attention teaser - what if every token could see every other?
 */
export function SequentialBottleneckAnimation({
  progress,
  className = '',
}: SequentialBottleneckAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const centerX = width * 0.5;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    const phase = getPhase(progress);

    // Draw title
    const title = getTitleForPhase(phase);
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText(title, centerX, titleY);

    // Render appropriate phase
    if (phase === 1) {
      drawSequentialProcessing(ctx, width, height, progress);
    } else if (phase === 2) {
      drawLongRangeDependency(ctx, width, height, progress);
    } else if (phase === 3) {
      drawFixedContextWindow(ctx, width, height, progress);
    } else {
      drawAttentionTeaser(ctx, width, height, progress);
    }

    // Draw phase label
    drawPhaseLabel(ctx, centerX, phaseLabelY, phase);
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

function getPhase(progress: number): number {
  if (progress < 0.25) return 1;
  if (progress < 0.5) return 2;
  if (progress < 0.75) return 3;
  return 4;
}

function getTitleForPhase(phase: number): string {
  switch (phase) {
    case 1:
      return 'Problem 1: Sequential Processing';
    case 2:
      return 'Problem 2: Long-Range Dependencies';
    case 3:
      return 'Problem 3: Fixed Context Window';
    case 4:
      return 'What If We Could Do Better?';
    default:
      return '';
  }
}

/**
 * Phase 1: Sequential Processing
 * Shows tokens queued up, being processed one at a time with a "clock" indicator
 */
function drawSequentialProcessing(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const localProgress = progress / 0.25;
  const tokens = ['The', 'quick', 'brown', 'fox', 'jumps', 'over'];
  const numTokens = tokens.length;

  const tokenWidth = 55;
  const tokenHeight = 28;
  const spacing = 10;
  const totalWidth = numTokens * (tokenWidth + spacing) - spacing;
  const startX = (width - totalWidth) / 2;
  const queueY = height * 0.28;
  const processingY = height * 0.5;

  // Current token being processed
  const processedCount = Math.floor(localProgress * numTokens);
  const processingProgress = (localProgress * numTokens) % 1;

  // Draw "queue" label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillText('Token Queue (waiting...)', width / 2, queueY - 25);

  // Draw tokens in queue
  for (let i = 0; i < numTokens; i++) {
    const x = startX + i * (tokenWidth + spacing);
    const isProcessed = i < processedCount;
    const isProcessing = i === processedCount;

    // Token position - processed ones move down
    let tokenY = queueY;
    let alpha = 1;

    if (isProcessed) {
      tokenY = processingY;
      alpha = 0.4; // Faded once processed
    } else if (isProcessing) {
      // Animating down
      tokenY = queueY + (processingY - queueY) * processingProgress;
      alpha = 1;
    }

    // Draw token box
    const borderColor = isProcessing
      ? `rgba(60, 140, 80, ${alpha})`
      : isProcessed
        ? `rgba(0, 0, 0, ${alpha * 0.3})`
        : `rgba(0, 0, 0, ${alpha * 0.6})`;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = isProcessing ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.roundRect(x, tokenY - tokenHeight / 2, tokenWidth, tokenHeight, 4);
    ctx.stroke();

    ctx.fillStyle = isProcessing
      ? `rgba(60, 140, 80, ${alpha * 0.1})`
      : `rgba(0, 0, 0, ${alpha * 0.03})`;
    ctx.fill();

    // Token text
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isProcessing
      ? `rgba(60, 140, 80, ${alpha * 0.9})`
      : `rgba(0, 0, 0, ${alpha * 0.7})`;
    ctx.fillText(tokens[i], x + tokenWidth / 2, tokenY);

    // Wait indicator for queued tokens
    if (!isProcessed && !isProcessing && i > processedCount) {
      ctx.font = '8px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(180, 60, 60, 0.6)';
      ctx.fillText('waiting', x + tokenWidth / 2, tokenY + tokenHeight / 2 + 12);
    }
  }

  // Draw RNN processing unit
  const rnnX = width / 2;
  const rnnY = processingY;
  const rnnSize = 60;

  // RNN box
  ctx.strokeStyle = 'rgba(60, 140, 80, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rnnX - rnnSize / 2, rnnY + 40, rnnSize, rnnSize, 8);
  ctx.stroke();

  ctx.fillStyle = 'rgba(60, 140, 80, 0.1)';
  ctx.fill();

  // RNN label
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(60, 140, 80, 0.9)';
  ctx.fillText('RNN', rnnX, rnnY + 70);

  // Processing indicator (spinning)
  if (processedCount < numTokens) {
    const spinAngle = localProgress * Math.PI * 8;
    ctx.strokeStyle = 'rgba(60, 140, 80, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rnnX, rnnY + 70, 25, spinAngle, spinAngle + Math.PI * 1.5);
    ctx.stroke();
  }

  // Time indicator
  const clockX = width * 0.85;
  const clockY = height * 0.55;

  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(180, 60, 60, 0.8)';
  ctx.textAlign = 'center';
  ctx.fillText('Time steps:', clockX, clockY - 25);

  // Time bar
  const timeBarWidth = 80;
  const timeBarHeight = 15;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.roundRect(clockX - timeBarWidth / 2, clockY - 8, timeBarWidth, timeBarHeight, 4);
  ctx.fill();

  ctx.fillStyle = 'rgba(180, 60, 60, 0.7)';
  ctx.beginPath();
  ctx.roundRect(
    clockX - timeBarWidth / 2,
    clockY - 8,
    timeBarWidth * localProgress,
    timeBarHeight,
    4
  );
  ctx.fill();

  ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(`${processedCount}/${numTokens}`, clockX, clockY);

  // Bottom message
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(180, 60, 60, 0.8)';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Each token must wait for all previous tokens to finish.',
    width / 2,
    height * 0.82
  );
  ctx.fillText(
    'No parallelization possible!',
    width / 2,
    height * 0.86
  );
}

/**
 * Phase 2: Long-Range Dependency
 * Shows information decaying over distance
 */
function drawLongRangeDependency(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const localProgress = (progress - 0.25) / 0.25;
  const sentence = ['The', 'cat', 'that', 'sat', 'on', 'the', 'old', 'wooden', 'mat', '___'];

  const tokenWidth = 42;
  const tokenHeight = 26;
  const spacing = 6;
  const totalWidth = sentence.length * (tokenWidth + spacing) - spacing;
  const startX = (width - totalWidth) / 2;
  const tokenY = height * 0.25;

  // Draw sentence
  for (let i = 0; i < sentence.length; i++) {
    const x = startX + i * (tokenWidth + spacing);
    const isCat = i === 1;
    const isBlank = i === sentence.length - 1;

    // Highlight subject
    if (isCat) {
      ctx.fillStyle = 'rgba(60, 140, 80, 0.15)';
      ctx.beginPath();
      ctx.roundRect(x - 2, tokenY - tokenHeight / 2 - 2, tokenWidth + 4, tokenHeight + 4, 6);
      ctx.fill();
    }

    ctx.strokeStyle = isCat
      ? 'rgba(60, 140, 80, 0.8)'
      : isBlank
        ? 'rgba(180, 60, 60, 0.8)'
        : 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = isCat || isBlank ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x, tokenY - tokenHeight / 2, tokenWidth, tokenHeight, 4);
    ctx.stroke();

    ctx.font = isCat || isBlank ? 'bold 11px system-ui' : '11px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isCat
      ? 'rgba(60, 140, 80, 0.9)'
      : isBlank
        ? 'rgba(180, 60, 60, 0.9)'
        : 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(sentence[i], x + tokenWidth / 2, tokenY);
  }

  // Subject label
  ctx.font = '9px system-ui';
  ctx.fillStyle = 'rgba(60, 140, 80, 0.8)';
  ctx.textAlign = 'center';
  ctx.fillText('subject', startX + tokenWidth + spacing / 2, tokenY + tokenHeight / 2 + 12);

  // Draw hidden states below
  const hiddenY = height * 0.48;
  const hiddenSize = 22;

  // Calculate signal strength at each position
  const catIndex = 1;
  const numHidden = sentence.length;
  const decayRate = 0.72; // Signal decays by this factor each step

  // Draw hidden state chain
  for (let i = 0; i < numHidden; i++) {
    const x = startX + i * (tokenWidth + spacing) + tokenWidth / 2;
    const stepsFromCat = i - catIndex;
    const signalStrength = stepsFromCat <= 0 ? 1 : Math.pow(decayRate, stepsFromCat);

    // Animate the decay spreading
    const visibleDecay = localProgress * (numHidden - 1);
    const currentStrength = i <= catIndex + visibleDecay ? signalStrength : 1;

    // Hidden state circle
    const intensity = currentStrength;
    ctx.fillStyle = `rgba(60, 140, 80, ${intensity * 0.6})`;
    ctx.beginPath();
    ctx.arc(x, hiddenY, hiddenSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(60, 140, 80, ${0.3 + intensity * 0.5})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(`h${i + 1}`, x, hiddenY);

    // Connection to next
    if (i < numHidden - 1) {
      const nextX = startX + (i + 1) * (tokenWidth + spacing) + tokenWidth / 2;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + hiddenSize / 2 + 2, hiddenY);
      ctx.lineTo(nextX - hiddenSize / 2 - 2, hiddenY);
      ctx.stroke();

      // Arrow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      drawArrowhead(ctx, nextX - hiddenSize / 2 - 2, hiddenY, 0, 4);
    }
  }

  // Signal strength visualization
  const barY = height * 0.68;
  const barHeight = 50;
  const barWidth = 18;

  ctx.font = '10px system-ui';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('"cat" signal strength at each position:', width / 2, barY - 25);

  for (let i = catIndex; i < numHidden; i++) {
    const x = startX + i * (tokenWidth + spacing) + tokenWidth / 2;
    const stepsFromCat = i - catIndex;
    const signalStrength = Math.pow(decayRate, stepsFromCat);

    // Animate appearance
    const appearProgress = Math.min(1, localProgress * 3 - (i - catIndex) * 0.3);
    if (appearProgress <= 0) continue;

    const currentHeight = barHeight * signalStrength * appearProgress;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, barY, barWidth, barHeight, 3);
    ctx.fill();

    // Fill based on strength
    const r = Math.floor(60 + (180 - 60) * (1 - signalStrength));
    const g = Math.floor(140 - 80 * (1 - signalStrength));
    ctx.fillStyle = `rgba(${r}, ${g}, 80, 0.7)`;
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, barY + barHeight - currentHeight, barWidth, currentHeight, 3);
    ctx.fill();

    // Percentage
    ctx.font = '8px system-ui';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(signalStrength * 100)}%`, x, barY + barHeight + 12);
  }

  // Problem statement
  if (localProgress > 0.6) {
    const alpha = (localProgress - 0.6) / 0.4;
    ctx.font = '12px system-ui';
    ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.9})`;
    ctx.textAlign = 'center';
    ctx.fillText(
      'By the time we need to predict, "cat" signal is nearly gone!',
      width / 2,
      height * 0.88
    );
  }
}

/**
 * Phase 3: Fixed Context Window
 * Shows that RNN can only effectively "see" limited history
 */
function drawFixedContextWindow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const localProgress = (progress - 0.5) / 0.25;

  // Long sequence of tokens
  const tokens = ['Once', 'upon', 'a', 'time', 'in', 'a', 'land', 'far', 'away', 'there', 'lived', 'a', 'king'];
  const numTokens = tokens.length;

  const tokenWidth = 36;
  const tokenHeight = 24;
  const spacing = 4;
  const totalWidth = numTokens * (tokenWidth + spacing) - spacing;
  const startX = (width - totalWidth) / 2;
  const tokenY = height * 0.22;

  // Current position (moves through sequence)
  const currentPos = Math.min(numTokens - 1, Math.floor(localProgress * numTokens * 0.8) + 5);
  const effectiveContext = 4; // RNN can only effectively use ~4 recent tokens

  // Draw all tokens
  for (let i = 0; i < numTokens; i++) {
    const x = startX + i * (tokenWidth + spacing);
    const distanceFromCurrent = currentPos - i;

    // Determine visibility based on context window
    let inContext = distanceFromCurrent >= 0 && distanceFromCurrent < effectiveContext;
    let isFaded = i < currentPos - effectiveContext;
    let isFuture = i > currentPos;

    // Token styling
    let alpha = 1;
    let borderColor = 'rgba(0, 0, 0, 0.4)';
    let fillColor = 'rgba(0, 0, 0, 0.03)';

    if (inContext) {
      // Strength decreases with distance
      const strength = 1 - distanceFromCurrent * 0.2;
      borderColor = `rgba(60, 140, 80, ${strength})`;
      fillColor = `rgba(60, 140, 80, ${strength * 0.15})`;
    } else if (isFaded) {
      alpha = 0.25;
      borderColor = 'rgba(180, 60, 60, 0.3)';
    } else if (isFuture) {
      alpha = 0.4;
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = inContext ? 2 : 1;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.roundRect(x, tokenY - tokenHeight / 2, tokenWidth, tokenHeight, 3);
    ctx.stroke();

    ctx.fillStyle = fillColor;
    ctx.fill();

    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = inContext ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(tokens[i], x + tokenWidth / 2, tokenY);

    ctx.globalAlpha = 1;
  }

  // Draw context window bracket
  const windowStartX = startX + Math.max(0, currentPos - effectiveContext + 1) * (tokenWidth + spacing);
  const windowEndX = startX + currentPos * (tokenWidth + spacing) + tokenWidth;
  const bracketY = tokenY + tokenHeight / 2 + 15;

  // Context window bracket
  ctx.strokeStyle = 'rgba(60, 140, 80, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(windowStartX, bracketY + 10);
  ctx.lineTo(windowStartX, bracketY);
  ctx.lineTo(windowEndX, bracketY);
  ctx.lineTo(windowEndX, bracketY + 10);
  ctx.stroke();

  ctx.font = '10px system-ui';
  ctx.fillStyle = 'rgba(60, 140, 80, 0.9)';
  ctx.textAlign = 'center';
  ctx.fillText('Effective Context', (windowStartX + windowEndX) / 2, bracketY + 22);

  // "Lost" indicator for tokens outside window
  if (currentPos >= effectiveContext) {
    const lostEndX = startX + (currentPos - effectiveContext) * (tokenWidth + spacing) + tokenWidth;
    ctx.strokeStyle = 'rgba(180, 60, 60, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(startX, bracketY);
    ctx.lineTo(lostEndX, bracketY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '9px system-ui';
    ctx.fillStyle = 'rgba(180, 60, 60, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('Lost to time', (startX + lostEndX) / 2, bracketY + 22);
  }

  // Draw RNN visualization showing limited memory
  const rnnY = height * 0.58;
  const rnnWidth = 200;
  const rnnHeight = 80;
  const rnnX = (width - rnnWidth) / 2;

  // RNN box
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(rnnX, rnnY, rnnWidth, rnnHeight, 8);
  ctx.stroke();

  // Memory slots inside RNN
  const slotWidth = 35;
  const slotHeight = 20;
  const slotSpacing = 8;
  const slotsStartX = rnnX + 20;
  const slotY = rnnY + 30;

  ctx.font = '9px system-ui';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('Hidden State (limited capacity)', rnnX + rnnWidth / 2, rnnY + 15);

  for (let i = 0; i < effectiveContext; i++) {
    const x = slotsStartX + i * (slotWidth + slotSpacing);
    const strength = 1 - i * 0.25;

    ctx.fillStyle = `rgba(60, 140, 80, ${strength * 0.3})`;
    ctx.beginPath();
    ctx.roundRect(x, slotY, slotWidth, slotHeight, 3);
    ctx.fill();

    ctx.strokeStyle = `rgba(60, 140, 80, ${strength * 0.8})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Show what's stored
    const tokenIdx = Math.max(0, currentPos - (effectiveContext - 1 - i));
    if (tokenIdx < tokens.length) {
      ctx.font = '8px system-ui';
      ctx.fillStyle = `rgba(60, 140, 80, ${strength * 0.9})`;
      ctx.textAlign = 'center';
      ctx.fillText(tokens[tokenIdx], x + slotWidth / 2, slotY + slotHeight / 2 + 3);
    }
  }

  // Arrow showing new info pushing out old
  if (localProgress > 0.3) {
    const arrowAlpha = Math.min(1, (localProgress - 0.3) / 0.3);

    ctx.strokeStyle = `rgba(180, 60, 60, ${arrowAlpha * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rnnX - 20, slotY + slotHeight / 2);
    ctx.lineTo(rnnX - 5, slotY + slotHeight / 2);
    ctx.stroke();
    drawArrowhead(ctx, rnnX - 5, slotY + slotHeight / 2, 0, 4);

    ctx.font = '8px system-ui';
    ctx.fillStyle = `rgba(180, 60, 60, ${arrowAlpha * 0.7})`;
    ctx.textAlign = 'right';
    ctx.fillText('new', rnnX - 25, slotY + slotHeight / 2 + 3);

    // Exit arrow
    ctx.strokeStyle = `rgba(180, 60, 60, ${arrowAlpha * 0.6})`;
    ctx.beginPath();
    ctx.moveTo(rnnX + rnnWidth + 5, slotY + slotHeight / 2);
    ctx.lineTo(rnnX + rnnWidth + 20, slotY + slotHeight / 2);
    ctx.stroke();
    drawArrowhead(ctx, rnnX + rnnWidth + 20, slotY + slotHeight / 2, 0, 4);

    ctx.font = '8px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('lost', rnnX + rnnWidth + 25, slotY + slotHeight / 2 + 3);
  }

  // Bottom message
  ctx.font = '12px system-ui';
  ctx.fillStyle = 'rgba(180, 60, 60, 0.9)';
  ctx.textAlign = 'center';
  ctx.fillText(
    'RNNs have a fixed-size hidden state.',
    width / 2,
    height * 0.84
  );
  ctx.fillText(
    'Old information must be discarded to make room for new.',
    width / 2,
    height * 0.88
  );
}

/**
 * Phase 4: Attention Teaser
 * Shows the concept of direct token-to-token connections
 */
function drawAttentionTeaser(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const localProgress = (progress - 0.75) / 0.25;
  const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
  const numTokens = tokens.length;

  // Arrange tokens in a circle
  const centerX = width / 2;
  const centerY = height * 0.5;
  const radius = Math.min(width, height) * 0.28;

  const tokenWidth = 48;
  const tokenHeight = 26;

  // Phase 1: Tokens appear (0-0.2)
  // Phase 2: Lines start connecting (0.2-0.7)
  // Phase 3: "Attention" appears in center (0.7-1.0)

  const tokenAlpha = Math.min(1, localProgress / 0.2);
  const lineProgress = Math.max(0, Math.min(1, (localProgress - 0.2) / 0.5));
  const textProgress = Math.max(0, (localProgress - 0.7) / 0.3);

  // Draw connections first (under tokens)
  if (lineProgress > 0) {
    const totalConnections = numTokens * (numTokens - 1) / 2;
    const connectionsToShow = Math.floor(lineProgress * totalConnections);

    let connectionCount = 0;
    for (let i = 0; i < numTokens && connectionCount < connectionsToShow; i++) {
      for (let j = i + 1; j < numTokens && connectionCount < connectionsToShow; j++) {
        const angle1 = (i / numTokens) * Math.PI * 2 - Math.PI / 2;
        const angle2 = (j / numTokens) * Math.PI * 2 - Math.PI / 2;

        const x1 = centerX + Math.cos(angle1) * radius;
        const y1 = centerY + Math.sin(angle1) * radius;
        const x2 = centerX + Math.cos(angle2) * radius;
        const y2 = centerY + Math.sin(angle2) * radius;

        // Connection line
        const lineAlpha = Math.min(1, (lineProgress * totalConnections - connectionCount) * 2);
        ctx.strokeStyle = `rgba(60, 140, 80, ${lineAlpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        connectionCount++;
      }
    }
  }

  // Draw tokens
  for (let i = 0; i < numTokens; i++) {
    const angle = (i / numTokens) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius - tokenWidth / 2;
    const y = centerY + Math.sin(angle) * radius - tokenHeight / 2;

    // Token box
    ctx.fillStyle = `rgba(0, 0, 0, ${tokenAlpha * 0.95})`;
    ctx.beginPath();
    ctx.roundRect(x, y, tokenWidth, tokenHeight, 5);
    ctx.fill();

    // Token text
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255, 255, 255, ${tokenAlpha * 0.95})`;
    ctx.fillText(tokens[i], x + tokenWidth / 2, y + tokenHeight / 2);
  }

  // Center text: "Attention"
  if (textProgress > 0) {
    // Background glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
    gradient.addColorStop(0, `rgba(60, 140, 80, ${textProgress * 0.2})`);
    gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 22px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(60, 140, 80, ${textProgress * 0.95})`;
    ctx.fillText('Attention', centerX, centerY);
  }

  // Bottom messages
  const msgY = height * 0.85;

  if (localProgress > 0.3) {
    const msgAlpha = Math.min(1, (localProgress - 0.3) / 0.3);
    ctx.font = '13px system-ui';
    ctx.fillStyle = `rgba(60, 140, 80, ${msgAlpha * 0.9})`;
    ctx.textAlign = 'center';
    ctx.fillText(
      'What if every token could directly attend to every other token?',
      width / 2,
      msgY - 8
    );
  }

  if (localProgress > 0.6) {
    const msgAlpha = Math.min(1, (localProgress - 0.6) / 0.3);
    ctx.font = 'bold 14px system-ui';
    ctx.fillStyle = `rgba(60, 140, 80, ${msgAlpha * 0.95})`;
    ctx.fillText(
      'No waiting. No forgetting. Just attention.',
      width / 2,
      msgY + 12
    );
  }
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number = 5
) {
  ctx.beginPath();
  ctx.moveTo(
    x + size * Math.cos(angle),
    y + size * Math.sin(angle)
  );
  ctx.lineTo(
    x + size * Math.cos(angle + (2.5 * Math.PI) / 3),
    y + size * Math.sin(angle + (2.5 * Math.PI) / 3)
  );
  ctx.lineTo(
    x + size * Math.cos(angle - (2.5 * Math.PI) / 3),
    y + size * Math.sin(angle - (2.5 * Math.PI) / 3)
  );
  ctx.closePath();
  ctx.fill();
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  const labels = [
    '',
    'Tokens processed one at a time - no parallelization',
    'Information decays exponentially with distance',
    'Fixed memory - old context pushed out by new',
    'The Transformer solution: Self-Attention',
  ];

  const labelText = labels[phase] || '';

  // Background pill
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const pillPadding = 12;
  const pillHeight = 22;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.beginPath();
  ctx.roundRect(
    x - textWidth / 2 - pillPadding,
    y - pillHeight / 2,
    textWidth + pillPadding * 2,
    pillHeight,
    11
  );
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Color based on phase
  const color =
    phase === 4
      ? 'rgba(60, 140, 80, 0.95)'
      : 'rgba(180, 60, 60, 0.9)';

  ctx.fillStyle = color;
  ctx.fillText(labelText, x, y);
}
