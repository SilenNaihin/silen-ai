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
"""
}


def generate_image(name: str, prompt: str) -> None:
    """Generate and save an image using Gemini's native image generation."""
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
                output_path = OUTPUT_DIR / f"{name}.png"

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
