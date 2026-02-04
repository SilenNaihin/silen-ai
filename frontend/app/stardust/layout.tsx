import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How did we make stardust think?',
  description:
    'From carbon atoms forged in dying stars to neurons firing in your skull to silicon learning to see. The improbable chain that led to artificial intelligence. A first principles and historical journey through neural foundations, backpropagation, and recurrence.',
  openGraph: {
    title: 'How did we make stardust think?',
    description:
      'From carbon atoms forged in dying stars to neurons firing in your skull to silicon learning to see. The improbable chain that led to artificial intelligence.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How did we make stardust think?',
    description:
      'From carbon atoms forged in dying stars to neurons firing in your skull to silicon learning to see. The improbable chain that led to artificial intelligence.',
  },
};

export default function StardustLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
