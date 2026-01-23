'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface TestResult {
  id: string;
  name: string;
  suite: string;
  status: 'passed' | 'failed' | 'skipped' | 'flaky';
  duration: number;
  timestamp: Date;
  errorMessage?: string;
  stackTrace?: string;
}

interface Bug {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee: string;
  createdAt: Date;
  tags: string[];
}

interface PipelineStage {
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending' | 'skipped';
  duration?: number;
  logs?: string[];
}

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

// ============================================================================
// MOCK DATA
// ============================================================================

const generateMockTests = (): TestResult[] => {
  const suites = ['Auth Module', 'Payment Gateway', 'User API', 'Dashboard UI', 'Data Pipeline', 'Analytics Engine'];
  const statuses: TestResult['status'][] = ['passed', 'passed', 'passed', 'passed', 'failed', 'skipped', 'flaky'];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `test-${i + 1}`,
    name: `Test case ${i + 1}: ${['validates input', 'handles edge case', 'processes data', 'renders component', 'authenticates user', 'calculates metrics'][i % 6]}`,
    suite: suites[Math.floor(Math.random() * suites.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    duration: Math.floor(Math.random() * 5000) + 100,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
    errorMessage: Math.random() > 0.7 ? 'Assertion failed: expected true but got false' : undefined,
  }));
};

const generateMockBugs = (): Bug[] => {
  const titles = [
    'Memory leak in dashboard component',
    'API timeout on large payloads',
    'CSS overflow on mobile viewport',
    'Race condition in async handler',
    'Incorrect date parsing in EU locale',
    'Session expires prematurely',
    'Cache invalidation not working',
    'File upload fails over 10MB',
  ];
  const severities: Bug['severity'][] = ['critical', 'high', 'medium', 'low'];
  const statuses: Bug['status'][] = ['open', 'in-progress', 'resolved', 'closed'];
  const assignees = ['Alex Chen', 'Sarah Kim', 'Mike Johnson', 'Emma Wilson', 'Unassigned'];
  const tags = ['frontend', 'backend', 'api', 'performance', 'security', 'ux', 'database'];

  return titles.map((title, i) => ({
    id: `BUG-${1000 + i}`,
    title,
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    assignee: assignees[Math.floor(Math.random() * assignees.length)],
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 30),
    tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => tags[Math.floor(Math.random() * tags.length)]),
  }));
};

const mockPipeline: PipelineStage[] = [
  { name: 'Checkout', status: 'success', duration: 2340 },
  { name: 'Install Dependencies', status: 'success', duration: 45600 },
  { name: 'Lint & Format', status: 'success', duration: 12300 },
  { name: 'Unit Tests', status: 'success', duration: 89400 },
  { name: 'Integration Tests', status: 'running', duration: 34000 },
  { name: 'E2E Tests', status: 'pending' },
  { name: 'Build', status: 'pending' },
  { name: 'Deploy Preview', status: 'pending' },
];

const mockMetrics: MetricData[] = [
  { label: 'Test Coverage', value: 87.3, change: 2.1, trend: 'up' },
  { label: 'Pass Rate', value: 94.6, change: -0.8, trend: 'down' },
  { label: 'Avg Duration', value: 4.2, change: -0.5, trend: 'up' },
  { label: 'Flaky Rate', value: 2.1, change: -0.3, trend: 'up' },
];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

// Scanline overlay effect
const ScanLines = () => (
  <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden opacity-[0.03]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
      }}
    />
  </div>
);

// Animated grid background
const CyberGrid = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'center top',
      }}
    />
    <div
      className="absolute bottom-0 left-0 right-0 h-1/2"
      style={{
        background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, transparent 100%)',
      }}
    />
  </div>
);

