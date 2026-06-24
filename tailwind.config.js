/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-18px) scale(1.04)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        resultPop: {
          "0%": { opacity: "0", transform: "scale(0.85) translateY(16px)" },
          "60%": { opacity: "1", transform: "scale(1.04) translateY(-4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(99,102,241,0.25)" },
          "50%": { boxShadow: "0 0 48px rgba(139,92,246,0.45)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(24px, -20px) scale(1.06)" },
          "66%": { transform: "translate(-16px, 12px) scale(0.96)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 2.8s ease-in-out infinite",
        resultPop: "resultPop 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        glowPulse: "glowPulse 2s ease-in-out infinite",
        blob: "blob 12s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
