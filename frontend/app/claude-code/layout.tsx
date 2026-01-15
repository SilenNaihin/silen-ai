import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "I was a top 0.01% Cursor user. Here's why I switched to Claude Code 2.0.",
  description:
    "A comprehensive guide to Claude Code from someone who's been using coding AI since 2021. Learn the 5 pillars of agentic coding, custom commands, and advanced workflows.",
  openGraph: {
    title: "I was a top 0.01% Cursor user. Here's why I switched to Claude Code 2.0.",
    description:
      "A comprehensive guide to Claude Code from someone who's been using coding AI since 2021. Learn the 5 pillars of agentic coding, custom commands, and advanced workflows.",
    images: [
      {
        url: '/articles/claude-code/cover.png',
        width: 1200,
        height: 630,
        alt: 'Claude Code Guide Cover',
      },
    ],
    type: 'article',
    publishedTime: '2025-01-15',
    authors: ['Silen Naihin'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "I was a top 0.01% Cursor user. Here's why I switched to Claude Code 2.0.",
    description:
      "A comprehensive guide to Claude Code from someone who's been using coding AI since 2021.",
    images: ['/articles/claude-code/cover.png'],
  },
};

export default function ClaudeCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
