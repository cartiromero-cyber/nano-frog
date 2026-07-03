/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  // IMPORTANT: preflight is disabled so Tailwind never resets or alters the approved
  // Elytra Shield design system in styles/globals.css. Utilities remain available for new UI.
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
