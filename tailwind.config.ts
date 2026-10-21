import type { Config } from "tailwindcss";

/**
 * Lovin Flowers design tokens.
 * Palette is drawn from the logo: the charcoal wordmark (#231F20) and the
 * red butterfly (#AE3624 / #CC3D27 / #620C09), set on a warm linen ground.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        linen: "#F7F2EC", // page background
        shell: "#EFE6DC", // secondary surface, image placeholders
        blush: "#EBCFC4", // soft accent, from the wrapping papers
        ink: {
          DEFAULT: "#231F20", // logo charcoal — main text
          soft: "#5E5557", // secondary text (6.3:1 on linen)
          faint: "#8C8385", // tertiary, decorative only
        },
        wing: {
          DEFAULT: "#AE3624", // butterfly red — primary accent (5.6:1 on linen)
          bright: "#CC3D27", // hover / highlights
          deep: "#3B1210", // oxblood — dark sections
        },
        line: "rgba(35, 31, 32, 0.14)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // fluid display sizes for editorial headings
        "display-xl": ["clamp(3.4rem, 11vw, 11.5rem)", { lineHeight: "0.88", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.8rem, 7.5vw, 7.5rem)", { lineHeight: "0.92", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(2.2rem, 5vw, 4.75rem)", { lineHeight: "1", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.75rem, 3vw, 2.6rem)", { lineHeight: "1.08" }],
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.22em" }],
      },
      spacing: {
        gutter: "clamp(1.25rem, 4vw, 3.5rem)",
        section: "clamp(6rem, 14vw, 13rem)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        frame: "1600px",
      },
    },
  },
  plugins: [],
};

export default config;
