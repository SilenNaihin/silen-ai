#!/usr/bin/env python3
"""Generate images for the verifiability article using Gemini Imagen API."""

import os
from pathlib import Path

# Set the API key from environment or use default
# To use: export GOOGLE_API_KEY=your_key_here
if "GOOGLE_API_KEY" not in os.environ:
    raise ValueError("GOOGLE_API_KEY environment variable not set")

from google import genai
from google.genai import types

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "articles" / "verifiability"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

# Image prompts for the verifiability article
PROMPTS = {
    # --- EXISTING IMAGES (commented out to preserve) ---
    # "spectrum": """...""",
    # "dimensions": """...""",
    # "verification-loop": """...""",
    # "meta-bottleneck": """...""",
    # "claim-types": """...""",
    # "knowledge-hierarchy": """...""",
    # "model-collapse": """...""",
    # "ood-approaches": """...""",
    # "ai-discoveries": """...""",
    # "verifiable-data": """...""",
    # "ml-experiment-parts": """...""",
    # "knowledge-lenses": """...""",

    # --- V2 IMAGES FOR COMPARISON ---
    "verification-loop-v2": """
A simple circular flow diagram with exactly 3 steps in a cycle:
1. PROPOSE (top) - an agent proposes a hypothesis
2. VERIFY (right) - we verify whether it holds
3. IMPROVE (left) - we improve based on the result
Arrow from IMPROVE back to PROPOSE completing the cycle.

Style: Clean minimalist design, white background, large clear arrows connecting steps.
Blue and gray color scheme. Modern sans-serif typography.
Professional diagram like you'd see in a research paper. No people.
""",

    "knowledge-hierarchy-v2": """
An INVERTED pyramid diagram (widest at TOP, narrowest at BOTTOM) showing levels of knowledge:

TOP (widest section, blue): "INTERPOLATION" - filling gaps in learned space, most common
MIDDLE (medium width, teal): "FIRST-ORDER COMBINATIONS" - novel recombinations of concepts
BOTTOM (narrowest section, gold): "ZEROTH-ORDER DISCOVERIES" - rare foundational primitives

The narrow bottom represents rarity and foundational importance - like the number zero or complex numbers.
The wide top shows that most knowledge is interpolation.

Style: Clean minimalist design, white background. Smooth gradient from blue (top) to gold (bottom).
Modern typography with clear labels. No people. Professional infographic style.
""",

    "model-collapse-v2": """
A visualization showing model collapse as diversity loss over training generations.

Show as a FUNNEL or CONE shape narrowing from left to right:
- LEFT (wide): "Generation 0" with many diverse colorful dots/samples spread out
- MIDDLE: "Generation 3" with fewer, more clustered samples
- RIGHT (narrow): "Generation N" with just a few samples clustered tightly

OR show as a series of sample grids where variety visibly decreases.
Labels: "Full distribution" on left, "Collapsed distribution" on right.

Style: Clean scientific visualization, white background, blue-to-gray color scheme.
Professional, like a figure from a machine learning paper.
""",

    "ood-approaches-v2": """
A mind map or radial diagram with exactly 6 branches:

CENTER: "Out-of-Distribution Generation" (or "OOD Thinking")

6 BRANCHES radiating out (each with a small icon):
1. Post-training diversity (different RLHF)
2. Architectural diversity (transformers + SSMs + diffusion + ensembles)
3. Researcher prompting (mindset shift)
4. RSA aggregation (recursive synthesis)
5. Galapagos evolution (variation + selection)
6. Sampling strategies (temperature, top-p)

Style: Clean node-and-edge diagram, white background. Modern infographic.
Each branch has a small distinctive icon. Blue and gray colors. No people.
""",

    "dimensions-v2": """
A clean visualization of 10 verifiability dimensions - NOT a radar/spider chart.

Show as a VERTICAL LADDER or STACKED BARS or PERIODIC TABLE style grid:
The 10 dimensions: Speed, Cost, Certainty, Meta-verifiability, Reproducibility,
Granularity, Complexity, Interpretability, Falsifiability, Composability

Each dimension has its own box/cell with the name and a small icon.
Could arrange in 2 columns of 5, or a 2x5 grid, or a vertical stack.

Style: Clean infographic, white background, modern sans-serif typography.
Subtle blue/gray color variations. Professional and technical aesthetic. No people.
""",

    "claim-types-v2": """
A visualization showing 6 types of AI research claims arranged by verifiability.
Show as a GRADIENT or SPECTRUM from green (verifiable) to red (hard to verify):

1. Performance Claims (benchmarks) - GREEN, most verifiable
2. Theoretical Claims (proofs, bounds) - GREEN-YELLOW, highly verifiable if formal
3. Method Claims (ablations, components) - YELLOW, verifiable with effort
4. Mechanistic Claims (interpretability) - ORANGE, medium difficulty
5. Emergent Claims (capabilities, reasoning) - ORANGE-RED, hard to pin down
6. Safety Claims (alignment, honesty) - RED, hardest to verify

Show nuance: each type could have sub-boxes showing variations.
NOT just simple stacked boxes - show it as a flowing gradient or connected chain.

Style: Clean infographic showing spectrum, white background. Professional aesthetic.
""",

    "knowledge-lenses-v2": """
A comprehensive grid or wheel showing 14 research lenses for AI/ML arranged by verifiability.

HIGHLY VERIFIABLE (green zone):
- Computational Efficiency
- Algorithmic Framing (CS Theory)
- Training Stability
- Hardware-Aware Design

MEDIUM VERIFIABLE (yellow zone):
- Compute Regimes & Scaling
- Representational Capacity
- Data as First-Class
- Probabilistic Inference
- Strategic Interaction

LOW VERIFIABLE (red zone):
- Physical Principles
- Meta-Learning
- Cognitive Substrate (Brain)
- Biological Optimization (Evolution)
- Philosophical Foundations

Each lens has a small icon and is clearly labeled.
Style: Grid or wheel layout, gradient from green to red indicating verifiability.
Professional academic aesthetic, white background. No people.
""",

    "verifiable-data-v2": """
A creative visualization (NOT a bar graph) showing the verification data ecosystem.

Show as a FLOW DIAGRAM or ECOSYSTEM MAP with interconnected nodes:

DATA SOURCES (left side):
- Code repositories
- Math/proof libraries
- Physical labs
- Teleoperation/robotics
- Simulations
- Games
- Human annotators
- Red team exercises

VERIFIERS (middle):
- Test execution
- Proof assistants
- Measurement equipment
- Sensor feedback
- Physics engines
- Game rules
- Human judgment
- Adversarial evaluation

VALUE (right side):
- Model capabilities

Show flows/connections between sources, verifiers, and value.
Some paths are thicker (more valuable/verified) than others.

Style: Modern infographic, white background, colorful but professional.
Network/ecosystem visualization, not a simple chart.
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
        # Use Gemini's native image generation
        response = client.models.generate_content(
            model='nano-banana-pro-preview',
            contents=prompt.strip(),
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE', 'TEXT'],
            )
        )

        # Extract and save the image
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                import base64
                image_data = part.inline_data.data
                # Save the image bytes directly
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
