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
    "dimensions": """
A radar/spider chart showing 8 dimensions of verifiability.

The 8 dimensions arranged around the chart:
1. Speed (how fast is feedback)
2. Cost (who can afford it)
3. Certainty (how noisy is the signal)
4. Reproducibility (same result twice)
5. Meta-verifiability (can you trust the verifier)
6. Signal Richness (how much info per check)
7. Complexity (can you run it)
8. Interpretability (can you understand the result)

Style: Clean radar chart with 8 axes radiating from center.
Each axis labeled with the dimension name.
Light gray grid lines. White background.
Simple, professional infographic style.
No title, just the radar chart with labels.
""",

#     "knowledge-lenses-v4": """
# A SEMICIRCLE / HALF-CIRCLE gauge showing 13 AI/ML research lenses arranged by verifiability.
#
# The semicircle is divided into segments like a speedometer or gauge:
#
# LEFT SIDE (green, high verifiability):
# - Computational Efficiency & Hardware
# - Algorithmic Framing
# - Training Stability
#
# CENTER (yellow/orange, medium):
# - Compute Regimes & Scaling
# - Representational Capacity
# - Data as First-Class
# - Probabilistic Inference
# - Strategic Interaction
#
# RIGHT SIDE (red, low verifiability):
# - Physical Principles
# - Meta-Learning
# - Cognitive Substrate
# - Biological Optimization
# - Philosophical Foundations
#
# Each lens is a segment of the semicircle, with its name written along the arc or in the segment.
# Color gradient from green (left) through yellow to red (right).
#
# Style: Clean semicircle gauge visualization. White background.
# Like a speedometer or half-pie chart. No title. Just the semicircle with labels.
# """,
#
#     "claim-strength-v4": """
# A visualization showing 6 levels of claim strength.
#
# IMPORTANT: GUARANTEE is at the TOP (most verifiable/easiest to falsify).
# EXISTENCE PROOF is at the BOTTOM (hardest to falsify).
#
# From TOP to BOTTOM:
# 1. Guarantee (green) - "X will never fail" - ONE counterexample falsifies it
# 2. Universal claim (light green) - "X always works"
# 3. Systematic claim (yellow) - "X works across conditions"
# 4. Hedged empirical (orange) - "X tends to work when..."
# 5. Narrow empirical (red-orange) - "X works on dataset Y"
# 6. Existence proof (red) - "X is possible" - hardest to falsify
#
# Show as descending steps or ladder from most verifiable (top) to least verifiable (bottom).
# Each step has the claim type name and a SHORT description.
#
# Style: Clean infographic, white background. Green to red gradient (top to bottom).
# No title. The 6 levels clearly arranged vertically.
# """
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
