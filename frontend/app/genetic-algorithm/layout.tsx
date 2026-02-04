import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'I spent 2 weeks playing god. Here are my learnings after running 597 genetic algorithm trials with the help of Claude',
  description:
    'A 2-week journey building an evolution simulator with NEAT, PyTorch, and Claude Code. Bugs, breakthroughs, and counterintuitive findings.',
  openGraph: {
    title: 'I spent 2 weeks playing god. Here are my learnings after running 597 genetic algorithm trials with the help of Claude',
    description:
      'A 2-week journey building an evolution simulator with NEAT, PyTorch, and Claude Code.',
    type: 'article',
    images: [{
      url: '/articles/genetic-algorithm/cover.png',
      width: 1200,
      height: 618,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'I spent 2 weeks playing god. Here are my learnings after running 597 genetic algorithm trials with the help of Claude',
    description:
      'A 2-week journey building an evolution simulator with NEAT, PyTorch, and Claude Code.',
    images: ['/articles/genetic-algorithm/cover.png'],
  },
};

export default function GeneticAlgorithmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
