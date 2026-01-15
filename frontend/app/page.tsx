import Link from 'next/link';
import type { Metadata } from 'next';
import articles from '@/data/articles.json';

export const metadata: Metadata = {
  title: "Silen's Blog",
  description: 'Interactive articles on AI, ML, and software engineering by Silen Naihin',
  openGraph: {
    title: "Silen's Blog",
    description: 'Interactive articles on AI, ML, and software engineering',
  },
};

type Article = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  status: 'published' | 'draft' | 'incomplete';
};

export default function Home() {
  const publishedArticles = (articles.articles as Article[]).filter(
    (a) => a.status === 'published'
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <nav className="flex flex-col">
          {publishedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/${article.slug}`}
              className="group flex items-center gap-4 py-3 px-3 -mx-3 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <span className="w-8 text-center font-mono text-sm text-neutral-400 group-hover:text-neutral-600 transition-colors">
                {article.icon}
              </span>
              <div className="flex-1 min-w-0">
                <span className="block font-medium text-neutral-900">
                  {article.title}
                </span>
                <span className="block text-sm text-neutral-500 truncate">
                  {article.description}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
