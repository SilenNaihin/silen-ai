import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The pragmatic tradeoff of tied embeddings',
  description:
    'Exploring the tradeoff between parameter efficiency and expressivity in language models. Why tying input and output embeddings forces symmetric bigram statistics, and when untied embeddings are worth the extra parameters.',
  openGraph: {
    title: 'The pragmatic tradeoff of tied embeddings',
    description:
      'Why tying input and output embeddings forces symmetric bigram statistics, and when untied embeddings are worth the extra parameters.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The pragmatic tradeoff of tied embeddings',
    description:
      'Exploring parameter efficiency vs expressivity in language models through tied embeddings.',
  },
};

export default function TiedEmbeddingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
