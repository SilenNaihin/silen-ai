'use client';

import { ArticleLayout } from '@/components/ArticleLayout';
import { ArticleSection } from '@/components/ArticleSection';
import { CodePanel, CodeActionButton } from '@/components/CodePanel';
import { StardustAnimation } from '@root/projects/stardust/components/StardustAnimation';

export default function StardustArticle() {
  const handleCopy = () => {
    navigator.clipboard.writeText('2 + 2');
  };

  const handleViewGitHub = () => {
    // Link to GitHub repo
    window.open('https://github.com/yourusername/your-repo', '_blank');
  };

  return (
    <ArticleLayout
      leftContent={(scrollProgress) => (
        <StardustAnimation scrollProgress={scrollProgress} />
      )}
      className="bg-black text-neutral-100"
    >
      {/* Article Title */}
      <h1 className="text-5xl font-bold mb-16 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        How Do We Make Stardust Think?
      </h1>

      {/* Section 1: Introduction */}
      <ArticleSection
        rightContent={
          <CodePanel
            code={`# Simple computation
2 + 2`}
            language="python"
            output="4"
            actions={
              <>
                <CodeActionButton onClick={handleCopy}>Copy</CodeActionButton>
                <CodeActionButton onClick={handleViewGitHub}>
                  GitHub
                </CodeActionButton>
              </>
            }
          />
        }
      >
        <div className="text-lg leading-relaxed space-y-6">
          <p>
            Our brain does it through something like energy minimization given
            billions of years of data by leveraging the laws of physics and
            chemistry.
          </p>

          <p>Humanity has done its best to reverse engineer this process.</p>

          <p>
            It started from understanding the fundamental building block of the
            brain,
            <span className="text-yellow-400 font-semibold"> the neuron</span>,
            when Golgi figured out staining. Others built on this work and we
            discovered that our brain is an incredibly complex mess of
            <span className="text-purple-400 font-semibold">
              {' '}
              100 billion neurons
            </span>{' '}
            and a
            <span className="text-purple-400 font-semibold">
              {' '}
              quadrillion connections
            </span>{' '}
            between these neurons called synapses.
          </p>

          <p>
            And that the biggest part of our brain, the cerebrum, is broadly the
            same building block copied over and over again with the simple
            functions of
            <span className="text-blue-400"> inhibition</span> or
            <span className="text-red-400"> excitation</span> through action
            potential.
          </p>

          <p className="italic text-neutral-400">Broadly.</p>

          <p>
            In truth, we barely understand it (but we do understand much more
            than my simplified description that I wrote for the intro).
          </p>

          <p>
            We do know it has a remarkably efficient ability to map the data
            distribution of reality.
          </p>

          <p className="text-xl font-semibold text-purple-300">
            So how do we make sand think?
          </p>

          <p className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            We copy other stardust that can think.
          </p>
        </div>
      </ArticleSection>

      {/* Add spacing for scroll effect */}
      <div className="h-screen" />
    </ArticleLayout>
  );
}
