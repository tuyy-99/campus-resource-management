import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "text-base": { light: "#0f172a", dark: "#e6eef8" },
        "text-muted": { light: "#4b5563", dark: "#9ca3af" },
        "text-heading": { light: "#0b1220", dark: "#f1f5f9" },
        "text-accent": { light: "#8b5cf6", dark: "#7c3aed" },
        "btn-primary": { light: "#7c3aed", dark: "#8b5cf6" },
        "btn-accent": { light: "#06b6d4", dark: "#0891b2" },
        "btn-danger": { light: "#ef4444", dark: "#f87171" },
        "btn-success": { light: "#10b981", dark: "#34d399" },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(139, 92, 246, 0.4)",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      },
      screens: {
        sm: "480px", // small devices
        md: "768px", // tablets
        lg: "1024px", // laptops
        xl: "1280px", // desktops
        "2xl": "1536px", // large desktops
      },
    },
  },
  plugins: [],
};

export default config;
