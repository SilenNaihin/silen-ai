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
    "spectrum": """
A clean, minimalist horizontal spectrum diagram showing the verifiability of different domains.
Left side (green, labeled "High Verifiability"): Code, Math, Games
Middle (yellow): Simulations, ML Experiments, Benchmarks
Right side (red, labeled "Low Verifiability"): Biology, Clinical Trials, Social Science, Creative

Style: Clean infographic, white background, modern sans-serif typography, subtle gradients.
No people. Professional data visualization aesthetic. Horizontal layout.
""",

    "dimensions": """
A minimalist radar chart or spider diagram showing 10 dimensions of verifiability:
Speed, Cost, Certainty, Meta-verifiability, Reproducibility, Granularity, Complexity, Interpretability, Falsifiability, Composability

Style: Clean white background, thin black lines, subtle blue/gray color scheme.
Modern infographic style. No people. Professional and technical aesthetic.
Each dimension labeled clearly around the perimeter.
""",

    "verification-loop": """
A circular flow diagram showing the AI verification loop:
Generate → Verify → Learn → Improve → Generate (back to start)

Style: Clean minimalist design, white background, arrows connecting each step.
Modern tech aesthetic with subtle gradients. Blue and gray color scheme.
No people. Professional diagram style like you'd see in a research paper.
""",

    "meta-bottleneck": """
A funnel or hourglass diagram showing verifiability as a bottleneck.
Top: Many AI capabilities (code, reasoning, creativity, science)
Middle narrow point: "Verifiability" as the constraint
Bottom: Trusted AI outputs

Style: Clean infographic, white background, minimalist modern design.
Blue gradient color scheme. No people. Professional visualization.
""",

    "claim-types": """
A vertical stack of 5 boxes representing different types of AI research claims, arranged from most to least verifiable:
1. Performance Claims (benchmark scores) - green, solid
2. Method Claims (ablations, components) - light green
3. Mechanistic Claims (interpretability) - yellow
4. Emergent Claims (capabilities, reasoning) - orange
5. Safety Claims (alignment, honesty) - red, dashed border

Style: Clean infographic, white background. Each box has an icon representing the claim type.
Modern sans-serif typography. Professional research paper aesthetic.
""",

    "knowledge-hierarchy": """
A vertical pyramid or hierarchy diagram showing levels of knowledge creation:
Bottom: "Interpolation" - filling gaps in learned space
Middle: "First-order combinations" - novel recombinations of existing concepts
Top: "Zeroth-order discoveries" - new conceptual primitives (like zero, complex numbers)

Style: Clean minimalist design, white background. Subtle gradient from blue (bottom) to gold (top).
Modern typography. No people. Professional infographic style.
""",

    "model-collapse": """
A diagram showing model collapse over generations of training on synthetic data.
Left: Wide distribution (full data manifold) with diverse samples
Middle: Narrower distribution after generation 1
Right: Collapsed, degenerate distribution after multiple generations

Show as overlapping bell curves getting narrower and taller, or as shrinking circles.
Style: Clean scientific visualization, white background. Blue/gray color scheme.
""",

    "ood-approaches": """
A mind map or network diagram showing approaches to out-of-distribution thinking:
Center: "OOD Generation"
Branches: Different architectures, Post-training diversity, RSA aggregation, Galapagos evolution, Researcher prompting, Ensemble methods

Style: Clean node-and-edge diagram, white background. Modern infographic.
Each approach has a small icon. Blue and gray colors. No people.
""",

    "ai-discoveries": """
A Venn diagram or flow chart showing where AI discoveries come from:
Three overlapping circles: "Verifiable Domains" (code, math), "High-dimensional Search" (variation + selection), "Human-AI Collaboration"
Center overlap: "Novel Discoveries"

Style: Clean infographic, white background. Subtle blue/green color palette.
Modern sans-serif typography. Professional scientific aesthetic.
""",

    "verifiable-data": """
A table-style infographic showing types of valuable verification data:
Rows: Code+tests, Math+proofs, Science+simulations, Games+outcomes, Human preferences, Safety red-teaming
Each row has an icon and shows the verifier type and value driver.

Style: Clean data visualization, white background. Alternating row colors.
Modern infographic style. Professional and technical.
""",

    "ml-experiment-parts": """
A pipeline or flow diagram showing parts of an ML experiment in order of verifiability:
Data pipeline → Model architecture → Training loop → Hyperparameters → Evaluation → Baselines → Statistics → Causal attribution

Earlier parts (left) are more verifiable (green), later parts (right) are less verifiable (red).
Style: Clean horizontal pipeline diagram, white background. Gradient from green to red.
Modern infographic. No people. Professional research aesthetic.
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
