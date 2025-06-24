/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./packages/core/**/*.{ts,tsx}'],
  prefix: 'v0-',
  corePlugins: {
    // Disable preflight to avoid global style conflicts with consumer apps
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