// Glitch text effect
const GlitchText = ({ children, className = '' }: { children: string; className?: string }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={glitch ? 'opacity-0' : ''}>{children}</span>
      {glitch && (
        <>
          <span
            className="absolute left-0 top-0 text-cyan-400"
            style={{ clipPath: 'inset(0 0 50% 0)', transform: 'translate(-2px, -1px)' }}
          >
            {children}
          </span>
          <span
            className="absolute left-0 top-0 text-magenta-400"
            style={{ clipPath: 'inset(50% 0 0 0)', transform: 'translate(2px, 1px)' }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
};

// Neon glow box
const NeonBox = ({
  children,
  color = 'cyan',
  className = '',
  glow = true,
  hover = true,
}: {
  children: React.ReactNode;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'red' | 'purple';
  className?: string;
  glow?: boolean;
  hover?: boolean;
}) => {
  const colorMap = {
    cyan: { border: 'border-cyan-500', shadow: '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)', hoverShadow: '0 0 40px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.2)' },
    magenta: { border: 'border-fuchsia-500', shadow: '0 0 20px rgba(255, 0, 255, 0.3), inset 0 0 20px rgba(255, 0, 255, 0.1)', hoverShadow: '0 0 40px rgba(255, 0, 255, 0.5), inset 0 0 30px rgba(255, 0, 255, 0.2)' },
    yellow: { border: 'border-yellow-500', shadow: '0 0 20px rgba(255, 255, 0, 0.3), inset 0 0 20px rgba(255, 255, 0, 0.1)', hoverShadow: '0 0 40px rgba(255, 255, 0, 0.5), inset 0 0 30px rgba(255, 255, 0, 0.2)' },
    green: { border: 'border-emerald-500', shadow: '0 0 20px rgba(0, 255, 128, 0.3), inset 0 0 20px rgba(0, 255, 128, 0.1)', hoverShadow: '0 0 40px rgba(0, 255, 128, 0.5), inset 0 0 30px rgba(0, 255, 128, 0.2)' },
    red: { border: 'border-red-500', shadow: '0 0 20px rgba(255, 50, 50, 0.3), inset 0 0 20px rgba(255, 50, 50, 0.1)', hoverShadow: '0 0 40px rgba(255, 50, 50, 0.5), inset 0 0 30px rgba(255, 50, 50, 0.2)' },
    purple: { border: 'border-purple-500', shadow: '0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)', hoverShadow: '0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 30px rgba(168, 85, 247, 0.2)' },
  };

  const [isHovered, setIsHovered] = useState(false);
  const { border, shadow, hoverShadow } = colorMap[color];

  return (
    <motion.div
      className={`relative rounded-2xl border ${border} bg-black/80 backdrop-blur-sm ${className}`}
      style={{
        boxShadow: glow ? (hover && isHovered ? hoverShadow : shadow) : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={hover ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Corner accents */}
      <div className={`absolute -left-px -top-px h-4 w-4 rounded-tl-2xl border-l-2 border-t-2 ${border}`} />
      <div className={`absolute -right-px -top-px h-4 w-4 rounded-tr-2xl border-r-2 border-t-2 ${border}`} />
      <div className={`absolute -bottom-px -left-px h-4 w-4 rounded-bl-2xl border-b-2 border-l-2 ${border}`} />
      <div className={`absolute -bottom-px -right-px h-4 w-4 rounded-br-2xl border-b-2 border-r-2 ${border}`} />
      {children}
    </motion.div>
  );
};

// 3D skeuomorphic button
const CyberButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}) => {
  const variantStyles = {
    primary: 'from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-cyan-100 border-cyan-400',
    secondary: 'from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-gray-200 border-gray-500',
    danger: 'from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-red-100 border-red-400',
    success: 'from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-emerald-100 border-emerald-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg border
        bg-gradient-to-b ${variantStyles[variant]} ${sizeStyles[size]}
        font-mono font-bold uppercase tracking-wider
        transition-all duration-200
        ${active ? 'ring-2 ring-offset-2 ring-offset-black' : ''}
      `}
      style={{
        boxShadow: `
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -2px 0 rgba(0, 0, 0, 0.3),
          0 4px 8px rgba(0, 0, 0, 0.5),
          0 2px 4px rgba(0, 0, 0, 0.3)
        `,
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      }}
      whileHover={{ y: -2 }}
      whileTap={{
        y: 2,
        boxShadow: `
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 2px 4px rgba(0, 0, 0, 0.3),
          0 1px 2px rgba(0, 0, 0, 0.3)
        `,
      }}
    >
      {/* Highlight line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </motion.button>
  );
};

// 3D status indicator
const StatusIndicator = ({
  status,
  pulse = true,
  size = 'md',
}: {
  status: 'success' | 'error' | 'warning' | 'info' | 'running';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const statusColors = {
    success: { bg: 'bg-emerald-500', glow: 'rgba(0, 255, 128, 0.6)' },
    error: { bg: 'bg-red-500', glow: 'rgba(255, 50, 50, 0.6)' },
    warning: { bg: 'bg-yellow-500', glow: 'rgba(255, 255, 0, 0.6)' },
    info: { bg: 'bg-cyan-500', glow: 'rgba(0, 255, 255, 0.6)' },
    running: { bg: 'bg-blue-500', glow: 'rgba(50, 100, 255, 0.6)' },
  };

  const sizeMap = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const { bg, glow } = statusColors[status];

  return (
    <div className="relative">
      <motion.div
        className={`${sizeMap[size]} rounded-full ${bg}`}
        style={{
          boxShadow: `0 0 10px ${glow}, 0 0 20px ${glow}, inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)`,
        }}
        animate={pulse && status === 'running' ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {pulse && status === 'running' && (
        <motion.div
          className={`absolute inset-0 rounded-full ${bg}`}
          animate={{
            scale: [1, 2],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
};

// Progress bar with glow
const CyberProgress = ({
  value,
  max = 100,
  color = 'cyan',
  showValue = true,
  animated = true,
}: {
  value: number;
  max?: number;
  color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'red';
  showValue?: boolean;
  animated?: boolean;
}) => {
  const percentage = Math.min(100, (value / max) * 100);

  const colorMap = {
    cyan: { bar: 'from-cyan-400 to-cyan-600', glow: 'rgba(0, 255, 255, 0.5)' },
    magenta: { bar: 'from-fuchsia-400 to-fuchsia-600', glow: 'rgba(255, 0, 255, 0.5)' },
    green: { bar: 'from-emerald-400 to-emerald-600', glow: 'rgba(0, 255, 128, 0.5)' },
    yellow: { bar: 'from-yellow-400 to-yellow-600', glow: 'rgba(255, 255, 0, 0.5)' },
    red: { bar: 'from-red-400 to-red-600', glow: 'rgba(255, 50, 50, 0.5)' },
  };

  const { bar, glow } = colorMap[color];

  return (
    <div className="relative">
      <div
        className="h-3 overflow-hidden rounded-full border border-gray-700 bg-gray-900"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
        }}
      >
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
          style={{
            boxShadow: `0 0 10px ${glow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
          }}
        >
          {animated && (
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>
      </div>
      {showValue && (
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full pl-2 font-mono text-xs text-gray-400">
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

// 3D metric card
const MetricCard = ({ metric }: { metric: MetricData }) => {
  const trendColor = metric.trend === 'up' ? 'text-emerald-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400';
  const trendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';

  return (
    <NeonBox color="cyan" className="p-4">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-400/70">{metric.label}</div>
      <div className="mt-2 flex items-end gap-2">
        <span
          className="font-mono text-3xl font-bold text-white"
          style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
        >
          {metric.value}
          {metric.label.includes('Coverage') || metric.label.includes('Rate') ? '%' : 's'}
        </span>
        <span className={`mb-1 font-mono text-sm ${trendColor}`}>
          {trendIcon} {Math.abs(metric.change)}
        </span>
      </div>
      <div className="mt-3">
        <CyberProgress
          value={metric.value}
          color={metric.trend === 'down' && metric.label !== 'Avg Duration' ? 'red' : 'cyan'}
          showValue={false}
        />
      </div>
    </NeonBox>
  );
};

// ============================================================================
// DASHBOARD SECTIONS
// ============================================================================

// Header section
const DashboardHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mb-8 border-b border-cyan-500/30 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-4xl font-bold tracking-tighter">
            <GlitchText className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              QA COMMAND CENTER
            </GlitchText>
          </h1>
          <p className="mt-2 font-mono text-sm text-cyan-500/70">
            SYSTEM STATUS: <span className="text-emerald-400">OPERATIONAL</span> |
            BUILD: <span className="text-cyan-400">#2847</span> |
            ENV: <span className="text-yellow-400">STAGING</span>
          </p>
        </div>
        <div className="text-right">
          <div
            className="font-mono text-2xl text-cyan-400"
            style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.7)' }}
          >
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="font-mono text-xs text-gray-500">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pipeline visualization
const PipelineSection = ({ pipeline }: { pipeline: PipelineStage[] }) => {
  return (
    <NeonBox color="purple" className="p-6" hover={false}>
      <h2 className="mb-4 font-mono text-lg font-bold uppercase tracking-wider text-purple-400">
        CI/CD Pipeline
      </h2>
      <div className="relative">
        {/* Pipeline track */}
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-purple-500 via-purple-500/50 to-transparent" />

        <div className="space-y-4">
          {pipeline.map((stage, index) => {
            const statusMap = {
              running: { icon: '◈', color: 'text-blue-400', status: 'running' as const },
              success: { icon: '◆', color: 'text-emerald-400', status: 'success' as const },
              failed: { icon: '◆', color: 'text-red-400', status: 'error' as const },
              pending: { icon: '◇', color: 'text-gray-500', status: 'info' as const },
              skipped: { icon: '○', color: 'text-gray-600', status: 'warning' as const },
            };
            const { icon, color, status } = statusMap[stage.status];

            return (
              <motion.div
                key={stage.name}
                className="relative flex items-center gap-4 pl-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Node */}
                <div className="absolute left-2 flex items-center justify-center">
                  <StatusIndicator status={status} size="sm" pulse={stage.status === 'running'} />
                </div>

                <div className={`flex-1 font-mono text-sm ${color}`}>
                  {stage.name}
                </div>

                {stage.duration && (
                  <div className="font-mono text-xs text-gray-500">
                    {(stage.duration / 1000).toFixed(1)}s
                  </div>
                )}

                {stage.status === 'running' && (
                  <div className="w-24">
                    <CyberProgress value={65} color="cyan" showValue={false} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </NeonBox>
  );
};

// Test results table
const TestResultsSection = ({ tests }: { tests: TestResult[] }) => {
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed' | 'flaky'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'duration' | 'timestamp'>('timestamp');

  const filteredTests = tests
    .filter(t => filter === 'all' || t.status === filter)
    .sort((a, b) => {
      if (sortBy === 'duration') return b.duration - a.duration;
      if (sortBy === 'timestamp') return b.timestamp.getTime() - a.timestamp.getTime();
      return a.name.localeCompare(b.name);
    })
    .slice(0, 15);

  const statusStyles = {
    passed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    failed: 'bg-red-500/20 text-red-400 border-red-500/50',
    skipped: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    flaky: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  };

  return (
    <NeonBox color="cyan" className="p-6" hover={false}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-lg font-bold uppercase tracking-wider text-cyan-400">
          Test Results
        </h2>
        <div className="flex gap-2">
          {(['all', 'passed', 'failed', 'flaky'] as const).map((f) => (
            <CyberButton
              key={f}
              variant={filter === f ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter(f)}
              active={filter === f}
            >
              {f}
            </CyberButton>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/50">
              <th className="px-4 py-2 text-left font-mono text-xs uppercase text-gray-500">Status</th>
              <th className="px-4 py-2 text-left font-mono text-xs uppercase text-gray-500">Test Name</th>
              <th className="px-4 py-2 text-left font-mono text-xs uppercase text-gray-500">Suite</th>
              <th className="px-4 py-2 text-right font-mono text-xs uppercase text-gray-500">Duration</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredTests.map((test, index) => (
                <motion.tr
                  key={test.id}
                  className="border-b border-gray-800/50 hover:bg-cyan-500/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <td className="px-4 py-2">
                    <span className={`inline-block rounded-md border px-2 py-0.5 font-mono text-xs uppercase ${statusStyles[test.status]}`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="max-w-xs truncate px-4 py-2 font-mono text-sm text-gray-300">
                    {test.name}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-gray-500">{test.suite}</td>
                  <td className="px-4 py-2 text-right font-mono text-xs text-gray-400">
                    {(test.duration / 1000).toFixed(2)}s
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </NeonBox>
  );
};

// Bug tracker section
const BugTrackerSection = ({ bugs }: { bugs: Bug[] }) => {
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  const severityStyles = {
    critical: 'bg-red-500/30 text-red-300 border-red-500',
    high: 'bg-orange-500/30 text-orange-300 border-orange-500',
    medium: 'bg-yellow-500/30 text-yellow-300 border-yellow-500',
    low: 'bg-blue-500/30 text-blue-300 border-blue-500',
  };

  const statusStyles = {
    'open': 'text-red-400',
    'in-progress': 'text-yellow-400',
    'resolved': 'text-emerald-400',
    'closed': 'text-gray-500',
  };

  return (
    <NeonBox color="red" className="p-6" hover={false}>
      <h2 className="mb-4 font-mono text-lg font-bold uppercase tracking-wider text-red-400">
        Bug Tracker
      </h2>

      <div className="space-y-2">
        {bugs.slice(0, 6).map((bug, index) => (
          <motion.div
            key={bug.id}
            className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-900/50 p-3 transition-all hover:border-red-500/50 hover:bg-red-500/5"
            onClick={() => setSelectedBug(bug)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase ${severityStyles[bug.severity]}`}>
                    {bug.severity}
                  </span>
                  <span className="font-mono text-xs text-gray-500">{bug.id}</span>
                </div>
                <h3 className="mt-1 font-mono text-sm text-gray-200 group-hover:text-white">
                  {bug.title}
                </h3>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className={`font-mono ${statusStyles[bug.status]}`}>
                    ● {bug.status}
                  </span>
                  <span className="text-gray-500">@{bug.assignee}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <CyberButton variant="danger" size="sm">View All Bugs</CyberButton>
        <CyberButton variant="secondary" size="sm">+ New Bug</CyberButton>
      </div>
    </NeonBox>
  );
};

// Code coverage heatmap
const CoverageHeatmap = () => {
  const modules = [
    { name: 'auth', coverage: 92 },
    { name: 'api', coverage: 87 },
    { name: 'utils', coverage: 95 },
    { name: 'components', coverage: 78 },
    { name: 'hooks', coverage: 84 },
    { name: 'services', coverage: 71 },
    { name: 'store', coverage: 89 },
    { name: 'types', coverage: 100 },
    { name: 'config', coverage: 65 },
    { name: 'middleware', coverage: 82 },
    { name: 'routes', coverage: 76 },
    { name: 'db', coverage: 88 },
  ];

  const getColor = (coverage: number) => {
    if (coverage >= 90) return 'bg-emerald-500';
    if (coverage >= 80) return 'bg-emerald-600';
    if (coverage >= 70) return 'bg-yellow-500';
    if (coverage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <NeonBox color="green" className="p-6" hover={false}>
      <h2 className="mb-4 font-mono text-lg font-bold uppercase tracking-wider text-emerald-400">
        Coverage Heatmap
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {modules.map((module, index) => (
          <motion.div
            key={module.name}
            className="group relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <div
              className={`${getColor(module.coverage)} flex aspect-square flex-col items-center justify-center rounded-xl border border-gray-700 p-2 transition-all`}
              style={{
                opacity: 0.3 + (module.coverage / 100) * 0.7,
                boxShadow: `inset 0 0 20px rgba(0, 0, 0, 0.5)`,
              }}
            >
              <div className="font-mono text-lg font-bold text-white drop-shadow-lg">
                {module.coverage}%
              </div>
              <div className="font-mono text-[10px] uppercase text-white/70">
                {module.name}
              </div>
            </div>
            {/* Tooltip */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100">
              {module.name}: {module.coverage}% covered
            </div>
          </motion.div>
        ))}
      </div>
    </NeonBox>
  );
};

// Advanced Performance Analytics Graph
const PerformanceGraph = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'p50' | 'p95' | 'p99'>('all');

  // Generate realistic performance data
  const generateData = (range: string) => {
    const points = range === '1h' ? 60 : range === '6h' ? 72 : range === '24h' ? 48 : 168;
    const baseLatency = 120;

    return Array.from({ length: points }, (_, i) => {
      const hour = (i * (range === '1h' ? 1 : range === '6h' ? 5 : range === '24h' ? 30 : 60)) / 60;
      const dayFactor = Math.sin((hour / 24) * Math.PI * 2 - Math.PI / 2) * 0.3 + 1;
      const noise = () => (Math.random() - 0.5) * 40;
      const spike = Math.random() > 0.95 ? Math.random() * 200 : 0;

      const p50 = Math.max(50, baseLatency * dayFactor + noise() + spike * 0.3);
      const p95 = p50 * (1.8 + Math.random() * 0.4) + spike * 0.6;
      const p99 = p95 * (1.3 + Math.random() * 0.3) + spike;
      const requests = Math.floor(1000 * dayFactor + Math.random() * 500);
      const errors = Math.floor(requests * (0.001 + Math.random() * 0.005));

      const formatTime = () => {
        if (range === '1h') return `${String(Math.floor(i)).padStart(2, '0')}m`;
        if (range === '6h') return `${String(Math.floor(hour) % 24).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`;
        if (range === '24h') return `${String(Math.floor(hour) % 24).padStart(2, '0')}:00`;
        return `Day ${Math.floor(i / 24) + 1}`;
      };

      return {
        time: formatTime(),
        p50: Math.round(p50),
        p95: Math.round(p95),
        p99: Math.round(p99),
        requests,
        errors,
        errorRate: ((errors / requests) * 100).toFixed(2),
        timestamp: Date.now() - (points - i) * 60000,
      };
    });
  };

  const data = generateData(timeRange);

  // Calculate statistics
  const stats = {
    avgP50: Math.round(data.reduce((a, b) => a + b.p50, 0) / data.length),
    avgP95: Math.round(data.reduce((a, b) => a + b.p95, 0) / data.length),
    avgP99: Math.round(data.reduce((a, b) => a + b.p99, 0) / data.length),
    maxP99: Math.max(...data.map(d => d.p99)),
    minP50: Math.min(...data.map(d => d.p50)),
    totalRequests: data.reduce((a, b) => a + b.requests, 0),
    totalErrors: data.reduce((a, b) => a + b.errors, 0),
    avgErrorRate: (data.reduce((a, b) => a + parseFloat(b.errorRate), 0) / data.length).toFixed(3),
  };

  // Calculate graph dimensions
  const graphHeight = 200;
  const graphWidth = 100;
  const padding = { top: 10, right: 5, bottom: 5, left: 5 };

  const maxValue = Math.max(...data.map(d => d.p99)) * 1.1;
  const minValue = Math.min(...data.map(d => d.p50)) * 0.9;
  const valueRange = maxValue - minValue;

  const getY = (value: number) => {
    return padding.top + ((maxValue - value) / valueRange) * (graphHeight - padding.top - padding.bottom);
  };

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * (graphWidth - padding.left - padding.right);
  };

  // Create smooth curve paths using bezier curves
  const createSmoothPath = (values: number[]) => {
    if (values.length < 2) return '';

    const points = values.map((v, i) => ({ x: getX(i), y: getY(v) }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const tension = 0.3;

      const cp1x = prev.x + (curr.x - prev.x) * tension;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * tension;
      const cp2y = curr.y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  const p50Path = createSmoothPath(data.map(d => d.p50));
  const p95Path = createSmoothPath(data.map(d => d.p95));
  const p99Path = createSmoothPath(data.map(d => d.p99));

  // Create area path for p50
  const createAreaPath = (values: number[]) => {
    const linePath = createSmoothPath(values);
    const lastX = getX(values.length - 1);
    const firstX = getX(0);
    const bottomY = graphHeight - padding.bottom;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const metrics = [
    { key: 'p50', label: 'P50', color: '#22d3ee', glow: 'rgba(34, 211, 238, 0.6)' },
    { key: 'p95', label: 'P95', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },
    { key: 'p99', label: 'P99', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.6)' },
  ];

  const timeRanges = [
    { key: '1h', label: '1H' },
    { key: '6h', label: '6H' },
    { key: '24h', label: '24H' },
    { key: '7d', label: '7D' },
  ] as const;

  // Y-axis labels
  const yAxisLabels = [0, 0.25, 0.5, 0.75, 1].map(pct => ({
    value: Math.round(minValue + valueRange * (1 - pct)),
    y: padding.top + pct * (graphHeight - padding.top - padding.bottom),
  }));

  return (
    <NeonBox color="magenta" className="p-5" hover={false}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-fuchsia-400">
            Performance Analytics
          </h2>
          <p className="mt-0.5 font-mono text-[10px] text-gray-500">
            {stats.totalRequests.toLocaleString()} requests | {stats.avgErrorRate}% error rate
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex gap-1">
          {timeRanges.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={`rounded-md px-2 py-1 font-mono text-[10px] font-bold transition-all ${
                timeRange === key
                  ? 'bg-fuchsia-500/30 text-fuchsia-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-gray-800/50 text-gray-500 hover:bg-gray-700/50 hover:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric toggles */}
      <div className="mb-3 flex gap-3">
        {metrics.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(selectedMetric === key ? 'all' : key as typeof selectedMetric)}
            className={`flex items-center gap-1.5 font-mono text-[10px] transition-all ${
              selectedMetric === 'all' || selectedMetric === key ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
            />
            <span style={{ color }}>{label}</span>
          </button>
        ))}
        <div className="ml-auto font-mono text-[10px] text-gray-500">
          Max: <span className="text-red-400">{stats.maxP99}ms</span>
        </div>
      </div>

      {/* Main graph */}
      <div className="relative" style={{ height: graphHeight }}>
        {/* Y-axis labels */}
        <div className="absolute -left-1 top-0 flex h-full flex-col justify-between py-2">
          {yAxisLabels.map(({ value }, i) => (
            <span key={i} className="font-mono text-[8px] text-gray-600">
              {value}ms
            </span>
          ))}
        </div>

        {/* Graph SVG */}
        <svg
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          className="ml-8 h-full w-[calc(100%-2rem)]"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="p50Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
              <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
            </linearGradient>
            <linearGradient id="p95Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.2)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
            </linearGradient>
            <linearGradient id="p99Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(244, 63, 94, 0.15)" />
              <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yAxisLabels.map(({ y }, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={graphWidth - padding.right}
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.3"
            />
          ))}

          {/* Vertical grid lines */}
          {data.filter((_, i) => i % Math.ceil(data.length / 8) === 0).map((_, i) => {
            const x = getX(i * Math.ceil(data.length / 8));
            return (
              <line
                key={i}
                x1={x}
                y1={padding.top}
                x2={x}
                y2={graphHeight - padding.bottom}
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="0.3"
              />
            );
          })}

          {/* Area fills */}
          {(selectedMetric === 'all' || selectedMetric === 'p99') && (
            <motion.path
              d={createAreaPath(data.map(d => d.p99))}
              fill="url(#p99Gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          {(selectedMetric === 'all' || selectedMetric === 'p95') && (
            <motion.path
              d={createAreaPath(data.map(d => d.p95))}
              fill="url(#p95Gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          )}
          {(selectedMetric === 'all' || selectedMetric === 'p50') && (
            <motion.path
              d={createAreaPath(data.map(d => d.p50))}
              fill="url(#p50Gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          )}

          {/* Lines */}
          {(selectedMetric === 'all' || selectedMetric === 'p99') && (
            <motion.path
              d={p99Path}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 3px rgba(244, 63, 94, 0.8))' }}
            />
          )}
          {(selectedMetric === 'all' || selectedMetric === 'p95') && (
            <motion.path
              d={p95Path}
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
              style={{ filter: 'drop-shadow(0 0 3px rgba(168, 85, 247, 0.8))' }}
            />
          )}
          {(selectedMetric === 'all' || selectedMetric === 'p50') && (
            <motion.path
              d={p50Path}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
              style={{ filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.8))' }}
            />
          )}

          {/* Interactive hover areas */}
          {data.map((d, i) => (
            <rect
              key={i}
              x={getX(i) - graphWidth / data.length / 2}
              y={padding.top}
              width={graphWidth / data.length}
              height={graphHeight - padding.top - padding.bottom}
              fill="transparent"
              onMouseEnter={() => setHoveredPoint(i)}
            />
          ))}

          {/* Hover indicator line */}
          {hoveredPoint !== null && (
            <motion.line
              x1={getX(hoveredPoint)}
              y1={padding.top}
              x2={getX(hoveredPoint)}
              y2={graphHeight - padding.bottom}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Hover points */}
          {hoveredPoint !== null && (
            <>
              {(selectedMetric === 'all' || selectedMetric === 'p50') && (
                <circle
                  cx={getX(hoveredPoint)}
                  cy={getY(data[hoveredPoint].p50)}
                  r="3"
                  fill="#22d3ee"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 1))' }}
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'p95') && (
                <circle
                  cx={getX(hoveredPoint)}
                  cy={getY(data[hoveredPoint].p95)}
                  r="3"
                  fill="#a855f7"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 1))' }}
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'p99') && (
                <circle
                  cx={getX(hoveredPoint)}
                  cy={getY(data[hoveredPoint].p99)}
                  r="3"
                  fill="#f43f5e"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(244, 63, 94, 1))' }}
                />
              )}
            </>
          )}
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredPoint !== null && (
            <motion.div
              className="pointer-events-none absolute z-20 rounded-lg border border-gray-700 bg-gray-900/95 p-3 shadow-xl backdrop-blur-sm"
              style={{
                left: `calc(${(hoveredPoint / (data.length - 1)) * 100}% + 2rem)`,
                top: '20%',
                transform: hoveredPoint > data.length * 0.7 ? 'translateX(-110%)' : 'translateX(-50%)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="mb-2 font-mono text-[10px] text-gray-400">
                {data[hoveredPoint].time}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4 font-mono text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span className="text-gray-400">P50</span>
                  </span>
                  <span className="text-cyan-400">{data[hoveredPoint].p50}ms</span>
                </div>
                <div className="flex items-center justify-between gap-4 font-mono text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    <span className="text-gray-400">P95</span>
                  </span>
                  <span className="text-purple-400">{data[hoveredPoint].p95}ms</span>
                </div>
                <div className="flex items-center justify-between gap-4 font-mono text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    <span className="text-gray-400">P99</span>
                  </span>
                  <span className="text-red-400">{data[hoveredPoint].p99}ms</span>
                </div>
                <div className="mt-2 border-t border-gray-700 pt-2">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-gray-500">Requests</span>
                    <span className="text-gray-300">{data[hoveredPoint].requests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-gray-500">Errors</span>
                    <span className={parseFloat(data[hoveredPoint].errorRate) > 0.5 ? 'text-red-400' : 'text-emerald-400'}>
                      {data[hoveredPoint].errors} ({data[hoveredPoint].errorRate}%)
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* X-axis labels */}
      <div className="ml-8 mt-1 flex justify-between font-mono text-[8px] text-gray-600">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i) => (
          <span key={i}>{d.time}</span>
        ))}
      </div>

      {/* Stats footer */}
      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-gray-800 pt-3">
        <div className="rounded-lg bg-gray-900/50 p-2">
          <div className="font-mono text-[9px] uppercase text-gray-500">Avg P50</div>
          <div className="font-mono text-sm font-bold text-cyan-400" style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.5)' }}>
            {stats.avgP50}ms
          </div>
        </div>
        <div className="rounded-lg bg-gray-900/50 p-2">
          <div className="font-mono text-[9px] uppercase text-gray-500">Avg P95</div>
          <div className="font-mono text-sm font-bold text-purple-400" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>
            {stats.avgP95}ms
          </div>
        </div>
        <div className="rounded-lg bg-gray-900/50 p-2">
          <div className="font-mono text-[9px] uppercase text-gray-500">Avg P99</div>
          <div className="font-mono text-sm font-bold text-red-400" style={{ textShadow: '0 0 10px rgba(244, 63, 94, 0.5)' }}>
            {stats.avgP99}ms
          </div>
        </div>
        <div className="rounded-lg bg-gray-900/50 p-2">
          <div className="font-mono text-[9px] uppercase text-gray-500">Error Rate</div>
          <div className={`font-mono text-sm font-bold ${parseFloat(stats.avgErrorRate) > 0.5 ? 'text-red-400' : 'text-emerald-400'}`}
               style={{ textShadow: parseFloat(stats.avgErrorRate) > 0.5 ? '0 0 10px rgba(244, 63, 94, 0.5)' : '0 0 10px rgba(16, 185, 129, 0.5)' }}>
            {stats.avgErrorRate}%
          </div>
        </div>
      </div>
    </NeonBox>
  );
};

// Terminal/log viewer
const TerminalSection = () => {
  const [logs] = useState([
    { time: '14:32:01', level: 'INFO', message: 'Starting test suite: Auth Module' },
    { time: '14:32:02', level: 'INFO', message: 'Running 24 tests...' },
    { time: '14:32:15', level: 'PASS', message: '✓ validates user credentials' },
    { time: '14:32:16', level: 'PASS', message: '✓ handles invalid password' },
    { time: '14:32:17', level: 'FAIL', message: '✗ session timeout handling' },
    { time: '14:32:17', level: 'ERROR', message: '  Expected: 3600, Received: 7200' },
    { time: '14:32:18', level: 'WARN', message: '⚠ Flaky test detected: rate limiting' },
    { time: '14:32:22', level: 'INFO', message: 'Test suite completed: 22/24 passed' },
  ]);

  const levelColors = {
    INFO: 'text-cyan-400',
    PASS: 'text-emerald-400',
    FAIL: 'text-red-400',
    ERROR: 'text-red-300',
    WARN: 'text-yellow-400',
  };

  return (
    <NeonBox color="yellow" className="p-4" hover={false}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-yellow-400">
          Live Terminal
        </h2>
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" style={{ boxShadow: '0 0 8px rgba(255, 50, 50, 0.5)' }} />
          <div className="h-3 w-3 rounded-full bg-yellow-500" style={{ boxShadow: '0 0 8px rgba(255, 255, 0, 0.5)' }} />
          <div className="h-3 w-3 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 8px rgba(0, 255, 128, 0.5)' }} />
        </div>
      </div>
      <div
        className="h-48 overflow-auto rounded-xl border border-gray-800 bg-black p-3 font-mono text-xs"
        style={{
          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {logs.map((log, i) => (
          <motion.div
            key={i}
            className="flex gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-gray-600">{log.time}</span>
            <span className={levelColors[log.level as keyof typeof levelColors]}>[{log.level}]</span>
            <span className="text-gray-300">{log.message}</span>
          </motion.div>
        ))}
        <motion.span
          className="inline-block h-4 w-2 bg-yellow-400"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>
    </NeonBox>
  );
};

// 3D rotating cube component
const RotatingCube = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => ({
        x: r.x + 0.5,
        y: r.y + 1,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="perspective-500 relative h-20 w-20">
      <div
        className="preserve-3d relative h-full w-full"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Cube faces */}
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face, i) => {
          const transforms = {
            front: 'translateZ(40px)',
            back: 'translateZ(-40px) rotateY(180deg)',
            right: 'translateX(40px) rotateY(90deg)',
            left: 'translateX(-40px) rotateY(-90deg)',
            top: 'translateY(-40px) rotateX(90deg)',
            bottom: 'translateY(40px) rotateX(-90deg)',
          };
          return (
            <div
              key={face}
              className="absolute inset-0 flex items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-500/10 font-mono text-xs text-cyan-400"
              style={{
                transform: transforms[face as keyof typeof transforms],
                backfaceVisibility: 'visible',
                boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.2)',
              }}
            >
              QA
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Holographic stats display
const HolographicStats = () => {
  const stats = [
    { label: 'Tests Run Today', value: '1,247' },
    { label: 'Deployments', value: '12' },
    { label: 'Incidents', value: '0' },
    { label: 'Uptime', value: '99.97%' },
  ];

  return (
    <NeonBox color="cyan" className="p-6" hover={false}>
      <div className="flex items-center gap-6">
        <RotatingCube />
        <div className="grid flex-1 grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="font-mono text-xs uppercase text-cyan-500/70">{stat.label}</div>
              <div
                className="font-mono text-2xl font-bold text-white"
                style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
              >
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </NeonBox>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function QADashboard() {
  const [tests] = useState(() => generateMockTests());
  const [bugs] = useState(() => generateMockBugs());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background effects */}
      <CyberGrid />
      <ScanLines />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[100px]" />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader />

        {/* Metrics row */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {mockMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <MetricCard metric={metric} />
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column */}
          <div className="col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TestResultsSection tests={tests} />
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CoverageHeatmap />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <PerformanceGraph />
              </motion.div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HolographicStats />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PipelineSection pipeline={mockPipeline} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <BugTrackerSection bugs={bugs} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <TerminalSection />
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-8 border-t border-cyan-500/30 pt-4 text-center font-mono text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          QA COMMAND CENTER v2.0.47 | NEURAL LINK: ACTIVE | LAST SYNC: {new Date().toISOString()}
        </motion.div>
      </motion.div>
    </div>
  );
}
