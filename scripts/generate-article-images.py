#!/usr/bin/env python3
"""Generate images for the verifiability article using Gemini Imagen API."""

import os
from pathlib import Path

if "GOOGLE_API_KEY" not in os.environ:
    raise ValueError("GOOGLE_API_KEY environment variable not set")

from google import genai
from google.genai import types

OUTPUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "articles" / "verifiability"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

PROMPTS = {
    "verification-loop-v3": """
A circular flow diagram with EXACTLY 3 nodes connected by 3 arrows forming a triangle/cycle:

Node 1 (top): "PROPOSE" with subtitle "(forward pass, candidate solution)"
Node 2 (bottom right): "VERIFY" with subtitle "(get real signal)"
Node 3 (bottom left): "IMPROVE" with subtitle "(update future behaviour based on result)"

Arrows: PROPOSE → VERIFY → IMPROVE → back to PROPOSE

EXACTLY 3 arrows, no more. Clean triangular cycle.
Style: Clean minimalist, white background, blue/gray colors. Modern sans-serif.
No title, no extra text. Just the cycle diagram.
""",

    "knowledge-hierarchy-v3": """
An INVERTED pyramid (widest at TOP, narrowest at BOTTOM):

TOP (widest, blue): "INTERPOLATION" - with small example "moving a comma in a poem"
MIDDLE (medium, teal): "FIRST-ORDER COMBINATIONS" - with example "special relativity"
BOTTOM (narrowest, gold): "ZEROTH-ORDER DISCOVERIES" - with example "the number zero, complex numbers"

The narrow bottom shows rarity. Wide top shows most knowledge is interpolation.
Include the small examples next to each level.

Style: Clean minimalist, white background. Gradient blue to gold.
No title. Just the inverted pyramid with labels and examples.
""",

    "model-collapse-v3": """
A funnel or cone showing model collapse - diversity loss over generations.

LEFT (wide): "Generation 0" with many diverse colorful dots spread out
MIDDLE: "Generation 3" with fewer, clustered dots
RIGHT (narrow): "Generation N" with just a few dots tightly clustered

Labels only: "Full distribution" on left, "Collapsed" on right.

Style: Clean scientific visualization, white background, blue-gray colors.
NO title. NO "Figure 1" text. NO caption. Just the visual.
""",

    "ood-approaches-v3": """
A radial mind map with exactly 6 branches:

CENTER CIRCLE: "OOD Thinking" (just these two words)

6 BRANCHES with icons:
1. "Post-training diversity" with subtitle "RLHF, RLVR"
2. "Architectural diversity" with subtitle "transformers, SSMs, diffusion"
3. "In-context activation shift" (this replaces researcher prompting)
4. "RSA aggregation" with subtitle "recursive synthesis"
5. "Galapagos evolution" with subtitle "variation + selection"
6. "Sampling strategies" with subtitle "temperature, top-p"

Style: Clean node-and-edge diagram, white background. Blue/gray colors.
Each branch has small icon. No title. No extra text.
""",

    "dimensions-v3": """
A HORIZONTAL infographic showing 10 verifiability dimensions as a flowing strip or ribbon.

Left to right, 10 connected boxes or segments:
Speed | Cost | Certainty | Meta-verifiability | Reproducibility | Granularity | Complexity | Interpretability | Falsifiability | Composability

Each box has small icon above the label.
Subtle color gradient across the strip (not indicating anything, just visual interest).

Style: Clean horizontal infographic, white background. Wide/landscape format.
Modern typography. No title. Just the 10 dimensions in a row.
""",

    "claim-types-v3": """
A flowing gradient visualization showing 6 types of AI research claims.
NOT numbered. Show as a smooth spectrum from green to red.

GREEN (left, most verifiable):
- Performance Claims
- Theoretical Claims

YELLOW (middle):
- Method Claims
- Mechanistic Claims

RED (right, hardest to verify):
- Emergent Claims
- Safety Claims

Show as connected flowing shapes or a gradient band, not stacked boxes.
Each claim type is a region in the gradient, no numbers, minimal text.

Style: Clean infographic, white background. Flowing gradient green to red.
NO title. NO numbering. NO "Figure" text. Just the visual spectrum.
""",

    "knowledge-lenses-v3": """
A grid showing 13 research lenses for AI/ML arranged by verifiability.
NO repeated lenses. Each appears exactly once.

GREEN ZONE (highly verifiable):
- Computational Efficiency & Hardware
- Algorithmic Framing (CS Theory)
- Training Stability

YELLOW ZONE (medium):
- Compute Regimes & Scaling
- Representational Capacity
- Data as First-Class
- Probabilistic Inference
- Strategic Interaction

RED ZONE (low verifiability):
- Physical Principles
- Meta-Learning
- Cognitive Substrate (Brain)
- Biological Optimization
- Philosophical Foundations

Each lens has small icon. Gradient from green to red.
Style: Grid layout, white background. No title. No repeats.
""",

    "claim-strength-v1": """
A visualization showing 6 levels of claim strength arranged by verifiability:

From STRONGEST (top, green) to WEAKEST (bottom, red):
1. Existence proof - "X is possible"
2. Narrow empirical - "X works on dataset Y"
3. Hedged empirical - "X tends to work when..."
4. Systematic claim - "X works across conditions"
5. Universal claim - "X always works"
6. Guarantee - "X will never fail"

Show as descending steps or a ladder from strong/verifiable to weak/hard-to-verify.
Paradox: stronger claims (guarantees) are harder to verify.

Style: Clean infographic, white background. Green to red gradient.
No title. Just the 6 levels with brief descriptions.
""",

    "verifiable-data-v3": """
A SIMPLE flow diagram showing verification data ecosystem.

LEFT (data sources): Code, Math, Labs, Robots, Sims, Games, Humans
CENTER (verifiers): Tests, Proofs, Sensors, Rules, Judgment
RIGHT (output): Model Capabilities

Simple arrows connecting left → center → right.
Some paths thicker than others (code+tests is thick, humans+judgment is thin).

Style: Clean minimalist, white background. Simple network diagram.
NO title. NO "Figure" text. NO complicated labels. Just nodes and flows.
"""
}


def generate_image(name: str, prompt: str, skip_existing: bool = True) -> None:
    """Generate and save an image using Gemini's native image generation."""
    output_path = OUTPUT_DIR / f"{name}.png"

    if skip_existing and output_path.exists():
        print(f"Skipping: {name} (already exists)")
        return

    print(f"Generating: {name}")

    try:
        response = client.models.generate_content(
            model='nano-banana-pro-preview',
            contents=prompt.strip(),
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE', 'TEXT'],
            )
        )

        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                with open(output_path, 'wb') as f:
                    f.write(image_data)
                print(f"  Saved to: {output_path}")
                return

        print(f"  No image found in response for {name}")

    except Exception as e:
        print(f"  Error generating {name}: {e}")


def main():
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    for name, prompt in PROMPTS.items():
        generate_image(name, prompt)
        print()

    print("Done!")


if __name__ == "__main__":
    main()
