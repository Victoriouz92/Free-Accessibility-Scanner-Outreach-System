import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/generate-alt
 *
 * WHAT IT IS: Takes a list of image URLs and generates alt text descriptions using AI vision.
 * WHY IT EXISTS: The core of the remediation tool — turns "missing alt" into "here's the fix."
 *
 * Accepts: { images: [{ src, context, pageUrl }] }
 * Returns: { descriptions: ["alt text for image 1", "alt text for image 2", ...] }
 *
 * Uses OpenAI GPT-4o Vision API to analyze each image.
 * Falls back to context-based description if AI is not configured.
 */

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images)) {
      return NextResponse.json({ error: "Images array required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    let descriptions: string[];

    if (apiKey) {
      // Use OpenAI Vision API
      descriptions = await generateWithAI(images, apiKey);
    } else {
      // Fallback: generate basic descriptions from context
      descriptions = generateFromContext(images);
    }

    return NextResponse.json({ descriptions });
  } catch (err) {
    console.error("[GenerateAlt] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate descriptions" },
      { status: 500 }
    );
  }
}

/**
 * Generate alt text using OpenAI GPT-4o Vision.
 * Sends each image URL to the API for analysis.
 */
async function generateWithAI(
  images: { src: string; context: string; pageUrl: string }[],
  apiKey: string
): Promise<string[]> {
  const descriptions: string[] = [];

  for (const img of images) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an accessibility expert. Generate a concise, descriptive alt text for the given image. The alt text should be 5-15 words, describe what's visible in the image, and be useful for a screen reader user. Do not start with 'Image of' or 'Picture of'. Just describe what's there.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Generate alt text for this image. Page context: "${img.context}". Page URL: ${img.pageUrl}`,
                },
                {
                  type: "image_url",
                  image_url: { url: img.src, detail: "low" },
                },
              ],
            },
          ],
          max_tokens: 50,
        }),
      });

      if (!response.ok) {
        console.error(`[GenerateAlt] OpenAI API error for ${img.src}:`, response.status);
        descriptions.push(generateFallback(img));
        continue;
      }

      const data = await response.json();
      const altText = data.choices?.[0]?.message?.content?.trim() || generateFallback(img);
      descriptions.push(altText);
    } catch (err) {
      console.error(`[GenerateAlt] Failed for ${img.src}:`, err);
      descriptions.push(generateFallback(img));
    }
  }

  return descriptions;
}

/**
 * Fallback: Generate basic descriptions from context when AI is not available.
 * Better than nothing, but should be reviewed manually.
 */
function generateFromContext(
  images: { src: string; context: string; pageUrl: string }[]
): string[] {
  return images.map((img) => generateFallback(img));
}

/**
 * Generate a basic fallback description from the image filename and context.
 */
function generateFallback(img: { src: string; context: string }): string {
  // data: URIs don't have useful filenames — use context only
  if (img.src.startsWith("data:")) {
    if (img.context && img.context.length > 5) {
      const shortContext = img.context.slice(0, 60).trim();
      return `[Review needed] Related to: ${shortContext}`;
    }
    return "[Review needed] Inline image — describe manually or use AI";
  }

  // Try to extract something useful from the filename
  try {
    const url = new URL(img.src);
    const filename = url.pathname.split("/").pop() || "";
    const name = filename
      .replace(/\.[^.]+$/, "") // remove extension
      .replace(/[-_]+/g, " ") // replace dashes/underscores with spaces
      .replace(/[0-9]{4,}/g, "") // remove long number sequences
      .replace(/\s+/g, " ")
      .trim();

    if (name.length > 3) {
      return `[Review needed] ${name}`;
    }
  } catch {
    // ignore
  }

  // Use page context if available
  if (img.context && img.context.length > 5) {
    const shortContext = img.context.slice(0, 60).trim();
    return `[Review needed] Related to: ${shortContext}`;
  }

  return "[Review needed] Image description required";
}
