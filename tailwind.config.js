/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          base: "#09090b",
          raised: "#111113",
          elevated: "#19191d",
          sunken: "#060608",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.05)",
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          strong: "rgba(255, 255, 255, 0.12)",
        },
        accent: {
          DEFAULT: "#d4a044",
          hover: "#e0b25c",
          muted: "rgba(212, 160, 68, 0.1)",
          subtle: "rgba(212, 160, 68, 0.06)",
        },
        txt: {
          primary: "#ededef",
          secondary: "#85858a",
          tertiary: "#4e4e52",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "14px",
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        18: "4.5rem",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.25)",
        "card-hover": "0 4px 24px rgba(0, 0, 0, 0.35)",
        glow: "0 4px 16px rgba(212, 160, 68, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
