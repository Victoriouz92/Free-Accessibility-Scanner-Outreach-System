import { useId } from "react";

/**
 * VV Labs triangle-eye mark, ported from the vv-labs.website project.
 * Drawn with currentColor/gradient so it scales crisply without a raster asset.
 */
export function VVLabsLogo({ className = "h-4 w-4" }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 100 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="100" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path d="M50 4L94 86H6L50 4Z" stroke={`url(#${gradientId})`} strokeWidth="6" strokeLinejoin="round" />
      <path
        d="M22 62C22 62 33 44 50 44C67 44 78 62 78 62"
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="60" r="10" fill={`url(#${gradientId})`} />
    </svg>
  );
}
