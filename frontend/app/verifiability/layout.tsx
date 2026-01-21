import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verifiability in AI Research',
  description:
    'The rate of AI progress in any domain is proportional to how quickly you can verify results. A deep dive into the dimensions of verifiability and how to make AI research more verifiable.',
  openGraph: {
    title: 'Verifiability in AI Research',
    description:
      'The rate of AI progress in any domain is proportional to how quickly you can verify results.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verifiability in AI Research',
    description:
      'The rate of AI progress in any domain is proportional to how quickly you can verify results.',
  },
};

export default function VerifiabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
