'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import {
  TOCProvider,
  TOCHeading,
  TableOfContentsBlock,
} from '@/components/navigation/TableOfContents';
import { StickyHeader } from '@/components/navigation/StickyHeader';
import {
  Prose,
  InsightBox,
  QuoteBox,
  OrderedList,
  UnorderedList,
  MutedText,
  ComparisonTable,
  Figure,
  Code,
  CodeBlock,
  Aside,
} from '@/components/article/Callouts';

export default function ClaudeCodeArticle() {
  return (
    <TOCProvider>
      <StickyHeader title="Claude Code Guide" />

      <div className="pt-14">
        <ArticleLayout className="bg-white">
          {/* Article Title */}
          <h1 className="text-4xl font-bold mb-4 text-black leading-tight">
            I was a top 0.01% Cursor user.
            <br />
            Here&apos;s why I switched to Claude Code 2.0.
          </h1>
          <Prose>
            <p className="text-neutral-600">
              You have 6-7 articles bookmarked about Claude Code. You&apos;ve
              seen the wave. You want to be a part of it. Here&apos;s a
              comprehensive guide from someone who&apos;s been using coding AI
              since 2021 and read all those Claude Code guides so you don&apos;t
              have to.
            </p>
            <Figure
              src="/articles/claude-code/curve-cursor-claude.jpeg"
              alt="Cursor vs Claude Code"
              caption="You'll be on the right side after reading this"
              side
            />
            <p>This is a guide that combines:</p>
            <OrderedList>
              <li>my experience from 5 years of coding with AI</li>
              <li>my experience with Claude Code</li>
              <li>
                10+ articles and countless X posts I consolidated about Claude
                Code (references at the bottom)
              </li>
              <li>my setup</li>
              <li>advanced tips</li>
            </OrderedList>
            <p>After this article, the only limit to be your own ideas.</p>
          </Prose>
          <TableOfContentsBlock columns={3} />
          {/* Section 1: The Journey */}
          <TOCHeading
            id="the-journey"
            level={2}
            className="mt-0 text-2xl font-bold mb-3 text-black"
          >
            The journey
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                It&apos;s March of 2023. Github Copilot is our frontier of AI
                coding.
              </p>
              <p>
                ChatGPT is still a novelty. Model improvement isn&apos;t taken
                for granted.
              </p>
              <p>GPT-4 gets released.</p>
              <p>Instantly it&apos;s clear that this is paradigm shifting.</p>
              <p>
                We could create a loop of AI thinking with some tools to search
                the web and write code for us. The smell of AGI is in the air!
              </p>
              <p>
                We decide to call these loops &quot;agents&quot;. I was lucky
                enough to help build the first AI agent{' '}
                <a
                  href="https://github.com/Significant-Gravitas/AutoGPT"
                  className="mr-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AutoGPT
                </a>
                which went mega viral and is to this day the fastest growing
                repo to 100k stars.
              </p>
              <p>
                But it didn&apos;t really work. If you got lucky, every once in
                a while you could get an almost working tic tac toe game.
              </p>
              {/* <Figure
                side
                src="/articles/claude-code/bard-vs-chatgpt.png"
                alt="Bard vs ChatGPT"
                caption="Bard vs ChatGPT circa 2023"
              /> */}
              <p>For anything more complex? Forget about it.</p>
              {/* This sacrilege would
                have been equivalent to saying that Google wasn&apos;t on its
                way out. When it took them 8 months to release Bard this was
                obvious. Who even names those things? */}

              <p>
                Cursor came along in 2023 with promises. I tried and churned in
                October 2023 and again in May 2024. Good old copy and paste from
                ChatGPT was still better.
              </p>
              <p>Then in September 2024 Cursor Composer came out.</p>
              <p>From that moment, 90% of my code became AI generated.</p>
              <p>
                I lived in that editor. I pushed it to its limits, wrote an
                internal guide on best practices that I never published, and
                figured out every trick: surgical cursor placement, context
                window management,{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://x.com/silennai/status/1891236312113401913?s=20"
                >
                  Cursor rules
                </a>
                , the perfect prompting patterns for different scenarios.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://x.com/silennai/status/1923114661253411203?s=20"
                >
                  I had found the answer to all my problems.{' '}
                </a>
                I even got an email from the team that I was a top 0.01% Cursor
                user.{' '}
              </p>
              <Figure
                src="/articles/claude-code/top-cursor-users.png"
                alt="Cursor Top 0.01%"
                caption="Tweet link"
                href="https://x.com/silennai/status/1920221901202358760?s=20"
              />
              <p>I tried Claude Code earlier this year. Churned.</p>
              <p>
                The workflow felt like a step backward from what I had built
                with Cursor. The model wasn&apos;t quite there yet, I still
                needed to know what was going on in the code more often than
                not.
              </p>
              <p>
                <b>
                  Why would I ever use a tool that&apos;s barely as good and a
                  10x worst UX?
                </b>
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 2: What's Changed */}
          <TOCHeading id="whats-changed" level={2}>
            What&apos;s changed
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>Enter Claude Code 2.0. </p>
              <p>
                The UX had evolved. The harness is more flexible and robust.
                Bugs are fixed. But that&apos;s all secondary.
              </p>
              <p>
                The truth is that whatever RLHF Anthropic did on Opus 4.5
                completely changed the equation.{' '}
                <i>
                  {' '}
                  We&apos;ve now evolved to the next level of abstraction.{' '}
                </i>
              </p>
              <Figure
                src="/articles/claude-code/abstraction-2.jpeg"
                alt="Abstraction Progression"
              />
              <p>
                You no longer need to review the code. Or instruct the model at
                the level of files or functions. You can test behaviors instead.
              </p>
              <p>
                I built a genetic algorithm simulator with interactive
                visualizations showing evolution in real-time including complex
                fitness functions, selection pressure, mutation rates, and more{' '}
                <strong>
                  in 1 day. I didn&apos;t write a single line of the code.
                </strong>
              </p>
              <Figure
                src="/articles/claude-code/genetic-algorithm.gif"
                alt="Genetic Algorithm Simulator"
                caption="Github link"
                href="https://github.com/SilenNaihin/genetic-algorithm"
              />
              <p>
                <strong>
                  Here are the types of things people are building with Claude
                  Code:
                </strong>
              </p>
            </Prose>
            <UnorderedList>
              <li>
                <a
                  href="https://x.com/emollick/status/2011288654728348152"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  A plugin that visualizes Claude Code agents working in an
                  office
                </a>
                : subagents get hired, acquire skills, and turn in completed
                work.
              </li>
              <li>
                <a
                  href="https://x.com/DilumSanjaya/status/2010758474435875088"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  A Theo Jansen Strandbeest simulator
                </a>
                : complex linkage systems for robotics visualization.
              </li>
              <li>
                <a
                  href="https://x.com/geoffreylitt/status/2007999599513088489"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  An evolution simulator
                </a>
                : built casually in spare moments of a holiday break.
              </li>
              <li>
                <a
                  href="https://x.com/clayhaight/status/2005399980022898939"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  A $30 bird feeder camera with motion detection and bird
                  classification
                </a>
                : including ESP32 firmware and deployment on Fly.
              </li>
            </UnorderedList>
            <Prose>
              <p className="mt-2">
                <strong>
                  Other things I&apos;ve recently built with Claude:
                </strong>
              </p>
            </Prose>
            <UnorderedList>
              <li>
                <a
                  href="https://x.com/silennai/status/2011764666297717225?s=20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wright brothers flight simulator
                </a>
              </li>
              <li>
                <a
                  href="https://silennai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My personal website
                </a>
              </li>
              <li>
                <a
                  href="https://blog.silennai.com/stardust"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Interactive articles like this one
                </a>{' '}
                (in progress)
              </li>
              <li>Private research and learning projects</li>
            </UnorderedList>
            <Prose className="mt-2">
              <p>
                Everyone has a magic wand now. You just have to figure out how
                to use it.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 3: Claude Code vs Cursor */}
          <TOCHeading id="cc-vs-cursor" level={3}>
            Why I switched
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                A skeptic on Twitter{' '}
                <a
                  href="https://x.com/ohabryka/status/2007322150886367719"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  asks
                </a>
                :
              </p>
            </Prose>

            <QuoteBox>
              <p className="italic">
                &quot;Can someone explain to me why people use Claude Code
                instead of Cursor?&quot;
              </p>
              <p className="text-neutral-500 mt-2">— @ohabryka</p>
            </QuoteBox>

            <Prose>
              <p>
                Until a month ago, I shared the sentiment. Here&apos;s my
                answer:
              </p>
            </Prose>

            <InsightBox>
              <UnorderedList>
                <li>
                  <strong>Async first mindset:</strong> Being in the IDE lends
                  to instinctive code review and perfection. But we&apos;ve
                  ascended to the next level of abstraction. And the terminal
                  native workflow is a forcing function for taking that next
                  step.
                </li>
                <li>
                  <strong>RLHF&apos;d for its own scaffold:</strong> Claude
                  models (especially Opus 4.5+) perform noticeably better in
                  Claude Code. File searching, tool use, everything is tuned for
                  this interface.
                </li>
                <li>
                  <strong>Cost efficiency:</strong>{' '}
                  <a
                    href="https://x.com/fiddyresearch/status/2010708872323895303"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Claude Code costs seem to be more bang per token
                  </a>{' '}
                  compared to Cursor plans.
                </li>
                <li>
                  <strong>Customizability:</strong>{' '}
                  <a
                    href="https://x.com/skeptrune/status/2007441928779116663"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DIY is native and composability is built in.
                  </a>
                </li>
              </UnorderedList>
            </InsightBox>

            <TOCHeading id="when-cursor" level={3}>
              When to use Cursor
            </TOCHeading>
            <UnorderedList>
              <li>
                <strong>Pixel perfect frontend:</strong> Often I find myself in
                the loop still to get a pixel perfect UI.
              </li>
              <li>
                <strong>Learning:</strong> When iterating on something
                educational for yourself, the feedback loop is much quicker.
              </li>
              <li>
                <strong>Prevent context pollution:</strong> If it&apos;s a small
                change unrelated to any of my Claude Code terminals, it&apos;s
                easiest to do it in Cursor.
              </li>
            </UnorderedList>
            <Prose>
              <p>
                <strong>Recommendation:</strong> Use Cursor as your default if
                you&apos;re
              </p>
              <p className="pl-2">
                a) an organic coder who finds abstracting all code away to
                behavior scary, or
                <br />
                b) want to learn how to code.
              </p>
              <p>Use Claude Code if you</p>
              <p className="pl-2">
                a) never plan on learning and just care about outputs, or
                <br />
                b) are an abstraction maximilist.
              </p>
              <p>
                There is a VSCode extension for Claude Code which can ease your
                transition. But the UX still isn&apos;t near as good as Cursor.
                And it defeats the purpose.
              </p>
              <p>You should be abstraction maxxing.</p>
            </Prose>

            <TOCHeading id="my-setup" level={3}>
              My current setup
            </TOCHeading>
            <Prose>
              <p>
                <strong>Claude Code with Opus 4.5</strong> for most tasks.
                Planning, code generation, complex refactors, architectural
                decisions.
              </p>
              <p>
                <strong>Cursor with GPT 5.2 / Sonnet 4.5</strong> when I need
                tight feedback loops. Learning, UI perfection, small changes.
              </p>

              <p>
                <strong>ChatGPT</strong> for a few things: (a) programming
                related questions that don&apos;t need project context (like
                setting up an A100 VM in Azure), (b) second opinions on plans,
                and (c) when I don&apos;t understand an output or need
                clarification on something Claude said.
              </p>
              <p>
                <strong>
                  <a
                    href="https://ghostty.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ghostty
                  </a>
                </strong>{' '}
                as my terminal. Made by the cofounder of HashiCorp. Fast, no
                flickering, natively supports terminal splitting, better text
                editing experience, and native image support.
              </p>
              <p>
                <strong>Wispr</strong> for voice to text. If you work from home
                or have your own office, not having to type all the time is
                valuable. Begone Carpal tunnel. I need to be in a certain mood
                to use it.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 4: The Tradeoffs That Have Changed */}
          <TOCHeading id="pillars-of-agentic-coding" level={2}>
            The 5 pillars of agentic coding
          </TOCHeading>
          <ArticleSection>
            <Aside title="Capture the Alpha">
              Don&apos;t worry about taking in depth notes. To make your life
              easier, I&apos;ve encoded the entire alpha of this article in
              these two commands:{' '}
              <a
                href="https://gist.github.com/SilenNaihin/3f6b6ccdc1f24911cfdec78dbc334547"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code className="underline">/setup-claude-code</Code>
              </a>{' '}
              (global, run once per machine) and{' '}
              <a
                href="https://gist.github.com/SilenNaihin/e402188c89aab94de61df3da1c10d6ca"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code className="underline">/setup-repo</Code>
              </a>{' '}
              (per project). They interview you for what you need and set
              everything up. Just paste this into your Claude Code chat and run
              it:
              <CodeBlock>{`Download these commands to ~/.claude/commands/:

1. /setup-claude-code (run once per machine - installs all other commands):
https://gist.github.com/SilenNaihin/3f6b6ccdc1f24911cfdec78dbc334547

2. /setup-repo (run once per project):
https://gist.github.com/SilenNaihin/e402188c89aab94de61df3da1c10d6ca

Fetch each gist and save as [command-name].md in ~/.claude/commands/

Then run /setup-claude-code to install everything else.`}</CodeBlock>
            </Aside>
            <Prose>
              <p>It was written in the scriptures. Buckle up.</p>
            </Prose>
          </ArticleSection>
          <Figure
            src="/articles/claude-code/5-pillars.jpeg"
            alt="Agentic Tradeoffs"
          />
          <ArticleSection>
            <TOCHeading id="context-optimization" level={3}>
              Context
            </TOCHeading>
            <Prose>
              <p>
                Here&apos;s some tips I&apos;ve picked up over time on context
                management:
              </p>
              <ol className="list-decimal list-outside space-y-1 ml-6">
                <li>
                  <Code>
                    &quot;spawn a subagent to do deep research on this
                    topic&quot;
                  </Code>{' '}
                  Spawn subagents for parallel work. They do not pollute the
                  main agent&apos;s context. They can individually do work and
                  add just the valuable context from their work to the main
                  agent&apos;s context.{' '}
                </li>
                <li>
                  <Code>/compact</Code> - Others are iffy about compacting, but
                  often the tradeoff to stay in the same chat and eat the
                  compacting is worth it.{' '}
                  <a
                    href="https://x.com/talraviv/status/2010692991401300190"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Their system for compacting is smart.
                  </a>
                </li>
                <li>
                  <Code>/transfer-context</Code> That said, after compacting
                  enough times or doing any task not directly related, quality
                  will degrade. Don&apos;t be afraid to create new chats. If you
                  need to transfer context, just tell the model to give you a
                  prompt to put into another model with the related context for
                  the task with the files (for anything advanced create md
                  files, although I find managing these md files to be
                  annoying).{' '}
                  <a
                    href="https://gist.github.com/SilenNaihin/e4be0e8750343d9cbafdaab88366115c"
                    target="_blank"
                    className="ml-1"
                    rel="noopener noreferrer"
                  >
                    Here&apos;s a gist of my <Code>/transfer-context</Code>{' '}
                    command
                  </a>
                  .
                </li>
                <li>
                  <Code>/context</Code>
                  Shows you how much context you have left. You&apos;ll get a
                  report like this:{' '}
                  <Figure
                    src="/articles/claude-code/context.png"
                    alt="Context Report"
                    caption="This is in the bottom right of the terminal."
                  />{' '}
                  Claude will also tell you when you&apos;re running low on
                  context.{' '}
                  <Figure
                    src="/articles/claude-code/compacting.png"
                    alt="Context Report"
                    caption="This is in the bottom right of the terminal."
                  />{' '}
                  Make the decision to compact or to switch chats at this point.
                  Don&apos;t wait until it hits 0% as it will degrade your
                  outputs, and if it compacts in the middle of a task it will
                  forget potentially relevant context that you&apos;ve given it
                  even in the last chat.
                </li>
                <li>
                  Maintain focus: one chat = roughly one task. If a chat is
                  focused on a single task it will have more relevant context.
                  The definition of a &apos;task&apos; is miles broader than
                  what it used to be. Test the limits and see what works for
                  you.
                </li>
                <li>
                  Generating things in a chat that already has context will
                  always perform best, whether it&apos;s docs, tests, or related
                  code. Sometimes for one off changes (like a bug fix), I&apos;ll
                  do them within the chat context, commit changes, and then
                  rewind the conversation back to save context.
                </li>
              </ol>
              <p>
                Use <Code>/resume</Code> to continue from a previous chat.
              </p>
              <p>
                <strong>Note on context limits:</strong> Claude Code has a 200k
                context limit. You hit the wall faster than alternatives like
                Codex (400k) or Gemini (1M).
              </p>
            </Prose>

            <TOCHeading id="planning-leverage" level={3}>
              Planning
            </TOCHeading>
            <Prose>
              <p>
                Your time spent planning is directly proportional to agent
                output.
              </p>
              <p>
                Rule of thumb: a good prompt will save you 3 minutes of time on
                follow up prompts and debugging for every 1 minute you spend
                planning.
              </p>
              <p>
                <strong>Shift+Tab twice:</strong> Enter plan mode. I use it, but
                only for larger tasks or when the exact shape of what I want it
                to be is unclear. Note: plan mode saves to a <Code>.md</Code> in
                the global <Code>~/.claude</Code> folder, which isn&apos;t
                accessible within your repo. I&apos;ll either ask Claude to
                create a <Code>plan.md</Code> in the repo after plan mode, or
                skip plan mode entirely and plan in-chat.
              </p>
            </Prose>

            <TOCHeading id="planning-approaches" level={4}>
              Three Approaches
            </TOCHeading>
            <OrderedList>
              <li>
                <strong>Plan mode dialogue:</strong> Start a conversation, ask
                questions, let it explore code, create a plan together. When
                you&apos;re happy, say &quot;write plan to docs/*.md and start
                coding.&quot; or if in plan mode, &quot;yes, and bypass
                permissions.&quot;
              </li>
              <li>
                <strong>Sprint-style todo list:</strong> For larger projects,
                set up a progress.txt and structured task list (prd.json). More
                on this in the Advanced section.
              </li>
              <li>
                <strong>Generate revert plan:</strong> Run your prompt, see what
                it generates, then revert and keep planning for the final plan.
              </li>
            </OrderedList>
            <Figure
              src="/articles/claude-code/planning-nano.jpeg"
              alt="Planning principles"
            />
            <Prose>
              <p>
                After creating your plan, use our{' '}
                <a
                  href="https://gist.github.com/SilenNaihin/0733adf5e8deea4242878938c3bdc9fb"
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer"
                >
                  <Code>/interview-me-planmd</Code>
                </a>{' '}
                command which interviews you in depth about your plan before
                building. (See{' '}
                <a
                  href="https://x.com/trq212/status/2005315275026260309?s=20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  this X post
                </a>
                , I&apos;ve also tried it myself and found it genuinely
                effective.)
              </p>

              <InsightBox>
                Read @plan.md and interview me in detail using the
                AskUserQuestionTool about literally anything: technical
                implementation, UI & UX, concerns, tradeoffs, etc. Make sure the
                questions are not obvious. Be very in-depth and continue
                interviewing me continually until it&apos;s complete, then write
                the plan to the file.
              </InsightBox>

              <p>
                Opus 4.5 is amazing at explaining things and makes stellar ASCII
                diagrams. My exploration involves asking lots of questions,
                clarifying requirements, understanding where/how/why to make
                changes.
              </p>

              <p>
                <strong>Backwards compatibility:</strong> Models are currently,
                RLHF&apos;d so far into oblivion that you need to{' '}
                <strong>explicitly ask it to</strong> not maintain backwards
                compatibility.
              </p>
              <p>
                <strong>Watch out for overengineering:</strong> Claude models
                love to do too much. Extra files, flexibility you didn&apos;t
                ask for, unnecessary abstractions. Be as explicit with what NOT
                to do as possible. Pete puts it well:{' '}
                <em>
                  &quot;We want the simplest change possible. We don&apos;t care
                  about migration. Code readability matters most, and we&apos;re
                  happy to make bigger changes to achieve it.&quot;
                </em>
              </p>
              <p>
                <strong>Keep in mind:</strong> Coding agents are better at
                creating new files than editing existing ones. It can often be
                valuable to tweak the seed prompt and reset all the code from
                scratch.
              </p>
            </Prose>

            <TOCHeading id="closing-the-loop" level={3}>
              Closing the loop
            </TOCHeading>
            <Prose>
              <p>
                There&apos;s a classic XKCD about programmers spending a week
                automating a task that takes 5 minutes.
              </p>
            </Prose>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Figure
                src="https://imgs.xkcd.com/comics/automation.png"
                alt="XKCD: Automation - showing how automation projects consume more time than they save"
                caption="XKCD #1319: Automation"
                href="https://xkcd.com/1319/"
              />
              <div className="md:self-center">
                <Figure
                  src="https://imgs.xkcd.com/comics/the_general_problem.png"
                  alt="XKCD: The General Problem - engineer builds system to pass arbitrary condiments instead of just passing the salt"
                  caption="XKCD #974: The General Problem"
                  href="https://xkcd.com/974/"
                />
              </div>
            </div>
            <Prose>
              <p>
                With agentic coding, this equation has flipped.{' '}
                <strong>Closing the loop is now almost always worth it.</strong>{' '}
                The cost of automation has collapsed. What used to take a week
                now takes a conversation.
              </p>
              <p>
                If you find yourself doing something more than once, close the
                loop. If you spend a lot of time doing x thing, close the loop.
              </p>
              <ul className="list-disc list-outside space-y-1 ml-6">
                <li>Make commands for repeated prompts</li>
                <li>Make agents for repeated work</li>
                <li>Update your claude.md</li>
                <li>Make prompts in .mds (like Cursor rules!)</li>
                <li>Change tsconfig and other config files</li>
              </ul>
            </Prose>

            <TOCHeading id="verifiability-vs-trust" level={3}>
              Verifiability
            </TOCHeading>
            <Prose>
              <p>
                The only way you or the model know that you&apos;re right is if
                you can verify the outputs.
              </p>
              <p>
                Before, you had to be in the code. Then with Cursor, you had to
                approve every edit. Now, just test behaviors with interface
                tests.
              </p>
              <p>
                Interface tests are the ability to know what&apos;s wrong and
                explaining it.
              </p>
              <p>
                For UI this means looking, for UX this means clicking around,
                for API this means making requests. And checking the responses.
              </p>
              <p>
                A good way to think about closing the loop is to make it easy
                for you to verify by making it easy for the agent to verify.
              </p>
              <p>
                <strong>For large refactors:</strong> Ask Claude to build
                comprehensive interface tests beforehand. This ensures you got
                the refactor right. The tests become your verification layer.
              </p>
              <p>
                <strong>Writing tests:</strong> The best tests are written in
                the same context as the code they are testing.
              </p>
              <p>
                <strong>Let Jesus take the wheel.</strong> For production apps,
                test in staging or dev on a PR. Integration tests are your
                safety net. If they pass, ship it.
              </p>
            </Prose>

            <TOCHeading id="ai-code-vs-debugging" level={3}>
              Debugging
            </TOCHeading>
            <Prose>
              <p>
                AI writes code fast, but debugging AI code requires different
                skills than debugging your own. You didn&apos;t write it, so you
                don&apos;t have the mental model.
              </p>
            </Prose>

            <TOCHeading id="debugging-loop" level={4}>
              The debugging loop
            </TOCHeading>
            <Prose>
              <p>
                When something fails, use systematic debugging. I have a{' '}
                <a
                  href="https://gist.github.com/SilenNaihin/6833c01f597c82912af5aca4e3467a35"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code>/debug</Code> command
                </a>{' '}
                that triggers thorough investigation:
              </p>
            </Prose>
            <OrderedList>
              <li>Create hypotheses for what&apos;s wrong</li>
              <li>Read ALL related code (take your time)</li>
              <li>Add strategic logging to verify assumptions</li>
              <li>Tackle it differently in a new chat</li>
              <li>Try a different model</li>
              <li>Revert and try again</li>
              <li>Worst case: dive into the code yourself</li>
            </OrderedList>
            <Prose>
              <p>
                <strong>The rule of three:</strong> If you&apos;ve explained the
                same thing three times and Claude still isn&apos;t getting it,
                more explaining won&apos;t help. Change something.
              </p>
              <p>
                <strong>Show instead of tell:</strong> If Claude keeps
                misunderstanding, show it a minimal example of what you want the
                output to look like. Claude is good at following examples.
              </p>
              <p>
                <strong>Start fresh:</strong> If you&apos;re making lots of
                changes to your plan, start a new session. Get the agent to
                summarize the situation, what has been tried, and learnings.
                Copy paste into a new Claude session.
              </p>
            </Prose>

            <TOCHeading id="multi-model-debugging" level={4}>
              Council of models
            </TOCHeading>
            <Prose>
              <p>
                Different models have different blind spots. When stuck, get
                fresh perspectives:
              </p>
            </Prose>
            <UnorderedList>
              <li>
                <a
                  href="https://gist.github.com/SilenNaihin/3e9b43522b61e155bd256fe7193493cd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  <Code>/ensemble-opinion</Code>
                </a>
                : Get multi-model opinions on a problem. Runs Claude, Gemini,
                and Codex in parallel, then synthesizes their responses.{' '}
                <a
                  href="https://x.com/tenobrus/status/2010428123310129487"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Inspired by this
                </a>
                .
              </li>
              <li>
                <a
                  href="https://gist.github.com/SilenNaihin/ff19b2d65d17137b0ee1f609f25205c5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  <Code>/codex-delegate</Code>
                </a>
                : Delegate tasks to OpenAI Codex for autonomous execution.
              </li>
            </UnorderedList>
            <Prose>
              <p>
                You can automatically review your PRs and commits. Claude can
                catch issues, suggest improvements, and provide context aware
                feedback before human review even begins.
              </p>
              <p>
                You can do this via a Stop hook (more on these later) with
                Claude code in headless mode (<Code>-p</Code>) that triggers on
                every commit, or via prs. When I&apos;ve used automated
                reviewing it was always at the via PR level.
              </p>
              <p>
                If you have access, <strong>use Codex for PR review.</strong>{' '}
                You don&apos;t want the same inductive biases that wrote the
                code reviewing it. Codex catches things Claude misses and vice
                versa.
              </p>
            </Prose>

            <TOCHeading id="refactoring" level={4}>
              Refactoring and cleanup
            </TOCHeading>
            <p>Tools to use:</p>
            <UnorderedList>
              <li>
                <a
                  href="https://github.com/kucherenko/jscpd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>jscpd:</strong>
                </a>{' '}
                Code duplication detection
              </li>
              <li>
                <a
                  href="https://github.com/webpro/knip"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>knip:</strong>
                </a>{' '}
                Dead code removal
              </li>
              <li>
                <strong>code-simplifier plugin:</strong> Simplifies complex code
                at end of sessions.{' '}
                <a
                  href="https://x.com/bcherny/status/2009450715081789767"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Recommended by the founder of Claude Code.
                </a>
              </li>
            </UnorderedList>
            <Prose>
              <p>
                Run{' '}
                <a
                  href="https://gist.github.com/SilenNaihin/cd321a0ada16963867ad8984f44922cf"
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer"
                >
                  <Code>/refactor</Code>
                </a>{' '}
                to do a focused cleanup session with these tools.
              </p>
              <p>
                I refactor when I either feel pain because Claude is making
                mistakes, or after large additions to codebases. I&apos;m not
                the only one of the opinion that doing this continuously kills
                momentum. Treat it as a distinct phase.
              </p>
              <p>
                Claude won&apos;t understand your preferences around code
                cleanliness. Over time, add context to your Claude.md that
                reveals your preferences and reduces refactoring time.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 5: Tips for an Effective Claude Coder */}
          <TOCHeading id="cc-specifics" level={2}>
            Tips for an effective Claude Coder
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Always bias towards using the most powerful models. Use{' '}
                <Code>/model</Code> to switch to Opus 4.5. The cost difference
                is negligible compared to the quality difference.
              </p>
              <p>
                Use <Code>@</Code> to mention files directly in your prompt.
                Sometimes you need to type <Code>@/</Code> to get the full file
                list to appear.
              </p>
            </Prose>
            <TOCHeading id="keyboard-shortcuts" level={3}>
              Keyboard shortcuts I use the most
            </TOCHeading>
            <Prose>
              <p>
                <strong>Shift+Tab twice:</strong> Plan mode.
              </p>
              <p>
                <strong>Ctrl+R:</strong> Search through prompt history (similar
                to terminal backsearch).
              </p>
              <p>
                <strong>Esc+Esc:</strong> Access <Code>/rewind</Code>{' '}
                checkpointing. Reverts to a previous checkpoint when Claude
                messes something up. Can rewind both code and conversation.
              </p>
              <p>
                <strong>
                  <Code>!</Code>:
                </strong>{' '}
                You can type any bash command in the chat by prefixing your
                message with <Code>!</Code>.
              </p>
              <Figure src="/articles/claude-code/rewind.png" alt="Rewind" />
              <p>
                <strong>Useful Mac shortcuts:</strong>
              </p>
            </Prose>
            <UnorderedList>
              <li>
                <strong>Shift+Enter:</strong> Add newlines without sending the
                message.
              </li>
              <li>
                <strong>
                  Cmd+Option+C (
                  <a
                    href="https://www.raycast.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Raycast
                  </a>
                  ):
                </strong>{' '}
                Access full clipboard history. Essential for copying multiple
                things.
              </li>
              <li>
                <strong>Option+Arrow:</strong> Skip by words.{' '}
                <strong>Cmd+Arrow:</strong> Jump to start/end of line.
              </li>
            </UnorderedList>
            <TOCHeading id="ask-claude" level={3}>
              The &quot;just ask Claude&quot; mindset
            </TOCHeading>
            <Prose>
              <p>
                You can often ask Claude to do things you think you have to do
                manually. Changing default permissions, configuration, anything
                file-related.
              </p>
              <p>
                Get in the mindset:just ask Claude. It knows how to do things
                like creating custom commands (it will search the web and figure
                it out if it doesn&apos;t know).
              </p>
            </Prose>
            <TOCHeading id="blast-radius" level={3}>
              Using 12 parallel terminals at once
            </TOCHeading>
            <Prose>
              <p>
                I often don&apos;t even have an IDE open for a repo anymore. I
                have 12 terminals open at once, actively working from on 1-8 at
                any given time. Typically 2 per project: one for context
                management or Ralph, one for active multithreading.
              </p>
              <Figure
                src="/articles/claude-code/terminals-4.png"
                alt="Parallel terminals"
              />
              <p>
                Making real progress in 4 projects at once requires the projects
                to be more execution than thinking. And I have to be locked in
                off a Celsius and a pack of Zyns (metaphorically, I don&apos;t
                consume either. Just hard drugs like life).
              </p>
              <p>
                The natural instinct is to use git worktrees to isolate parallel
                work.
              </p>
              <p>
                But hammering the same branch is the best approach when running
                multiple instances. For speed and simplicity. In practice if you
                do this right you&apos;ll rarely need to use worktrees.{' '}
                <a
                  href="https://x.com/mitsuhiko/status/2011773404207337549"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Armin agrees.
                </a>{' '}
                <a
                  href="https://x.com/steipete/status/2011880333348913355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  So does Pete.
                </a>
              </p>
              <p>
                Think in terms of the{' '}
                <strong>&quot;blast radius&quot;</strong> of one of your
                terminals. Evaluate the scope of your changes prior to sending
                your prompt. If it overlaps with another instance, you should be
                getting Claude to do it in that instance. You&apos;ll find that
                it&apos;s truly rare that this mindset doesn&apos;t work.
              </p>
              <p>
                Worst case if there are errors or you miscalculated, you can
                always revert or fix it. The cost of the rare times this happens
                is worth it.
              </p>
              <p>
                Our{' '}
                <a
                  href="https://gist.github.com/SilenNaihin/d4b3870178667475b08e1f48d6cdbc30"
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer"
                >
                  <Code>/commit-smart</Code>
                </a>{' '}
                command helps to make contextual commits. It only commits files
                that the Claude Code instance touched which allows me to revert
                a specific change without losing unrelated work.
              </p>
              <p>
                For solo projects I just push to <Code>main</Code> directly.
                When working with others
              </p>
              <OrderedList>
                <li>
                  if it&apos;s one person I&apos;ll have a branch called{' '}
                  <Code>silen</Code> which I periodically create a PR for and
                  merge in, or
                </li>
                <li>
                  if it&apos;s multiple collaborators I&apos;ll create branches
                  and check out the Claude instances on that branch, and
                </li>
                <li>
                  if it&apos;s a more established repo I&apos;ll create a second
                  worktree, and have two terminals associated with two different
                  branches.
                </li>
              </OrderedList>
              <p>
                Another tip is when I have one session doing something like a
                refactor but I already have your next prompt typed out for a
                feature add, you can do <Code>!sleep 600</Code> in that second
                instance and then send in your prompt.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 8: Your CLAUDE.md */}
          <TOCHeading id="claude-md" level={3}>
            Your CLAUDE.md
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                The default <Code>/init</Code> command analyzes your project and
                generates a starter configuration. Our{' '}
                <a
                  href="https://gist.github.com/SilenNaihin/e402188c89aab94de61df3da1c10d6ca"
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer"
                >
                  <Code>/setup-repo</Code>
                </a>{' '}
                command goes further to configure your repo in the first place.
                It includes best practices (also referencing the{' '}
                <Code>/init</Code> command) for agentic repos, and interviews
                you for what you need.
              </p>
              <p>
                Generally, what you include should be driven by pain. Outside of
                the basic template that <Code>/setup-repo</Code> gives you:
              </p>
            </Prose>
            <UnorderedList>
              <li>
                <strong>Project summary + directory structure:</strong> Gives
                Claude immediate orientation.
              </li>
              <li>
                <strong>Main dependencies and patterns:</strong> If you use
                domain-driven design, microservices, specific frameworks,
                document it.
              </li>
              <li>
                <strong>Non-standard organizational choices:</strong> Anything
                that would confuse someone (or Claude) new to the codebase.
              </li>
              <li>
                <strong>Tooling and repo layout info:</strong> Minimize the
                amount the agent needs to search.
              </li>
              <li>
                <strong>Comments only where needed</strong> (minimize{' '}
                <a
                  href="https://fs.blog/chestertons-fence/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chesterton&apos;s fence
                </a>{' '}
                errors): Add comments on code that&apos;s referenced elsewhere
                or would be hard to understand without context. You don&apos;t
                need human-readable documentation everywhere, you can generate
                that later if needed.
              </li>
              <li>
                <strong>Monorepos need extra guidance:</strong> Claude is worse
                at monorepos. Be explicit about which package you&apos;re
                working in, use full paths from repo root, and document
                package-specific scripts.
              </li>
            </UnorderedList>
            <p>
              Use{' '}
              <a
                href="https://gist.github.com/SilenNaihin/916e4f2cbcd96f487b2845edaed469a3"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                <Code>/update-claudemd</Code>
              </a>{' '}
              in the same chat as you discover a gotcha, add a new pattern, or
              change the project structure. It aims to update conservatively,
              only the signal.
            </p>
          </ArticleSection>
          {/* Section 6: Domain Playbooks */}
          <TOCHeading id="domain-playbooks" level={2}>
            Domain playbooks
          </TOCHeading>
          {/* Frontend */}
          <TOCHeading id="frontend" level={3}>
            Frontend
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Great prompting and guidelines help most. UI is hard to explain
                and difficult to verify.
              </p>
              <p>
                I found giving access to take screenshots of the UI was slow and
                imperfect but it&apos;s possible this won&apos;t be the case a
                month down the line.
              </p>
              <p>
                The interactions with the books and podcasts sections on{' '}
                <a
                  href="https://silennai.com/content"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  my website
                </a>{' '}
                took forever. Human judgment, screenshots, explaining, and
                organic coding.
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Keep leaf components presentational:</strong> Business
                logic lives in parent components. Separating concerns makes it
                easy to audit props and spot irregularities. It also helps the
                agent find patterns to follow.
              </li>
            </UnorderedList>
            <UnorderedList>
              <li>
                <strong>For the last mile, jump into your IDE:</strong> AI
                struggles with pixel perfect work. You&apos;ll likely need some
                organic coding to make it perfect.
              </li>
              <li>
                <strong>Responsiveness gets forgotten:</strong> Models are bad
                at remembering responsiveness matters. Tell it to keep it in
                mind from the start, and expect to do some organic coding to
                make it perfect.
              </li>
              <li>
                <strong>frontend-design plugin:</strong> From the Claude Code
                plugin store. Helps with design decisions and component
                structure. Just ask Claude to install it.
              </li>
            </UnorderedList>

            <TOCHeading id="screenshots" level={4}>
              Screenshots
            </TOCHeading>
            <Prose>
              <p>Drag screenshots into chat.</p>
              <p>
                <a
                  href="https://steipete.me"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pete
                </a>{' '}
                mentions that at least 50% of his prompts contain screenshots. I
                use them sparingly. They can be powerful for UI fixes but are
                slow and imperfect for iterative frontend work.
              </p>
              <p>
                I like to generate UIs or visual components in Nano Banana Pro
                and paste the screenshot to get Claude to generate it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Figure
                  src="/articles/claude-code/wright-nano.jpeg"
                  alt="Nano Banana Pro generation"
                  caption="Nano Banana Pro generation"
                  href="https://github.com/SilenNaihin/wright-simulator"
                />
                <div className="md:self-center">
                  <Figure
                    src="/articles/claude-code/wright-bros.gif"
                    alt="My Wright Brothers UI"
                    caption="My UI with the screenshot and a few prompts"
                    href="https://x.com/silennai/status/2011764666297717225?s=20"
                  />
                </div>
              </div>
            </Prose>

            <TOCHeading id="frontend-gotchas" level={4}>
              Gotchas
            </TOCHeading>
            <UnorderedList>
              <li>
                <strong>Silencing linters:</strong> There&apos;s been times
                agents biased towards shutting the linter up with{' '}
                <Code>eslint-disable</Code> instead of fixing issues. If you
                notice this happening, use{' '}
                <Code>eslint-comments/no-restricted-disable</Code>.
              </li>
              <li>
                <strong>Make styling reference docs:</strong> Create styling
                components and component reference markdown files. Reference
                them always. Set up <Code>tailwind.config</Code> with main
                colors, spacing tokens, etc.
              </li>
              <li>
                <strong>
                  Install Vercel&apos;s React best practices skill:
                </strong>{' '}
                <a
                  href="https://vercel.com/blog/introducing-react-best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vercel released a skill
                </a>{' '}
                that encodes React patterns and conventions. Worth installing
                for any React/Next.js project.
              </li>
            </UnorderedList>
          </ArticleSection>
          {/* Backend */}
          <TOCHeading id="backend" level={3}>
            Backend
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>Verifiability is straightforward here. Some advice:</p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Use an ORM for schema-as-context:</strong> The entire DB
                schema in a file that AI understands. There&apos; other ways to
                do this but I&apos;ve loved using Prisma with coding agents.
              </li>
              <li>
                <strong>Realistic seed data:</strong> Invest in tooling to keep
                your local DB populated with realistic data. This lets agents
                self verify in a realistic way.
              </li>
              <li>
                <strong>Generate API docs and Postman workspaces:</strong> When
                working with APIs, ask Claude to generate documentation and a
                Postman collection so you can easily test endpoints yourself.
              </li>
            </UnorderedList>
          </ArticleSection>
          {/* Research */}
          <TOCHeading id="research" level={3}>
            AI research
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                I&apos;m just starting to experiment with this. I&apos;ve given
                Claude access to a VM with an A100 to see what experiments it
                performs.
              </p>
              <p>
                Karpathy{' '}
                <a
                  href="https://x.com/karpathy/status/2005421816110862601"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  shared his experience
                </a>
                :
              </p>
            </Prose>

            <QuoteBox>
              <p>
                Claude has been running my nanochat experiments since morning.
                It writes implementations, debugs them with toy examples, writes
                tests and makes them fail/pass, launches training runs, babysits
                them by tailing logs and pulling stats from wandb, keeps a
                running markdown file of highlights, keeps a running record of
                runs and results so far, presents results in nice tables, we
                just finished some profiling, noticed inefficiencies in the
                optimizer resolved them and measured improvements.
              </p>
              <p className="mt-3">
                It&apos;s not perfect but I&apos;m used to doing all of these
                things manually, so just seeing it running on the side cranking
                away at larger scope problems and coordinating all these flows
                in relatively coherent ways is definitely a new experience and a
                complete change of workflow.
              </p>
              <p className="text-neutral-500 mt-2">— Andrej Karpathy</p>
            </QuoteBox>

            <Prose>
              <p>
                So far it seems to me that models are able to grok pretty much
                anything and are great partners to think through things. Paste
                in a document about your hypothesis, and they can help you
                execute on it.
              </p>
              <p>
                Have fun. But remember, extraordinary claims require
                extraordinary evidence. Avoid getting one shotted into psychosis
                land.
              </p>
            </Prose>
          </ArticleSection>
          {/* Learning */}
          <TOCHeading id="learning" level={3}>
            Learning
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Claude Code is great for generating IPYNBs and using a{' '}
                <a
                  href="https://silen.notion.site/My-prompt-for-learning-new-computational-concepts-2d72b9e381378056beced8f7ff14878f"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  large prompt for learning concepts
                </a>
                . But when you&apos;re sitting there trying to grok things and
                want to stay in the loop, Cursor&apos;s Cmd+K and chat is best
                (along with ChatGPT).
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Questioning your assumptions:</strong> Ask it to
                challenge your understanding.
              </li>
              <li>
                <strong>Fill-in-the-blank code:</strong> Instead of generating
                everything, have it create scaffolding with gaps for you to
                fill.
              </li>
            </UnorderedList>
          </ArticleSection>
          <TOCHeading id="scaling-up" level={2}>
            Advanced Claude Code usage
          </TOCHeading>
          {/* Section 9: Scaling Up */}

          <ArticleSection>
            <Prose>
              <Figure
                src="/articles/claude-code/deprecated.png"
                alt="ultrathink deprecated"
              />
            </Prose>
            <Prose>
              <p>
                On Mac, run <Code>caffeinate -dimsu</Code> to prevent your
                laptop from sleeping while Claude works. Start a task, close
                your laptop, go places.
              </p>
            </Prose>
            <TOCHeading id="ralph" level={3}>
              Ralph for larger projects
            </TOCHeading>
            <Prose>
              <p>
                Unfortunately, for almost everything{' '}
                <a
                  href="https://x.com/ryancarson/status/2008548371712135632"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ralph
                </a>{' '}
                is more pain to get to work than it&apos;s worth. Sorry to
                disappoint.
              </p>
              <p>
                However, I often use it for when I&apos;m creating a greenfield
                project where a lot needs to get done. It requires a{' '}
                <Code>progress.txt</Code> and <Code>prd.json</Code>. Good for
                larger projects or changes that get speedrun with multiple
                coordinated Claude Code agents.
              </p>
              <p>
                The{' '}
                <a
                  href="https://gist.github.com/SilenNaihin/e370eb10c468916b98e4df57cf042c9a"
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer"
                >
                  <Code>/setup-ralph</Code> command
                </a>{' '}
                sets up all the Ralph files for you.
              </p>

              <p>
                Ralph exits early when it detects keywords like
                &quot;done&quot;, &quot;complete&quot;, or &quot;finished&quot;
                in your progress files. Use status terms like{' '}
                <Code>PASSED</Code>/<Code>PENDING</Code> instead to avoid
                premature exits.{' '}
              </p>
              <p>
                Also, Claude can confuse itself into thinking it&apos;s advising{' '}
                <em>about</em> Ralph rather than <em>being</em> the agent. Make
                your PROMPT.md direct: &quot;You are the agent. Do the
                work.&quot;
              </p>
              <p>
                The key to Ralph: keep an accompanying chat open to guide it and
                check on progress. Ralph runs in the background; you steer from
                the side. When starting Ralph, I tell my monitoring chat:
                &quot;Sleep for 30 seconds, then check if Ralph is executing
                correctly. Repeat 3 times.&quot; This catches early issues
                before you walk away.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Figure
                  src="/articles/claude-code/ralph-img.jpeg"
                  alt="Ralph 1"
                  caption="The Ralph repo"
                  href="https://github.com/frankbria/ralph-claude-code"
                />
                <div className="md:self-center">
                  <Figure
                    src="/articles/claude-code/ralph.png"
                    alt="Ralph 2"
                    caption="Running Ralph for one of my projects"
                  />
                </div>
              </div>
            </Prose>

            <TOCHeading id="phone-coding" level={3}>
              Code on your phone
            </TOCHeading>
            <Prose>
              <p>
                Use{' '}
                <a
                  href="https://vibetunnel.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vibetunnel.sh
                </a>{' '}
                with Tailscale to code from your phone and you can run Claude
                Code on your phone from anywhere.
              </p>
              <Figure
                src="/articles/claude-code/vibetunnel.png"
                alt="Phone coding"
                caption="The VibeTunnel desktop connection"
                href="https://github.com/amantus-ai/vibetunnel"
              />
            </Prose>

            <TOCHeading id="hooks" level={3}>
              Hooks, Subagents, Skills, and MCP
            </TOCHeading>
            <Prose>
              <p>
                <strong>
                  <a
                    href="https://code.claude.com/docs/en/sub-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Custom Subagents
                  </a>
                </strong>{' '}
                are spawned instances that don&apos;t pollute your main context
                but can report back directly to it. I have a custom agents for
                different types of deep research, and a{' '}
                <Code>claude-critic</Code> agent for opinions. A friend uses a{' '}
                <Code>/f</Code> command in a subagent to find relevant files and
                context without cluttering the main agent.
              </p>
              <p>
                Use cases: large refactoring (subagent for each logical group of
                files), code review pipelines (style-checker, security-scanner,
                test-coverage in parallel), research tasks (explore subagent for
                unfamiliar codebases).
              </p>
              <p>
                <strong>
                  <a
                    href="https://code.claude.com/docs/en/hooks-guide#hook-events-overview"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hooks
                  </a>
                </strong>{' '}
                execute on specific events (tool call, stop, etc.). I&apos;ve
                experimented but nothing has stuck. One use case: running
                Prettier on <Code>.ts</Code> files after Claude finishes. A good
                mental model for when to use hooks: a) specific things you do at
                a certain point (like after chat) often, and b) it can be done
                through a bash command.
              </p>
              <p>
                I&apos;ve heard about running a &quot;Do more&quot; prompt when
                Claude finishes via the Stop hook to keep it working for hours.
              </p>
              <p>
                <strong>
                  <a
                    href="https://code.claude.com/docs/en/skills"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Skills
                  </a>
                </strong>{' '}
                are folders where the LLM decides when or what to load. Files
                with scripts, prompts, etc. They&apos; a superset of commands,
                coming with their own executable code and many potential prompt
                files. Use cases: code review standards, commit message
                conventions, database query patterns, API documentation formats.{' '}
                <a
                  href="https://vercel.com/blog/introducing-react-best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vercel&apos;s React best practices skill
                </a>{' '}
                is worth installing for React/Next.js projects.
              </p>
              <p>
                <strong>
                  <a
                    href="https://code.claude.com/docs/en/mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MCP (Model Context Protocol)
                  </a>
                </strong>{' '}
                lets Claude talk to external services directly. Connect to
                GitHub, Slack, databases, issue trackers. Use cases: implement
                features from JIRA issues, query PostgreSQL directly, integrate
                Figma designs, draft Gmail responses, summarize Slack threads.
                Run <Code>/mcp</Code> to see your connections.
              </p>
              <Figure
                src="/articles/claude-code/advanced-concepts.jpeg"
                alt="Advanced Concepts"
              />
              <p>
                <a
                  href="https://x.com/eyad_khrais/status/2010810802023141688"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Here&apos;s a guide that goes more in depth on these
                </a>
                . I think you should get started without reading it. If you feel
                something is missing or you try to close the loop some other way
                and it doesn&apos;t work, come back and read it.
              </p>
            </Prose>

            <TOCHeading id="headless-mode" level={3}>
              Headless Mode
            </TOCHeading>
            <Prose>
              <p>
                The <Code>-p</Code> flag runs Claude Code in headless mode. It
                runs your prompt and outputs the result without entering the
                interactive interface. This means you can script it, pipe output
                to other tools, chain it with bash commands, integrate into
                automated workflows.
              </p>
              <p>
                People use this for automatic PR reviews, automatic support
                ticket responses, documentation updates. All logged and
                auditable.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 10: The Baseline */}
          <TOCHeading id="baseline" level={2}>
            The bottom line
          </TOCHeading>
          <InsightBox>
            To make your life easier, I&apos;ve encoded the entire alpha of this
            article in these two commands:{' '}
            <a
              href="https://gist.github.com/SilenNaihin/3f6b6ccdc1f24911cfdec78dbc334547"
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              <Code>/setup-claude-code</Code>
            </a>{' '}
            (global, run once per machine) and{' '}
            <a
              href="https://gist.github.com/SilenNaihin/e402188c89aab94de61df3da1c10d6ca"
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              <Code>/setup-repo</Code>
            </a>{' '}
            (per project). They interview you for what you need and set
            everything up. Just paste this into your Claude Code chat and run
            it:
            <CodeBlock>{`Download these commands to ~/.claude/commands/:

1. /setup-claude-code (run once per machine - installs all other commands):
https://gist.github.com/SilenNaihin/3f6b6ccdc1f24911cfdec78dbc334547

2. /setup-repo (run once per project):
https://gist.github.com/SilenNaihin/e402188c89aab94de61df3da1c10d6ca

Fetch each gist and save as [command-name].md in ~/.claude/commands/

Then run /setup-claude-code to install everything else.`}</CodeBlock>
          </InsightBox>
          <ArticleSection>
            <Prose className="-mt-2 mb-1">
              <p>
                This will all change. Quickly. Here&apos;s what I believe will
                persist:
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Planning leverage will only increase.</strong> As models
                get better, a well-structured prompt/repo pays off even more.
              </li>
              <li>
                <strong>
                  The ability to quickly verify work will remain important.
                </strong>{' '}
              </li>
              <li>
                <strong>Close the loop.</strong> If you do something more than
                once, abstract it. Commands, docs, components. This principle
                predates AI.
              </li>
              <li>
                <strong>Don&apos;t be lazy.</strong> Figure out what needs to be
                done logically. You don&apos;t actually have to code, but do the
                hard thinking. A lot of times you&apos;ll realize what
                you&apos;re trying to do is either simpler or harder than you
                think.
              </li>
              <li>
                <strong>There&apos;s no &quot;right answer.&quot;</strong> The
                only way to create your best system is to create it yourself by
                being in the loop. Best is biased by taste and experience.
                Experiment, iterate, and discover what works for you.
              </li>
            </UnorderedList>
          </ArticleSection>
          {/* Section 11: Links */}
          <TOCHeading id="links" level={2}>
            Links and Credits
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                The people whose work informed this guide, and resources worth
                exploring:
              </p>
            </Prose>

            <TOCHeading id="people" level={3}>
              People
            </TOCHeading>
            <UnorderedList>
              <li>
                <a
                  href="https://steipete.me"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  steipete
                </a>{' '}
                — Prolific writer on AI coding workflows
              </li>
              <li>
                <a
                  href="https://www.vibekanban.com/vibe-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vibekanban
                </a>{' '}
                — Comprehensive vibe coding guide
              </li>
              <li>
                <a
                  href="https://sankalp.bearblog.dev/my-experience-with-claude-code-20-and-how-to-get-better-at-using-coding-agents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  sankalp
                </a>{' '}
                — Experience reports on Claude Code
              </li>
              <li>
                <a
                  href="https://addyo.substack.com/p/my-llm-coding-workflow-going-into"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  addyo
                </a>{' '}
                — LLM coding workflow breakdown
              </li>
            </UnorderedList>

            <TOCHeading id="key-posts" level={3}>
              Key Posts
            </TOCHeading>
            <UnorderedList>
              <li>
                <a
                  href="https://steipete.me/posts/just-talk-to-it"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Just Talk To It
                </a>{' '}
                — steipete&apos;s core workflow
              </li>
              <li>
                <a
                  href="https://steipete.me/posts/2025/optimal-ai-development-workflow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Optimal AI Development Workflow
                </a>
              </li>
              <li>
                <a
                  href="https://steipete.me/posts/2025/shipping-at-inference-speed"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shipping at Inference Speed
                </a>
              </li>
              <li>
                <a
                  href="https://claude.com/blog/using-claude-md-files"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Using CLAUDE.md Files
                </a>{' '}
                — Official guidance
              </li>
              <li>
                <a
                  href="https://code.claude.com/docs/en/vs-code"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claude Code VS Code Integration
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/bcherny/status/2007179832300581177"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tips from Claude Code founder
                </a>{' '}
                — Also great for understanding team collaboration patterns
              </li>
              <li>
                <a
                  href="https://www.anthropic.com/engineering/claude-code-best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claude Code Best Practices
                </a>{' '}
                — Official Anthropic engineering guide
              </li>
              <li>
                <a
                  href="https://x.com/manthanguptaa/status/2000067845808648266"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How Claude&apos;s Memory System Works
                </a>{' '}
                — Deep dive into Claude&apos;s memory vs ChatGPT&apos;s approach
              </li>
              <li>
                <a
                  href="https://x.com/arjunpatel_ai/status/2008794995080458719"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Anthropic Context Engineering
                </a>{' '}
                — Thread on context management
              </li>
              <li>
                <a
                  href="https://x.com/rohanpaul_ai/status/2009277278048637145"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claude Code Skills Guide
                </a>{' '}
                — Deep dive into skills system
              </li>
              <li>
                <a
                  href="https://x.com/dabit3/status/2009139688959852701"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claude Code Agents
                </a>{' '}
                — Guide on using agents effectively
              </li>
              <li>
                <a
                  href="https://justin.abrah.ms/blog/2026-01-05-wrapping-my-head-around-gas-town.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wrapping My Head Around Gas Town
                </a>{' '}
                — Understanding the gas/token economy
              </li>
              <li>
                <a
                  href="https://huggingface.co/blog/hf-skills-training"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HuggingFace Skills Training
                </a>{' '}
                — Training custom skills
              </li>
            </UnorderedList>

            <TOCHeading id="tools" level={3}>
              Tools Mentioned
            </TOCHeading>
            <UnorderedList>
              <li>
                <a
                  href="https://vibetunnel.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VibeTunnel
                </a>{' '}
                — Terminal multiplexer for mobile coding
              </li>
              <li>
                <a
                  href="https://knip.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  knip
                </a>{' '}
                — Dead code finder
              </li>
              <li>
                <a
                  href="https://github.com/kucherenko/jscpd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  jscpd
                </a>{' '}
                — Code duplication detection
              </li>
              <li>
                <a
                  href="https://github.com/steipete/agent-scripts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  agent-scripts
                </a>{' '}
                — steipete&apos;s AGENTS.MD and scripts
              </li>
              <li>
                <a
                  href="https://x.com/ryancarson/status/2008548371712135632"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ralph
                </a>{' '}
                — For larger sprint-style development
              </li>
              <li>
                <a
                  href="https://wispr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wispr
                </a>{' '}
                — Voice-to-text for coding
              </li>
            </UnorderedList>
          </ArticleSection>
          {/* Section 12: Command Summary */}
          <TOCHeading id="command-summary" level={2}>
            Command Summary
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>All commands I recommend, organized by type and frequency.</p>
            </Prose>
            <ComparisonTable
              headers={['Command', 'Type', 'Usage']}
              rows={[
                ['/ultrathink', 'Default', 'Every chat'],
                ['/compact', 'Default', 'Every chat'],
                ['/context', 'Default', 'Every chat'],
                ['/rewind', 'Default', 'Situational'],
                ['/resume', 'Default', 'Situational'],
                ['/agents', 'Default', 'Situational'],
                ['/clear', 'Default', 'Situational'],
              ]}
            />
            <Prose>
              <p className="mt-4">
                <strong>Custom commands</strong> (gists linked):
              </p>
            </Prose>
            <ComparisonTable
              headers={['Command', 'Usage', 'Link']}
              rows={[
                [
                  '/setup-claude-code',
                  'Once per machine',
                  '<a href="https://gist.github.com/SilenNaihin/3f6b6ccdc1f24911cfdec78dbc334547">gist</a>',
                ],
                [
                  '/setup-repo',
                  'Once per project',
                  '<a href="https://gist.github.com/SilenNaihin/e402188c89aab94de61df3da1c10d6ca">gist</a>',
                ],
                [
                  '/setup-ralph',
                  'When using Ralph',
                  '<a href="https://gist.github.com/SilenNaihin/e370eb10c468916b98e4df57cf042c9a">gist</a>',
                ],
                [
                  '/commit-smart',
                  'Every commit',
                  '<a href="https://gist.github.com/SilenNaihin/d4b3870178667475b08e1f48d6cdbc30">gist</a>',
                ],
                [
                  '/interview-me-planmd',
                  'Planning',
                  '<a href="https://gist.github.com/SilenNaihin/0733adf5e8deea4242878938c3bdc9fb">gist</a>',
                ],
                [
                  '/update-claudemd',
                  'End of session',
                  '<a href="https://gist.github.com/SilenNaihin/916e4f2cbcd96f487b2845edaed469a3">gist</a>',
                ],
                [
                  '/transfer-context',
                  'When context degrades',
                  '<a href="https://gist.github.com/SilenNaihin/e4be0e8750343d9cbafdaab88366115c">gist</a>',
                ],
                [
                  '/debug',
                  'When stuck',
                  '<a href="https://gist.github.com/SilenNaihin/6833c01f597c82912af5aca4e3467a35">gist</a>',
                ],
                [
                  '/refactor',
                  'After large additions',
                  '<a href="https://gist.github.com/SilenNaihin/cd321a0ada16963867ad8984f44922cf">gist</a>',
                ],
                [
                  '/ensemble-opinion',
                  'Rarely (multi-model)',
                  '<a href="https://gist.github.com/SilenNaihin/3e9b43522b61e155bd256fe7193493cd">gist</a>',
                ],
                [
                  '/codex-delegate',
                  'Rarely (requires Codex CLI)',
                  '<a href="https://gist.github.com/SilenNaihin/ff19b2d65d17137b0ee1f609f25205c5">gist</a>',
                ],
                [
                  '/gemini-delegate',
                  'Rarely (requires Gemini CLI)',
                  '<a href="https://gist.github.com/SilenNaihin/0c27ee7816da489c4ce110bf115f5ab6">gist</a>',
                ],
              ]}
            />
          </ArticleSection>
          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <MutedText>
              This guide captures a moment in time. The tools will change, the
              models will improve, but the principles of planning,
              verifiability, and closing the loop will persist. Take what works,
              leave what doesn&apos;t, and develop your own workflow through
              experimentation.
            </MutedText>
          </div>
          {/* Spacing */}
          <div className="h-32" />
        </ArticleLayout>
      </div>
    </TOCProvider>
  );
}
