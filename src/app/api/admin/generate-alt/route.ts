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
                  text: `Generate alt text for this image. Context from the page: ${img.context}. Page URL: ${img.pageUrl}. If this looks like a logo or team emblem, include the name.`,
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
        descriptions.push(generateSmartFallback(img));
        continue;
      }

      const data = await response.json();
      const altText = data.choices?.[0]?.message?.content?.trim() || generateSmartFallback(img);
      descriptions.push(altText);
    } catch (err) {
      console.error(`[GenerateAlt] Failed for ${img.src}:`, err);
      descriptions.push(generateSmartFallback(img));
    }
  }

  return descriptions;
}

/**
 * Fallback: Generate descriptions from rich context when AI is not available.
 * Uses URL patterns, link text, titles, and surrounding content.
 */
function generateFromContext(
  images: { src: string; context: string; pageUrl: string }[]
): string[] {
  return images.map((img) => generateSmartFallback(img));
}

/**
 * Smart fallback that uses all available hints to generate a useful description.
 */
function generateSmartFallback(img: { src: string; context: string }): string {
  // Parse the rich context hints
  let hints: any = {};
  try {
    hints = JSON.parse(img.context);
  } catch {
    // Old format — plain text context
    hints = { containerText: img.context };
  }

  // Priority 1: Explicit titles/labels (most reliable)
  if (hints.imgTitle) return hints.imgTitle;
  if (hints.linkAriaLabel) return hints.linkAriaLabel;
  if (hints.linkTitle) return hints.linkTitle;
  if (hints.dataTitle) return hints.dataTitle;
  if (hints.dataName) return hints.dataName;
  if (hints.dataCaption) return hints.dataCaption;
  if (hints.figcaption) return hints.figcaption;

  // Priority 2: Link text (if image is inside a link, the link text describes it)
  if (hints.linkText && hints.linkText.length > 2 && hints.linkText.length < 80) {
    return `${hints.linkText}`;
  }

  // Priority 3: URL path analysis
  if (hints.urlPath || img.src) {
    const urlDescription = describeFromUrl(img.src, hints.urlPath);
    if (urlDescription) return urlDescription;
  }

  // Priority 4: Filename extraction
  const filenameDesc = describeFromFilename(img.src);
  if (filenameDesc) return filenameDesc;

  // Priority 5: Sibling/nearby text
  if (hints.siblingText && hints.siblingText.length > 3 && hints.siblingText.length < 60) {
    return `[Review needed] ${hints.siblingText}`;
  }

  // Priority 6: Container text (broadest, least specific)
  if (hints.containerText && hints.containerText.length > 5) {
    const short = hints.containerText.slice(0, 50).trim();
    return `[Review needed] Related to: ${short}`;
  }

  return "[Review needed] Image description required";
}

/**
 * Analyze URL path for patterns that suggest what the image is.
 */
function describeFromUrl(src: string, urlPath: string): string | null {
  const path = urlPath || (() => { try { return new URL(src).pathname; } catch { return ""; } })();
  const pathLower = path.toLowerCase();

  // Team/sport logos
  if (pathLower.includes("/team/") || pathLower.includes("/club/")) {
    return "[Review needed] Team logo or emblem";
  }
  if (pathLower.includes("/league/") || pathLower.includes("/competition/")) {
    return "[Review needed] League or competition logo";
  }
  if (pathLower.includes("/player/")) {
    return "[Review needed] Player photo";
  }

  // Common patterns
  if (pathLower.includes("/logo")) return "[Review needed] Logo";
  if (pathLower.includes("/avatar")) return "[Review needed] User avatar";
  if (pathLower.includes("/icon")) return "[Review needed] Icon";
  if (pathLower.includes("/banner")) return "[Review needed] Banner image";
  if (pathLower.includes("/hero")) return "[Review needed] Hero image";
  if (pathLower.includes("/product")) return "[Review needed] Product image";
  if (pathLower.includes("/profile")) return "[Review needed] Profile photo";
  if (pathLower.includes("/flag")) return "[Review needed] Flag";
  if (pathLower.includes("/thumbnail") || pathLower.includes("/thumb")) {
    return "[Review needed] Thumbnail image";
  }

  return null;
}

/**
 * Extract a description from the filename itself.
 */
function describeFromFilename(src: string): string | null {
  if (src.startsWith("data:")) return null;

  try {
    const url = new URL(src);
    const filename = url.pathname.split("/").pop() || "";
    const name = filename
      .replace(/\.[^.]+$/, "") // remove extension
      .replace(/[-_]+/g, " ") // dashes/underscores to spaces
      .replace(/[0-9a-f]{8,}/gi, "") // remove UUIDs/hashes
      .replace(/\s+/g, " ")
      .trim();

    // Only use if the cleaned name is meaningful (not just leftover numbers/short strings)
    if (name.length > 3 && !/^\d+$/.test(name)) {
      // Capitalize first letter
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return capitalized;
    }
  } catch {
    // ignore
  }

  return null;
}
