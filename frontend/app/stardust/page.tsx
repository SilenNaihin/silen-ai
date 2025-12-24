'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import { CodePanel } from '@/components/article/CodePanel';
import { AnimationSequence } from '@/components/animation/AnimationSequence';
import { ParticlesAnimation } from '@/components/stardust/ParticlesAnimation';
import { NetworkAnimation } from '@/components/stardust/NetworkAnimation';

export default function StardustArticle() {
  return (
    <ArticleLayout
      leftContent={(scrollProgress) => (
        <AnimationSequence
          scrollProgress={scrollProgress}
          animations={[
            {
              render: (progress) => (
                <ParticlesAnimation progress={progress} startOffset={0.15} />
              ),
              duration: 2, // Weighted 2x - takes up more scroll space
              overlap: 0.2, // 20% overlap with next animation
            },
            {
              render: (progress) => <NetworkAnimation progress={progress} />,
              duration: 1, // Default weight
            },
          ]}
        />
      )}
      className="bg-white"
    >
      {/* Article Title */}
      <h1 className="text-5xl font-bold mb-16 text-black">
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
            githubUrl="https://github.com/yourusername/your-repo"
          />
        }
      >
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            Our brain does it through something like energy minimization given
            billions of years of data by leveraging the laws of physics and
            chemistry.
          </p>

          <p>Humanity has done its best to reverse engineer this process.</p>

          <p>
            It started from understanding the fundamental building block of the
            brain, <span className="font-semibold">the neuron</span>, when Golgi
            figured out staining. Others built on this work and we discovered
            that our brain is an incredibly complex mess of{' '}
            <span className="font-semibold">100 billion neurons</span> and a{' '}
            <span className="font-semibold">quadrillion connections</span>{' '}
            between these neurons called synapses.
          </p>

          <p>
            And that the biggest part of our brain, the cerebrum, is broadly the
            same building block copied over and over again with the simple
            functions of inhibition or excitation through action potential.
          </p>

          <p className="italic text-neutral-600">Broadly.</p>

          <p>
            In truth, we barely understand it (but we do understand much more
            than my simplified description that I wrote for the intro).
          </p>

          <p>
            We do know it has a remarkably efficient ability to map the data
            distribution of reality.
          </p>

          <p className="text-xl font-semibold">So how do we make sand think?</p>

          <p className="text-2xl font-bold">
            We copy other stardust that can think.
          </p>
        </div>
      </ArticleSection>

      {/* Add spacing for scroll effect */}
      <div className="h-screen" />
    </ArticleLayout>
  );
}
