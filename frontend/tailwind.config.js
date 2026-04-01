/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Bebas Neue'", "'Oswald'", "'Arial Narrow'", "sans-serif"],
        body: ["'Inter'", "'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Courier New'", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        drope: {
          red: "#FF2D00",
          black: "#0A0A0A",
          white: "#F5F5F5",
        },
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(110%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "slide-up": "slide-up 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};