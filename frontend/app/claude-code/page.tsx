'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import {
  TOCProvider,
  TOCHeading,
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
          <p className="text-lg text-neutral-600 mb-8">
            Claude Code is all the rage right now. You probably have 5 articles
            bookmarked about it already. Here&apos;s a comprehensive guide from
            someone who&apos;s been banging his head against AI coding agents
            since AutoGPT (and read every piece of high signal advice from the
            community).
          </p>
          {/* Section 1: The Journey */}
          <TOCHeading
            id="the-journey"
            level={2}
            className="mt-0 text-2xl font-bold mb-3 text-black"
          >
            The Journey
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                In March of 2023, GPT-4 was released. This is when model
                improvement wasn&apos;t taken for granted, and ChatGPT was still
                a novelty.
              </p>
              <p>
                I was helping build{' '}
                <a
                  href="https://github.com/Significant-Gravitas/AutoGPT"
                  className="mr-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AutoGPT
                </a>
                which felt like a magical new paradigm. The sparks of what could
                be. Bit it was just sparks. If you got lucky, every one in 10
                loops you could get a working tic tac toe game with an only
                somewhat broken UI.
              </p>
              [ autoGPT image here ]
              <p>
                Taking yourself out of the loop? Forget about it. You might as
                well have been saying that Google wasn&apos;t going to fall
                victim to the Innovator&apos;s Dilemma. We all know Google was
                dead in the water when it took them 8 months to release Bard in
                response.
              </p>
              [ bard image here ]
              <p>
                Then Cursor came along. I want to say it was instantly magical,
                but it wasn&apos;t. I churned from it in October 2023 and
                churned again in May 2024. It wasn&apos;t as good as good old
                copy and paste from ChatGPT. I had to know exactly what I was
                adding to my codebase, and I needed to keep the mental map of
                the codebase in my head. The level of abstraction at this point
                was low, telling the AI exactly what functions to write and how
                they connected.
              </p>
              <p>Then in September 2024 Composer came out.</p>
              <p>From that moment, 90% of my code became AI generated.</p>
              <p>
                I lived in that editor. I pushed it to its limits, wrote an
                internal guide on best practices that I never published, and
                figured out every trick: surgical cursor placement, context
                window management, the perfect prompting patterns for different
                scenarios.
              </p>
              <p>
                At my peak, I was in the top 0.01% of Cursor users. I genuinely
                thought I had found the answer. [ top 0.01 tweet here ]
              </p>
              <p>I tried Claude Code when it first came out. Churned.</p>
              <p>
                The workflow felt like a step backward from what I had built
                with Cursor. The model wasn&apos;t quite there yet, I still
                needed to know what was going on in the code more often than
                not.
              </p>
              <p>
                <b>
                  Why would I ever use a tool that&apos;s equal in functionality
                  but 20x worse UX?
                </b>
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 2: What's Changed */}
          <TOCHeading id="whats-changed" level={2}>
            What&apos;s Changed
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Enter Claude Code 2.0. Their Claude vscode integration and
                terminal UX had evolved. Their harness was is flexible and
                robust. Bugs are fixed. But that&apos;s all secondary.
              </p>
              <p>
                The truth is that whatever RLHF Anthropic did on Opus 4.5
                completely changed the equation.{' '}
                <i>
                  {' '}
                  We&apos;ve now evolved to the next level of abstraction.{' '}
                </i>
                [abstraction image here]
              </p>
              <p>
                I recently built{' '}
                <a
                  href="https://github.com/SilenNaihin/alab-pipeline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  alab-pipeline
                </a>
                , a project that required ingesting messy data, understanding
                it, building a pipeline, to analyze, enrich, and map it to
                parquet files, and then upload it to the MPContribs API. With a
                Plotly dashboard for scientific visualization.
              </p>
              [image of dashboard here]
              <p>Here&apos;s how things have changed over time:</p>
              <ul className="list-disc list-outside space-y-1 ml-6">
                <li>
                  Pre AI, this would have taken me a month of full time work.
                </li>
                <li>
                  ChatGPT era this would have taken me a week of full time work.
                </li>
                <li>
                  In the Cursor era this would take me a few days of full time
                  work.
                </li>
                <li>With Claude Code, it took a weekend.</li>
              </ul>
              [the shortening of timelines image]
              <p>
                The following is my experience with Claude Code 2.0, my setup
                (which still includes Cursor, sorry for the clickbait), advanced
                tips, and how I use it.
              </p>
              <p>
                {' '}
                I&apos;ve also read every high signal piece of advice from the
                community and compiled it here. steipete&apos;s posts,
                vibekanban, sankalp&apos;s experience reports, addyo&apos;s
                workflows. All of them. I&apos;ve compiled the signal from all
                of them, mixed it with my own hard won experience from three
                years in the trenches, and this is the result. [show 3 years of
                github commits graph here]
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 3: Claude Code vs Cursor */}
          <TOCHeading id="cc-vs-cursor" level={2}>
            Claude Code vs Cursor
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
                I thought the same the last few weeks. Here&apos;s my tentative
                answer:
              </p>
            </Prose>

            <InsightBox title="Why Claude Code">
              <UnorderedList>
                <li>
                  <strong>Async first mindset:</strong> Using Claude Code
                  requires a fundamentally different way of thinking if you got
                  used to coding in the organic world of the ancients. Cursor
                  felt like a more natural jump since I was still in the IDE.
                  <p className="mt-1">
                    You can run multiple Cursor agents at once as well, as I
                    did, but being in the IDE means I often reviewed code and
                    made sure things were still working as expected. The
                    terminal native workflow is a forcing function for taking a
                    step to a higher level of abstraction.
                  </p>
                </li>
                <li>
                  <strong>RLHF&apos;d for its own scaffold:</strong> Claude
                  models (especially Opus 4.5+) perform noticeably better in
                  their native environment. File searching, tool use, everything
                  is tuned for this interface. GPT models are tuned for Codex.
                </li>
                <li>
                  <strong>Cost efficiency:</strong> Claude Code costs seem to be
                  more bang per token compared to Cursor plans.
                </li>
                <li>
                  <strong>Customizability:</strong> It also encourages more DIY.
                  The agent feels native to its environment. MCP servers never
                  stuck with me, things change too fast.
                </li>
              </UnorderedList>
            </InsightBox>

            <TOCHeading id="when-cursor" level={3}>
              When to Use Cursor
            </TOCHeading>
            <Prose>
              <p className="mb-2">Cursor still wins in specific scenarios:</p>
            </Prose>
            <UnorderedList>
              <li>
                <strong>Tight feedback loops:</strong> When you need to see
                changes immediately and iterate fast.
              </li>
              <li>
                <strong>Pixel perfect frontend:</strong> Often I find myself in
                the loop still to get a pixel perfect UI.
              </li>
              <li>
                <strong>Learning:</strong> When iterating on something
                educational for yourself, the feedback loop is much quicker.
              </li>
              <li>
                <strong>Recommendation:</strong> I&apos;d recommend starting
                with Cursor if you know how to code or want to learn how to
                code. Use CC if you never plan on learning and just care about
                outputs. The $20 subscription is enough to get started for both.
              </li>
            </UnorderedList>

            <TOCHeading id="vscode-integration" level={5}>
              VSCode Integration
            </TOCHeading>
            <Prose>
              <p>
                For Cursor users transitioning: Claude Code has a VSCode
                extension that gives you an inline UI similar to what
                you&apos;re used to. This can ease the transition if you prefer
                a GUI.
              </p>{' '}
              <p>
                But that defeats the purpose somewhat. The UX just isn&apos;t as
                good as Cursor&apos;s here, and that&apos;s not their focus.
                Give it a real shot in your terminal after reading this.{' '}
              </p>
            </Prose>

            <TOCHeading id="my-setup" level={3}>
              My Current Setup
            </TOCHeading>
            <Prose>
              <p>
                <strong>Claude Code with Opus 4.5</strong> for most tasks.
                Planning, code generation, complex refactors, architectural
                decisions.
              </p>
              <p>
                <strong>Cursor with GPT 5.2</strong> when I need tight feedback
                loops. Learning, UI perfection, small changes. The tab
                completion model is world-class.
              </p>

              <p>
                <strong>ChatGPT</strong> for a few things: (a) programming
                related questions that don&apos;t need project context (like
                setting up an A100 VM in Azure), (b) second opinions on plans,
                and (c) when I don&apos;t understand an output or need
                clarification on something Claude said.
              </p>
              <p>
                <strong>Wispr</strong> for voice to text. If you work from home
                or have your own office, not having to type all the time is
                valuable. Especially if you&apos;re a coder who has dealt with
                carpal tunnel or feels like your hands get tired. Speaking
                prompts is faster than typing for longer inputs, and allows you
                to explain complex ideas more naturally.
              </p>
            </Prose>

            <InsightBox>
              For new coders: I&apos;m not sure how valuable learning how to
              code is anymore. Being good at interface testing (aka being able
              to tell what&apos;s wrong and explain it) is the golden skill. If
              you look at CTOs, the ones with actual hands-on experience who
              started as an IC run better engineering orgs. I suspect the same
              is true for managing agents. If you plan to get hired as an AI
              engineer I still recommend to learn how to code, you could do it
              in a month (use Cursor for learning).
            </InsightBox>
          </ArticleSection>
          {/* Section 4: The Tradeoffs That Have Changed */}
          <TOCHeading id="tradeoffs-changed" level={2}>
            The Tradeoffs That Have Changed
          </TOCHeading>
          [nano banana image here on this section]
          <ArticleSection>
            <TOCHeading id="speed-vs-accuracy" level={3}>
              Speed vs Accuracy
            </TOCHeading>
            <Prose>
              <p>The landscape has fundamentally shifted.</p>
              <p>
                Being in the loop was necessary when I first started with
                Cursor. Now it&apos;s optional. This is no longer a tradeoff
                that exists in any meaningful way for most tasks.
              </p>
              <p>
                However, Claude will not have an understanding of your
                preference around code cleanliness. This tradeoff still exists
                not for generating code, but for maintaining code.
              </p>
              <p>
                You will have codebase rot and need to refactor things. Over
                time you should add more context to Claude.md (more on this
                later) that reveals your preferences around code cleanliness and
                reduces refactoring time.
              </p>
            </Prose>

            <TOCHeading id="context-optimization" level={3}>
              Context Optimization vs Time
            </TOCHeading>
            <Prose>
              <p>
                Context windows are longer, models are smarter, they can find
                their way around.
              </p>
              <p>That said, context is still unsolved. </p>
              <p>
                Providing specific context of the repo to your model, and being
                as specific as possible (planning helps with this) will always
                win, whether it&apos;s docs, tests, or related code.
              </p>
              <p>
                Generating things in a chat that already has context will always
                win, whether it&apos;s docs, tests, or related code.
              </p>
              <p>
                This has not fundamentally changed since ChatGPT era circa 2022.
              </p>
              <p>Here&apos;s some advice I&apos;ve picked up over time:</p>
              <ol className="list-decimal list-outside space-y-1 ml-6">
                <li>
                  Sometimes I&apos;ll do something manually that I could have
                  asked the model to do or jump into Cursor and reference the
                  exact code I want to edit.
                </li>
                <li>
                  Maintain focus: one chat = roughly one task. If a chat is
                  focused on a single task it will have more relevant context.
                </li>
                <li>
                  <code className="text-orange-500 bg-orange-50 px-1 rounded-md">
                    &quot;spawn a subagent to do deep research on this
                    topic&quot;
                  </code>{' '}
                  Spawn subagents for parallel work. They do not pollute the
                  main agent&apos;s context. They can individually do work and
                  add just the valuable context from their work to the main
                  agent&apos;s context.{' '}
                </li>
                <li>
                  <code className="text-orange-500 bg-orange-50 px-1 rounded-md">
                    /compact
                  </code>{' '}
                  - Others are iffy about compacting, but often the tradeoff to
                  stay in the same chat and eat the compacting is worth it.
                </li>
                <li>
                  <code className="text-orange-500 bg-orange-50 px-1 rounded-md">
                    /transfer-context
                  </code>{' '}
                  That said, after compacting enough times or doing any task not
                  directly related, quality will degrade. Don&apos;t be afraid
                  to create new chats. If you need to transfer context, just
                  tell the model to give you a prompt to put into another model
                  with the related context for the task with the files (for
                  anything advanced create md files, although I find managing
                  these md files to be annoying).{' '}
                  <a
                    href="https://gist.github.com/SilenNaihin/63247843400345704d61210006a81065"
                    target="_blank"
                    className="ml-1"
                    rel="noopener noreferrer"
                  >
                    Here&lsquo;s a gist of my command for this /transfer-context
                  </a>{' '}
                  [gist here] .
                </li>
                <li>
                  <code className="text-orange-500 bg-orange-50 px-1 rounded-md">
                    /context
                  </code>
                  Shows you how much context you have left. You&apos;ll get a
                  report like this: [report showing how much context is left
                  here] Claude will also tell you when you have ~10% context
                  left. [image here of the % context left] Make the decision to
                  compact or to switch chats at this point. Don&apos;t wait
                  until it hits 0% as it will degrade your outputs, and if it
                  compacts in the middle of a task it will forget potentially
                  relevant context that you&apos;ve given it even in the last
                  chat.
                </li>
              </ol>
              [nano banana of the above here]
            </Prose>

            <TOCHeading id="specificity-vs-time" level={3}>
              Specificity vs Time
            </TOCHeading>
            <Prose>
              <p>
                You used to need surgical specificity. With ChatGPT you
                couldn&apos;t do much more than generate a function or
                component. With early Cursor, you needed to spell out how
                everything is connected, what should be implemented, and keep it
                simple.
              </p>
              <p>With modern models, this tradeoff is basically gone.</p>
              <p>
                We&apos;re now roughly at the level of a senior engineer with
                short term memory loss and an inability to learn beyond
                it&apos;s current context encyclopedic knowledge.
              </p>
              [nano banana of the differnt phases throughout time here]
              <p>
                What&lsquo;s valuable is <strong>broad specificity</strong>{' '}
                (linting rules, best practices for splitting components when
                working with a team) and then{' '}
                <strong>project-specific specificity</strong> for how you want
                to implement specific parts. The granular stuff? Let the model
                figure it out. More on this later.
              </p>
              <p>
                This allows us to generate higher level plans because the
                cognitive lightcone of the model is much larger.
              </p>
              [link Michale Levin&apos;s work on this]
            </Prose>

            <TOCHeading id="planning-leverage" level={3}>
              Planning Time vs Execution Quality
            </TOCHeading>
            <Prose>
              <p>
                <strong>This is the most valuable tradeoff currently.</strong>{' '}
                Your time spent planning is directly proportional to agent
                output.
              </p>
              <p>
                You will get roughly 3 minutes out for every minute you spend
                planning.{' '}
              </p>
              <p>
                So for a simple task, if you spend 5 seconds writing a prompt,
                that&apos;s sufficient for a 15 second task. For a more complex
                task, if you spend 5 minutes writing a prompt, that&apos;s
                sufficient for a 15 minute task. [nano banana of the tradeoff]
              </p>
              <p>
                For longer tasks there&apos;s diminishing returns because often
                times you&apos;ll need to adjust the plan as you make your way
                through it. Spending that time generating a solid base, good
                &quot;verification points&quot;, and general guidelines becomes
                more valuable.
              </p>
              <InsightBox>
                For example, I built a research paper search engine that finds
                papers related to a given topic and then ranks them based on
                their relevance. It has an API and the ability to build agents
                on top of it. [link to repo here]
                <p>
                  I spent 1 hour planning this and it worked for 3 hours. I
                  suspect that if I spent 30 minutes less planning, I would
                  likely have and extra 1h 30m extra fixing bugs, refactoring,
                  and regrafting. I used Ralph for this (more on this later).
                </p>
              </InsightBox>
            </Prose>

            <TOCHeading id="closing-the-loop" level={3}>
              Closing The Loop vs Starting Fresh
            </TOCHeading>
            <Prose>
              <p>
                There&apos;s a classic XKCD about programmers spending a week
                automating a task that takes 5 minutes. The punchline: you end
                up spending all your time on &quot;debugging, rethinking, and
                ongoing development&quot; instead of doing the actual work.
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
                The rule for React has always been if you find yourself writing
                code more than once, abstract it into a component. This applies
                to everything you do when building with agents.
              </p>
              <p>Close the loop whenever you can:</p>
              <ul className="list-disc list-outside space-y-1 ml-6">
                <li>Make commands for repeated prompts</li>
                <li>Make agents for repeated work</li>
                <li>Update your claude.md</li>
                <li>Make prompts in .mds (like Cursor rules!)</li>
                <li>Change tsconfig and other config files</li>
              </ul>
              <p>Etc. More on these later.</p>
              [nano banana of the closing the loop here]
              <p>
                The tradeoff now isn&apos;t &quot;should I automate this?&quot;
                It&apos;s &quot;should I close this loop now or start fresh on
                something new?&quot; Usually, close the loop. The compounding
                returns are real.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 5: Claude Code Specifics */}
          <TOCHeading id="cc-specifics" level={2}>
            Claude Code Specifics
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Models no longer remove valuable code that isn&apos;t directly
                related to the current task. In fact, they&apos;ve RLHF&apos;d
                it so far into oblivion that you need to explicitly ask it to
                change any previous code.
              </p>
              <p>
                Before diving into workflow, you need to know the tool. Think
                about it like working with an engineer who has little context on
                your project. Minimize the amount they need to figure out for
                themselves.
              </p>
            </Prose>

            <TOCHeading id="essential-commands" level={3}>
              Essential Commands
            </TOCHeading>
            <ComparisonTable
              headers={['Command', 'What it does']}
              rows={[
                [
                  '/ultrathink',
                  'Engages deeper reasoning. Spam this for hard tasks or when you want Opus 4.5 to be more rigorous.',
                ],
                [
                  '/compact',
                  'Compresses context when hitting limits. Do a handoff or compact at ~60% if building something complex.',
                ],
                [
                  '/context',
                  'Shows current context usage. Use this frequently.',
                ],
                [
                  '/rewind',
                  'Revert to a previous checkpoint (like Cursor). Can rewind code and conversation.',
                ],
                ['/resume', 'Continue from a previous chat context.'],
                [
                  '/init',
                  'Analyzes your project and generates starter CLAUDE.md configuration.',
                ],
                [
                  '/agents',
                  'Manage and create sub-agents. Recommended approach for parallel work.',
                ],
              ]}
            />

            <TOCHeading id="keyboard-shortcuts" level={3}>
              Keyboard Shortcuts
            </TOCHeading>
            <Prose>
              <p>
                <strong>Shift+Tab twice:</strong> Enter plan mode. This is
                probably the most important shortcut.
              </p>
              <p>
                <strong>Shift+Tab:</strong> Switch between models (Opus/Sonnet).
              </p>
              <p>
                <strong>#:</strong> While working, press # and Claude will add
                instructions to your CLAUDE.md automatically.
              </p>
              <p>
                <strong>Ctrl+R:</strong> Search through prompt history (similar
                to terminal backsearch).
              </p>
              <p>
                <strong>Alt/Option+Tab:</strong> Toggle thinking on/off. Note:
                there&apos;s currently a bug on Mac where this doesn&apos;t
                work. CC defaults to thinking always true in settings.json.
              </p>
              <p>
                <strong>Esc+Esc:</strong> Alternative way to access /rewind
                checkpointing.
              </p>
            </Prose>

            <TOCHeading id="trigger-words" level={3}>
              Trigger Words That Work
            </TOCHeading>
            <Prose>
              <p>
                Adding trigger words makes Claude solve even the trickiest
                problems:
              </p>
            </Prose>
            <UnorderedList>
              <li>&quot;take your time&quot;</li>
              <li>&quot;comprehensive&quot;</li>
              <li>&quot;read all code that could be related&quot;</li>
              <li>&quot;create possible hypotheses&quot;</li>
              <li>&quot;preserve your intent&quot;</li>
              <li>&quot;add code comments on tricky parts&quot;</li>
            </UnorderedList>
            <Prose>
              <p>
                That last one helps both you and future model runs understand
                what&apos;s happening.
              </p>
            </Prose>

            <TOCHeading id="screenshots" level={3}>
              Screenshots
            </TOCHeading>
            <Prose>
              <p>
                Drag screenshots into chat. The model is really good at finding
                exactly what you show. It finds strings, matches them, and
                arrives directly at the place you mention.
              </p>
              <p>
                steipete mentions that at least 50% of his prompts contain
                screenshots. I&apos;m not quite there, but it&apos;s a powerful
                pattern, especially for frontend work. Much faster than
                explaining with words.
              </p>
            </Prose>

            <TOCHeading id="subagents" level={3}>
              Subagents
            </TOCHeading>
            <Prose>
              <p>
                You can ask Claude to spawn subagents. They don&apos;t inherit
                the context, which saves the main agent&apos;s context. Useful
                for parallel work on independent tasks.
              </p>
            </Prose>

            <TOCHeading id="context-management" level={3}>
              Context Management
            </TOCHeading>
            <Prose>
              <p>
                Use <code>/context</code> frequently to monitor usage. Do a
                handoff or compact when you reach ~60% if building something
                complex. Some claim degradation starts as early as 20-40%.
              </p>
              <p>
                One technique to combat context degradation: repeatedly inject
                objectives into the context. After compacting enough times or
                doing any unrelated task, quality degrades.
              </p>
              <p>
                <strong>The copy-paste reset:</strong> When context gets
                bloated, copy everything important from the terminal, run{' '}
                <code>/compact</code> to get a summary, then <code>/clear</code>{' '}
                the context entirely, and paste back only what matters. Fresh
                context with critical information preserved.
              </p>
              <p>
                <strong>Create new chats for new topics.</strong> The model gets
                biased by previous context. Fresh context beats fighting against
                old assumptions.
              </p>
            </Prose>

            <TOCHeading id="drawbacks" level={3}>
              Drawbacks and Quirks
            </TOCHeading>
            <Prose>
              <p>
                Claude Code isn&apos;t perfect. Here&apos;s what to watch for:
              </p>
            </Prose>
            <UnorderedList>
              <li>
                <strong>Generates tons of .md files:</strong> It loves creating
                documentation. You&apos;ll need to clean up periodically.
              </li>
              <li>
                <strong>Can be too eager:</strong> Great for smaller edits, not
                so good for larger features where it might not read the whole
                file or miss parts. Mitigate with plan mode and structure docs.
              </li>
              <li>
                <strong>Likes to overengineer:</strong> Opus 4.5 in particular
                adds extra files, unnecessary abstractions, flexibility you
                didn&apos;t ask for. Tell it what NOT to do: &quot;Keep this
                simple. Don&apos;t add abstractions I didn&apos;t ask for. One
                file if possible.&quot;
              </li>
              <li>
                <strong>Context limit (200k):</strong> You hit the wall faster
                than some alternatives. Monitor with <code>/context</code>.
              </li>
              <li>
                <strong>Better at creating new files than editing:</strong> Keep
                this in mind when structuring your prompts.
              </li>
              <li>
                <strong>Monorepos:</strong> Still worse at these. You need even
                stricter principles for monorepo development.
              </li>
            </UnorderedList>

            <TOCHeading id="version-control" level={3}>
              Version Control
            </TOCHeading>
            <Prose>
              <p>
                <strong>AI can fuck up. Use version control.</strong>
              </p>
              <p>
                If there were errors, or more edits you want to make, accept so
                that you can see the diff from the next edit. You can always go
                back.
              </p>
              <p>
                Keep commits atomic: commit only the files you touched and list
                each path explicitly. For tracked files:
              </p>
            </Prose>
            <pre className="bg-neutral-100 p-3 rounded text-sm overflow-x-auto my-3">
              {`git commit -m "<scoped message>" -- path/to/file1 path/to/file2`}
            </pre>
            <Prose>
              <p>
                Quote git paths containing brackets or parentheses (e.g.,{' '}
                <code>src/app/[candidate]/**</code>) so the shell doesn&apos;t
                treat them as globs.
              </p>
              <p>
                For non-interactive rebases: export <code>GIT_EDITOR=:</code>{' '}
                and <code>GIT_SEQUENCE_EDITOR=:</code>.
              </p>
            </Prose>

            <TOCHeading id="ask-claude" level={3}>
              The &quot;Just Ask Claude&quot; Mindset
            </TOCHeading>
            <Prose>
              <p>
                You can often ask Claude to do things you think you have to do
                manually. Changing default permissions, configuration, anything
                file-related.
              </p>
              <p>
                Get in the mindset: if it involves searching and modifying
                files, just ask Claude. It knows how to do things like creating
                custom commands (it will search the web and figure it out if it
                doesn&apos;t know).
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 5: Planning */}
          <TOCHeading id="planning" level={2}>
            Planning
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Planning is the highest-leverage activity. I always start with a
                plan, no matter how small the task is.
              </p>
              <p>
                Agents optimize for getting something working with minimal
                edits. Once that version exists, subsequent changes patch
                whatever&apos;s there already instead of rethinking the
                approach. The plan is your chance to pick the right shape before
                the code hardens around the wrong one.
              </p>
            </Prose>

            <TOCHeading id="planning-approaches" level={3}>
              Three Approaches
            </TOCHeading>
            <OrderedList>
              <li>
                <strong>Plan mode dialogue:</strong> Start a conversation, ask
                questions, let it explore code, create a plan together. When
                you&apos;re happy, say &quot;build&quot; or &quot;write plan to
                docs/*.md and build this.&quot;
              </li>
              <li>
                <strong>Sprint-style todo list:</strong> For larger projects,
                set up a progress.txt and structured task list (prd.json). More
                on this in the Advanced section.
              </li>
              <li>
                <strong>Generate-revert-plan:</strong> Run your prompt, see what
                it generates, then revert and keep planning for the final plan.
                Do this for sections of your prompt.
              </li>
            </OrderedList>

            <TOCHeading id="planning-prompt" level={3}>
              The Planning Prompt Pattern
            </TOCHeading>
            <Prose>
              <p>
                This is a pattern I used heavily in Cursor that still works:
              </p>
            </Prose>
            <pre className="bg-neutral-100 p-4 rounded text-sm overflow-x-auto my-4">
              {`Based on the above, do the following:

1. Repeat back to me exactly what the problem is and what
   we're trying to do, based on how you understand it.

2. Reflect on if this is the best way to do it and mention
   anything we may be missing or not thinking about.

3. A precise practical implementation plan (how you're
   actually going to write the code and in what files).

BE SURE to be comprehensive and precise in all 3 of the above.

I will then provide any clarification and approve the
implementation plan.

Do not make any modifications until I say "<GO>"`}
            </pre>

            <TOCHeading id="interview-prompt" level={3}>
              The Interview/Spec Prompt
            </TOCHeading>
            <Prose>
              <p>For fleshing out requirements before building:</p>
            </Prose>
            <pre className="bg-neutral-100 p-4 rounded text-sm overflow-x-auto my-4">
              {`Read @SPEC.md and interview me in detail using the
AskUserQuestionTool about literally anything: technical
implementation, UI & UX, concerns, tradeoffs, etc.

Make sure the questions are not obvious.

Be very in-depth and continue interviewing me continually
until it's complete, then write the spec to the file.`}
            </pre>

            <TOCHeading id="thorny-issues" level={3}>
              For Thorny Issues
            </TOCHeading>
            <Prose>
              <p>
                When things are really stuck, ask the model to create possible
                hypotheses, read all related code, and take its time. If
                you&apos;re making lots of changes to your plan, start a new
                session. Summarize what you&apos;ve learned and let the agent
                begin fresh.
              </p>
              <p>
                Starting over often beats more feedback. The first attempt
                shapes everything that follows, so a clean start with better
                context beats incremental fixes.
              </p>
              <p>At the end of a failed attempt:</p>
            </Prose>
            <pre className="bg-neutral-100 p-4 rounded text-sm overflow-x-auto my-4">
              {`Knowing what you know, please write a new high-level plan:
- No code
- Just sentences
- Mention files to look at at the bottom of your plan`}
            </pre>

            <TOCHeading id="ultrathink-planning" level={3}>
              Using /ultrathink for Planning
            </TOCHeading>
            <Prose>
              <p>
                Opus 4.5 is amazing at explaining things and makes stellar ASCII
                diagrams. My exploration involves asking lots of questions,
                clarifying requirements, understanding where/how/why to make
                changes.
              </p>
              <p>
                Once I have enough context, I spam <code>/ultrathink</code> and
                ask what changes are required. If things look okay, I start
                execution, closely monitoring the changes.
              </p>
            </Prose>

            <TOCHeading id="simplest-change" level={3}>
              The Simplest Change Philosophy
            </TOCHeading>
            <Prose>
              <p>
                steipete puts it well:{' '}
                <em>
                  &quot;We want the simplest change possible. We don&apos;t care
                  about migration. Code readability matters most, and we&apos;re
                  happy to make bigger changes to achieve it.&quot;
                </em>
              </p>
              <p>
                Agents optimize for getting something working with minimal
                edits. That&apos;s often not what you want. Be explicit when you
                want clean code over minimal diffs.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 6: Verifiability */}
          <TOCHeading id="verifiability" level={2}>
            Verifiability
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                <strong>Verifiability is king.</strong> I can&apos;t stress this
                enough. The only way you or the model know that you&apos;re
                right is if you can verify the outputs.
              </p>
            </Prose>

            <InsightBox title="The Core Principle">
              <p>
                Make it easy for you to verify by making it easy for the agent
                to verify.
              </p>
            </InsightBox>

            <TOCHeading id="interface-tests" level={3}>
              Interface Tests Over Everything
            </TOCHeading>
            <Prose>
              <p>
                Interface tests &gt; unit tests &gt; nothing. No matter what the
                task, interface tests are most valuable. They verify that the
                system does what it should at the boundaries users interact
                with.
              </p>
              <p>
                Let the model write tests in the same context. It catches bugs
                because the tests are written with full understanding of what
                was just built.
              </p>
              <p>
                <strong>The cyclical limit:</strong> the model tests what the
                model wrote. It may discover new things, and it adds more
                context for the model to think about. In general, allow the
                model to generate a full unit tests file, then simplify to main
                interfaces when refactoring (or delete if not mission-critical
                code).
              </p>
              <p>
                You don&apos;t actually need to review the actual code anymore.
                Interface tests are good enough. If anything is off, ask
                directly.
              </p>
            </Prose>

            <TOCHeading id="tooling-investment" level={3}>
              Tooling Investment
            </TOCHeading>
            <Prose>
              <p>
                Invest time in tooling to always have your local DB up to date
                and populated with realistic data. This lets agents self-verify.
              </p>
              <p>
                <strong>Console log hypotheses.</strong> When debugging, have
                the model add strategic logging to verify assumptions.
              </p>
            </Prose>

            <TOCHeading id="debugging-loop" level={3}>
              The Debugging Loop
            </TOCHeading>
            <Prose>
              <p>When something fails:</p>
            </Prose>
            <OrderedList>
              <li>Get it to create verbose logs</li>
              <li>Tackle it in a different way in a different chat</li>
              <li>Try a different model</li>
              <li>Revert and try again</li>
              <li>Worst case: dive into the code yourself</li>
            </OrderedList>
            <Prose>
              <p>
                <strong>Show instead of tell:</strong> If Claude keeps
                misunderstanding, write a minimal example yourself.
                &quot;Here&apos;s what the output should look like. Now apply
                this pattern to the rest.&quot; Claude is extremely good at
                following examples.
              </p>
              <p>
                <strong>The rule of three:</strong> If you&apos;ve explained the
                same thing three times and Claude still isn&apos;t getting it,
                more explaining won&apos;t help. Change something.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 7: Domain Playbooks */}
          <TOCHeading id="domain-playbooks" level={2}>
            Domain Playbooks
          </TOCHeading>
          {/* Frontend */}
          <TOCHeading id="frontend" level={3}>
            Frontend
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Frontend is where the abstraction chain ends for me. UI +
                console logs are how I verify. I haven&apos;t closed the loop
                with browser automation because I&apos;m particular about
                getting frontend right, and{' '}
                <strong>models don&apos;t have taste yet</strong>.
              </p>
              <p>
                For example, for the books section of{' '}
                <a
                  href="https://silennai.com/content"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  silennai.com/content
                </a>
                , I stayed in the loop the entire time because aesthetic
                decisions required human judgment.
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Keep leaf components presentational:</strong> Business
                logic lives in parent components. Separating concerns makes it
                easy to audit props and spot irregularities. It also helps the
                agent find patterns to follow.
              </li>
              <li>
                <strong>Screenshots for prompts:</strong> The model matches
                strings and finds the location you show. Powerful for UI fixes.
              </li>
              <li>
                <strong>Tight feedback loops:</strong> Stay in Cursor for
                pixel-perfect work. The tab completion is world-class.
              </li>
            </UnorderedList>

            <Prose>
              <p>Agents love to:</p>
            </Prose>
            <UnorderedList>
              <li>
                <strong>Silence linter errors</strong> with{' '}
                <code>eslint-disable</code> instead of fixing them. Ban this
                with plugins like{' '}
                <code>eslint-comments/no-restricted-disable</code>.
              </li>
              <li>
                <strong>Add custom colors and spacing everywhere.</strong> Use
                ESLint to enforce a small set of allowed utility classes.
              </li>
            </UnorderedList>

            <Prose>
              <p>
                You can semi-enforce presentational components via ESLint by
                disabling hooks like <code>useState</code> in view components:
              </p>
            </Prose>
            <pre className="bg-neutral-100 p-3 rounded text-sm overflow-x-auto my-3">
              {`'no-restricted-syntax': [
  'error',
  {
    selector: 'CallExpression[callee.name="useState"]',
    message: 'View components should not manage state.',
  },
]`}
            </pre>
          </ArticleSection>
          {/* Backend */}
          <TOCHeading id="backend" level={3}>
            Backend
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Verifiability is more straightforward here. Model-written unit
                tests work well, with the caveat of the cyclical limit.
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Prisma for schema-as-context:</strong> Highly
                recommended. The entire DB schema is in a file in a format AI
                understands. Always up-to-date, handy commands. The issue with
                pure Supabase is having to reference ugly generated types or
                migrations.
              </li>
              <li>
                <strong>Realistic seed data:</strong> Invest in tooling to keep
                your local DB populated with realistic data. This lets agents
                self-verify.
              </li>
              <li>
                <strong>API route consolidation:</strong> Treat this as a
                refactor task. Agents create routes; you consolidate them later.
              </li>
            </UnorderedList>
          </ArticleSection>
          {/* Research */}
          <TOCHeading id="research" level={3}>
            Research
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                I&apos;m just starting to experiment with this. I&apos;ve given
                Claude access to a VM with a V100 to see what experiments it
                performs. I&apos;ll update this section as I learn more.
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
                Models don&apos;t have taste for research either, but they can
                help you think through planning. Paste in a document about your
                hypothesis, and they can help you actually execute on it.
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
                When generating educational content for yourself, the feedback
                loop in Cursor is actually quicker. But Claude Code has unique
                strengths:
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Generating IPYNBs:</strong> Great for creating
                interactive learning materials with code you can run.
              </li>
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

            <Prose>
              <p>
                I have a{' '}
                <a
                  href="https://silen.notion.site/My-prompt-for-learning-new-computational-concepts-2d72b9e381378056beced8f7ff14878f"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  megaprompt for learning new computational concepts
                </a>{' '}
                if you want to go deeper.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 8: Your CLAUDE.md */}
          <TOCHeading id="claude-md" level={2}>
            Your CLAUDE.md
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                The <code>/init</code> command analyzes your project and
                generates a starter configuration. But here&apos;s what actually
                matters:
              </p>
              <p>
                <strong>Keep it short.</strong> Claude can only reliably follow
                around 150-200 instructions at a time, and Claude Code&apos;s
                system prompt already uses about 50 of those. Every instruction
                you add competes for attention. If your CLAUDE.md is a novel,
                Claude will start ignoring things randomly.
              </p>
            </Prose>

            <TOCHeading id="what-to-include" level={3}>
              What to Include
            </TOCHeading>
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
            </UnorderedList>

            <TOCHeading id="context-tips" level={3}>
              Context Tips
            </TOCHeading>
            <UnorderedList>
              <li>
                <strong>Remove irrelevant linked context:</strong> Don&apos;t
                confuse the model with unrelated files.
              </li>
              <li>
                <strong>
                  Directly add relevant context within larger files:
                </strong>{' '}
                Use specific function references or paste specific blocks.
              </li>
              <li>
                <strong>
                  Keep file and function names discrete and unique:
                </strong>{' '}
                Descriptive function names are highly recommended.
              </li>
              <li>
                <strong>Add comments to files for more context:</strong> This
                helps both future you and future model runs.
              </li>
              <li>
                <strong>Write out a PRD and reference it:</strong> Give
                surrounding context so the model minimizes gaps it needs to
                fill.
              </li>
            </UnorderedList>

            <TOCHeading id="docs-folder" level={3}>
              The docs/ Folder Pattern
            </TOCHeading>
            <Prose>
              <p>
                Maintain docs for subsystems and features in a{' '}
                <code>docs/</code> folder. Use a script + instructions to force
                the model to read docs on certain topics. This pays off more the
                larger the project is.
              </p>
              <p>
                &quot;Write docs to docs/*.md&quot; and let the model pick a
                filename. Design your codebase structure so agents can work in
                it efficiently. I don&apos;t design codebases to be easy to
                navigate for me, I engineer them so agents can work in it
                efficiently.
              </p>
            </Prose>

            <TOCHeading id="what-not-to-include" level={3}>
              What NOT to Change
            </TOCHeading>
            <Prose>
              <p>
                <strong>Never edit .env or environment variable files.</strong>{' '}
                Only you should change these.
              </p>
              <p>
                <strong>Never run destructive git operations</strong> (
                <code>git reset --hard</code>, <code>rm</code>,{' '}
                <code>git restore</code> to older commits) unless explicitly
                instructed. Treat these as catastrophic.
              </p>
            </Prose>

            <TOCHeading id="custom-commands" level={3}>
              Creating Custom Commands
            </TOCHeading>
            <Prose>
              <p>
                If you find yourself writing a prompt repeatedly and
                instructions can be static/precise, make a custom command. Tell
                Claude to make custom commands. It knows how.
              </p>
              <p>
                Example: a custom <code>/commit</code> command that explains
                multiple agents work in the same folder and to only commit your
                changes, so you get clean commits and the agent doesn&apos;t
                freak out about other changes.
              </p>
            </Prose>
          </ArticleSection>
          {/* Section 9: Advanced */}
          <TOCHeading id="advanced" level={2}>
            Advanced
          </TOCHeading>
          <ArticleSection>
            <TOCHeading id="parallel-agents" level={3}>
              Multi-Agent Parallel Execution
            </TOCHeading>
            <Prose>
              <p>
                Run 3-8 agents in parallel in terminal grid layouts. steipete
                mentions <strong>&quot;blast radius thinking&quot;</strong>:
                evaluate change scope before prompting and stop mid-execution if
                tasks exceed expectations.
              </p>
              <p>
                The natural thing to try is worktrees and separation of
                concerns. Then you realize for solo projects, hammering main is
                often the best way when running multiple instances. Rare
                exceptions exist (long-running experiments), but usually if
                you&apos;re creating a worktree, you&apos;re limited by another
                instance anyway.
              </p>
            </Prose>

            <TOCHeading id="ralph" level={3}>
              Ralph for Larger Sprints
            </TOCHeading>
            <Prose>
              <p>
                For larger &quot;sprints&quot; where a lot needs to get done,
                use{' '}
                <a
                  href="https://x.com/ryancarson/status/2008548371712135632"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ralph
                </a>
                . It requires a <code>progress.txt</code> and{' '}
                <code>prd.json</code>. Good for multi-hour coordinated work.
              </p>
            </Prose>

            <TOCHeading id="phone-coding" level={3}>
              Phone Coding
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
                with Tailscale to code from your phone. VibeTunnel is a terminal
                multiplexer for coding on-the-go.
              </p>
            </Prose>

            <TOCHeading id="hooks" level={3}>
              Hooks System
            </TOCHeading>
            <Prose>
              <p>
                Claude Code has hooks that execute on tool call, on stop, etc.
                Want Prettier to run on every file Claude touches? Hook. Want
                type checking after every edit? Hook. This catches problems
                immediately.
              </p>
              <p>
                One funny use case: running a &quot;Do more&quot; prompt when
                Claude finishes via the Stop hook to keep it working for hours.
              </p>
            </Prose>

            <TOCHeading id="headless-mode" level={3}>
              Headless Mode
            </TOCHeading>
            <Prose>
              <p>
                The <code>-p</code> flag runs Claude Code in headless mode. It
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

            <TOCHeading id="automated-review" level={3}>
              Automated PR and Commit Review
            </TOCHeading>
            <Prose>
              <p>
                Tools like{' '}
                <a
                  href="https://coderabbit.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Coderabbit
                </a>{' '}
                automatically review your PRs and commits. They catch issues,
                suggest improvements, and provide context-aware feedback before
                human review even begins.
              </p>
              <p>
                This is another form of closing the loop. Instead of manually
                reviewing every diff, you get an AI first-pass that catches the
                obvious stuff: security issues, style violations, potential
                bugs, missing tests. Human reviewers can then focus on
                architecture and business logic.
              </p>
              <p>
                You can also wire up Claude Code to do this yourself. Use
                headless mode (<code>-p</code>) with custom prompts tailored to
                your codebase, or set up a hook that triggers on every commit.
                The hooks system lets you run Claude Code automatically on file
                changes, commits, or any git event.
              </p>
            </Prose>

            <TOCHeading id="refactoring" level={3}>
              Refactoring and Cleanup
            </TOCHeading>
            <Prose>
              <p>
                Think of your repo as your home. Sometimes it&apos;s messy when
                you build new walls. You need to clean it. Delete unused or
                obsolete files when your changes make them irrelevant.
              </p>
              <p>Tools to use:</p>
            </Prose>
            <UnorderedList>
              <li>
                <strong>jscpd:</strong> Code duplication detection
              </li>
              <li>
                <strong>knip:</strong> Dead code removal
              </li>
              <li>
                <strong>ast-grep:</strong> Set up as a git hook to block commits
                with codebase linting issues. If you don&apos;t use ast-grep,
                stop here and ask your model to set this up.
              </li>
            </UnorderedList>
            <Prose>
              <p>
                Dedicate refactoring as a distinct phase rather than continuous
                activity. ~20% of dev time on focused code quality improvements.
              </p>
              <p>
                <strong>Use components and centralized functions.</strong>{' '}
                It&apos;s a pain in the ass, but you&apos;ll regret not doing
                this as the project grows.
              </p>
            </Prose>

            <TOCHeading id="mcp-examples" level={3}>
              MCP Examples
            </TOCHeading>
            <Prose>
              <p>
                I don&apos;t use MCP servers heavily since things change so
                fast, but here are patterns others have found useful:
              </p>
            </Prose>
            <UnorderedList>
              <li>
                <strong>Figma MCP:</strong> For initial component generation
                from designs. Bridges design to code.
              </li>
              <li>
                <strong>Dev server management:</strong> Manage ports and prevent
                conflicts that waste iteration cycles.
              </li>
            </UnorderedList>
          </ArticleSection>
          {/* Section 10: The Baseline */}
          <TOCHeading id="baseline" level={2}>
            The Baseline
          </TOCHeading>
          <ArticleSection>
            <Prose>
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
                <strong>Verifiability will remain king.</strong> The principle
                holds no matter how capable models become.
              </li>
              <li>
                <strong>The abstraction chain will keep extending.</strong>{' '}
                Today it ends at frontend UI for me. Tomorrow it might not. But
                there will always be a frontier where human judgment matters.
              </li>
              <li>
                <strong>Close the loop.</strong> If you do something more than
                once, abstract it. Commands, docs, components. This principle
                predates AI and will outlast current tools.
              </li>
              <li>
                <strong>Don&apos;t be lazy.</strong> Figure out what needs to be
                done logically. You don&apos;t actually have to code, but do the
                hard thinking. A lot of times you&apos;ll realize what
                you&apos;re trying to do is either simpler or harder than you
                think.
              </li>
            </UnorderedList>

            <TOCHeading id="mental-models" level={3}>
              Mental Models
            </TOCHeading>
            <Prose>
              <p>
                <strong>Outcome, not sequence.</strong> You describe an outcome.
                The agent operates in a loop until it&apos;s achieved. This is
                different from executing a choreographed sequence of commands.
                The agent can encounter unexpected cases, adjust its approach,
                or ask clarifying questions.
              </p>
              <p>
                <strong>Files are the universal interface.</strong> Agents are
                naturally good at files. They already know cat, grep, mv, mkdir.
                Files are inspectable (you can see what the agent created),
                portable (export is trivial), and self-documenting
                (/projects/acme/notes/ explains itself). Design for what agents
                can reason about.
              </p>
              <p>
                <strong>Discover latent demand.</strong> Pay attention to what
                you ask the agent to do. When patterns emerge, formalize them
                into commands or docs. You&apos;re discovering what you need,
                not guessing upfront.
              </p>
            </Prose>

            <InsightBox title="Your Foundation">
              <p>
                Understand interfaces. Debug on the spot. Manage agents like
                you&apos;d manage engineers.
              </p>
              <p className="mt-2">
                The specifics of commands and configurations? Learn them
                just-in-time. Read guides like this one so you know what&apos;s
                possible, but reach your own optimal through experimentation.
                Most decisions are inherently biased by taste and what
                you&apos;ve already been using.
              </p>
            </InsightBox>
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
                  href="https://ast-grep.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ast-grep
                </a>{' '}
                — Codebase linting via git hooks
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
