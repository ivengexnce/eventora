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
        ivory: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#EAE2D7',
          300: '#DDD2C3',
          400: '#C7B7A2',
        },
        charcoal: {
          950: '#110F0E',
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
          200: '#E7E5E4',
          100: '#F5F5F4',
        },
        terracotta: {
          50: '#FDF4F0',
          100: '#FAE8E0',
          200: '#F5D1C2',
          300: '#ECB19C',
          400: '#DF8B6E',
          500: '#C85A32',
          600: '#B04924',
          700: '#923A1B',
          800: '#762F18',
          900: '#612918',
        },
        champagne: {
          50: '#FAF6ED',
          100: '#F4ECD4',
          200: '#E9D8A5',
          300: '#DDC374',
          400: '#D4AF37',
          500: '#B89222',
          600: '#9B7418',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 1px 2px -1px rgba(28, 25, 23, 0.04)',
        card: '0 4px 20px -2px rgba(28, 25, 23, 0.05), 0 2px 6px -2px rgba(28, 25, 23, 0.03)',
        floating: '0 12px 36px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
      },
    },
  },
  plugins: [],
};

