"use client";

import { useState } from "react";

/**
 * RemediationTool Component
 *
 * WHAT IT IS: The main UI for the image remediation workflow.
 * WHY IT EXISTS: Lets you scan a client site, get AI suggestions, review, and export.
 *
 * Flow:
 * 1. Enter URL → scan for images without alt text
 * 2. AI generates descriptions for each image
 * 3. You review/edit each one
 * 4. Export as code snippets or a summary document
 */

interface ImageIssue {
  src: string;
  displaySrc?: string;
  currentAlt: string | null;
  suggestedAlt: string;
  context: string; // surrounding HTML context
  selector: string; // CSS selector to find it
  status: "pending" | "approved" | "edited";
  pageUrl: string;
}

export function RemediationTool() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<ImageIssue[]>([]);
  const [error, setError] = useState("");
  const [scanComplete, setScanComplete] = useState(false);
  const [singlePage, setSinglePage] = useState(false);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setImages([]);
    setScanComplete(false);

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setScanning(true);

    try {
      // Step 1: Find all images without alt text
      const res = await fetch("/api/admin/find-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl, singlePage }),
      });

      if (!res.ok) throw new Error("Scan failed");

      const data = await res.json();
      const imagesWithStatus = data.images.map((img: any) => ({
        ...img,
        suggestedAlt: "",
        status: "pending",
      }));
      setImages(imagesWithStatus);
      setScanComplete(true);

      // Auto-generate descriptions immediately
      if (imagesWithStatus.length > 0) {
        setGenerating(true);
        try {
          const genRes = await fetch("/api/admin/generate-alt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              images: imagesWithStatus.map((img: any) => ({
                src: img.src,
                context: img.context,
                pageUrl: img.pageUrl,
              })),
            }),
          });
          if (genRes.ok) {
            const genData = await genRes.json();
            setImages((prev) =>
              prev.map((img, i) => ({
                ...img,
                suggestedAlt: genData.descriptions[i] || img.suggestedAlt,
              }))
            );
          }
        } catch {
          // Fallback silently — user can still type manually
        } finally {
          setGenerating(false);
        }
      }
    } catch {
      setError("Failed to scan the website. Make sure the URL is accessible.");
    } finally {
      setScanning(false);
    }
  }

  async function handleGenerateDescriptions() {
    setGenerating(true);

    try {
      const res = await fetch("/api/admin/generate-alt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map((img) => ({
            src: img.src,
            context: img.context,
            pageUrl: img.pageUrl,
          })),
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();

      // Merge AI suggestions back into our state
      setImages((prev) =>
        prev.map((img, i) => ({
          ...img,
          suggestedAlt: data.descriptions[i] || "Description not available",
        }))
      );
    } catch {
      setError("Failed to generate descriptions. Check your AI API key.");
    } finally {
      setGenerating(false);
    }
  }

  function handleEditAlt(index: number, newAlt: string) {
    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, suggestedAlt: newAlt, status: "edited" } : img
      )
    );
  }

  function handleApprove(index: number) {
    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, status: "approved" } : img
      )
    );
  }

  function handleApproveAll() {
    setImages((prev) =>
      prev.map((img) => ({ ...img, status: "approved" }))
    );
  }

  function handleExport() {
    const approved = images.filter((img) => img.status === "approved" || img.status === "edited");
    const exportText = approved
      .map((img, i) =>
        `[${i + 1}] Page: ${img.pageUrl}\n    Selector: ${img.selector}\n    Image: ${img.displaySrc || img.src}\n    Alt text: "${img.suggestedAlt}"\n`
      )
      .join("\n");

    const header = `AccessCheck - Alt Text Fixes\nGenerated: ${new Date().toISOString()}\nTotal: ${approved.length} images\n${"=".repeat(50)}\n\n`;

    // Download as text file
    const blob = new Blob([header + exportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alt-text-fixes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const approvedCount = images.filter((img) => img.status === "approved" || img.status === "edited").length;

  return (
    <div>
      {/* URL Input */}
      <form onSubmit={handleScan} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Client website URL (e.g. example.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-surface text-base"
            disabled={scanning}
          />
          <button
            type="submit"
            disabled={scanning || !url.trim()}
            className="px-6 py-3 rounded-lg bg-primary text-white font-semibold
                       hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {scanning ? "Scanning..." : "Find images"}
          </button>
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={singlePage}
            onChange={(e) => setSinglePage(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Single page only (don&apos;t scan internal links)
        </label>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {scanComplete && images.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-800 font-medium">
            ✅ No images with missing alt text found! The site looks good.
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div>
          {/* Summary + Actions */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted">
              Found <strong>{images.length}</strong> images without alt text.
              {approvedCount > 0 && ` (${approvedCount} approved)`}
            </p>
            <div className="flex gap-2">
              {images.some((img) => !img.suggestedAlt) && (
                <button
                  onClick={handleGenerateDescriptions}
                  disabled={generating}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium
                             hover:bg-primary-hover disabled:opacity-50 transition-colors"
                >
                  {generating ? "Generating..." : "🤖 Generate AI descriptions"}
                </button>
              )}
              {approvedCount > 0 && (
                <button
                  onClick={handleExport}
                  className="px-4 py-2 rounded-lg border border-primary text-primary text-sm
                             font-medium hover:bg-primary-light transition-colors"
                >
                  📥 Export ({approvedCount})
                </button>
              )}
              {images.some((img) => img.suggestedAlt && img.status === "pending") && (
                <button
                  onClick={handleApproveAll}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium
                             hover:border-primary transition-colors"
                >
                  ✓ Approve all
                </button>
              )}
            </div>
          </div>

          {/* Image list */}
          <div className="space-y-4">
            {images.map((img, index) => (
              <div
                key={index}
                className={`bg-surface rounded-xl border p-4 ${
                  img.status === "approved" || img.status === "edited"
                    ? "border-green-300 bg-green-50/50"
                    : "border-border"
                }`}
              >
                <div className="flex gap-4">
                  {/* Image preview */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={img.src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        (e.target as HTMLImageElement).alt = "Cannot load";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted truncate mb-1">{img.displaySrc || img.src}</p>
                    <p className="text-xs text-muted mb-2">Page: {img.pageUrl}</p>

                    {/* Alt text input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={img.suggestedAlt}
                        onChange={(e) => handleEditAlt(index, e.target.value)}
                        placeholder={generating ? "Generating..." : "Alt text description..."}
                        className="flex-1 px-3 py-2 rounded border border-border text-sm bg-white"
                      />
                      <button
                        onClick={() => handleApprove(index)}
                        disabled={!img.suggestedAlt}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          img.status === "approved" || img.status === "edited"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700"
                        }`}
                      >
                        {img.status === "approved" || img.status === "edited" ? "✓" : "Approve"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
