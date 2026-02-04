import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'I increased the IQ of blobs using genetic algorithms and Claude',
  description:
    'A 2-week journey building an evolution simulator with NEAT, PyTorch, and Claude Code. Bugs, breakthroughs, and counterintuitive findings.',
  openGraph: {
    title: 'I increased the IQ of blobs using genetic algorithms and Claude',
    description:
      'A 2-week journey building an evolution simulator with NEAT, PyTorch, and Claude Code.',
    type: 'article',
    // [TO ADD: cover image]
    // images: [{
    //   url: '/articles/genetic-algorithm/cover.png',
    //   width: 1200,
    //   height: 630,
    // }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'I increased the IQ of blobs using genetic algorithms and Claude',
    description:
      'A 2-week journey building an evolution simulator with NEAT, PyTorch, and Claude Code.',
    // [TO ADD: twitter image]
    // images: ['/articles/genetic-algorithm/cover.png'],
  },
};

export default function GeneticAlgorithmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
