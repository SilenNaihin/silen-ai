import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '5 Research Tastes for the Last Days of the Anthropocene',
  description:
    'The 5 bottlenecks that matter most for AI recursive improvement: verifiability, OOD generation, interpretability, architectures, and continual learning. Falsifiable experiments and projects for each.',
  openGraph: {
    title: '5 Research Tastes for the Last Days of the Anthropocene',
    description:
      'The 5 bottlenecks that matter most for AI recursive improvement before AGI.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Research Tastes for the Last Days of the Anthropocene',
    description:
      'The 5 bottlenecks that matter most for AI recursive improvement before AGI.',
  },
};

export default function ResearchTastesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
