/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  prefix: "",
  safelist: ['bg-lightSecondary'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.9rem',
        sm: '0.9rem',
        lg: '1rem',
        xl: '1rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ["Oxanium", "sans-serif"],
      },
      screens: {
        '480p': { raw: '(min-height: 480px) and (max-height: 719px)' },
        '720p': { raw: '(min-height: 720px) and (max-height: 1079px)' },
        '1080p': { raw: '(min-height: 1080px) and (max-height: 1439px)' },
        '2k': { raw: '(min-height: 1440px) and (max-height: 2159px)' },
        '4k': { raw: '(min-height: 2160px)' },
        '360p': { raw: '(min-height: 300px) and (max-height: 640px)' },
        '180p': { raw: '(min-height: 180px) and (max-height: 320px)' },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        lightPrimary: '#9535b426',
        lightSecondary: '#3B3B3B',
        lighterSecondary: '#505050',
        markerButton: '#BDBDBD',
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}