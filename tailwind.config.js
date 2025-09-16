/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-red": "#DC2626",
        "secondary-red": "#EF4444",
        "soft-red": "#FEE2E2",
        "modern-gray": "#6B7280",
        "soft-black": "#111827",
      },
    },
  },
  plugins: [],
};
