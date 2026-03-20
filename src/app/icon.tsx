import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Open box body */}
          <path
            d="M18 52 L18 82 Q18 85 21 85 L79 85 Q82 85 82 82 L82 52 Z"
            stroke="#F5C518"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Box lid left flap */}
          <path
            d="M18 52 L10 38 L50 34 L50 52 Z"
            stroke="#F5C518"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Box lid right flap */}
          <path
            d="M82 52 L90 38 L50 34 L50 52 Z"
            stroke="#F5C518"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Lightbulb body */}
          <path
            d="M44 34 Q37 26 37 18 Q37 8 50 8 Q63 8 63 18 Q63 26 56 34 Z"
            stroke="#F5C518"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Lightbulb base lines */}
          <line x1="44" y1="36" x2="56" y2="36" stroke="#F5C518" strokeWidth="3" strokeLinecap="round" />
          <line x1="45" y1="40" x2="55" y2="40" stroke="#F5C518" strokeWidth="3" strokeLinecap="round" />
          {/* Gear / cog top-right */}
          <circle cx="76" cy="22" r="5" stroke="#F5C518" strokeWidth="2.5" fill="none" />
          <path
            d="M76 14 L76 12 M76 30 L76 32 M84 22 L86 22 M68 22 L66 22 M82 16 L83.4 14.6 M69.6 29.4 L68.2 30.8 M82 28 L83.4 29.4 M69.6 14.6 L68.2 13.2"
            stroke="#F5C518"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Question mark top-left */}
          <path
            d="M20 20 Q20 14 26 14 Q32 14 32 20 Q32 24 26 26 L26 30"
            stroke="#F5C518"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="26" cy="35" r="2" fill="#F5C518" />
          {/* Sparkle right */}
          <path
            d="M87 55 L88.5 59 L93 59 L89.5 62 L91 66 L87 63.5 L83 66 L84.5 62 L81 59 L85.5 59 Z"
            stroke="#F5C518"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Sparkle small left */}
          <path
            d="M13 62 L14 65 L17 65 L14.5 67 L15.5 70 L13 68.5 L10.5 70 L11.5 67 L9 65 L12 65 Z"
            stroke="#F5C518"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
