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
        paper: {
          50: '#FBF9F4',
          100: '#F7F5EE',
          200: '#EFECE2',
          300: '#DDD7C8',
          400: '#C9C1AF',
        },
        card: {
          DEFAULT: '#FAF8F2',
          muted: '#F2EFE7',
        },
        ink: {
          950: '#0F1012',
          900: '#141518',
          800: '#1F2126',
          700: '#333740',
          600: '#575B66',
          500: '#777C88',
          400: '#A1A6B3',
          300: '#D2D5DC',
          200: '#E9EBF0',
          100: '#F4F5F8',
        },
        gold: {
          50: '#FAF6ED',
          100: '#F5EED9',
          200: '#E9DCB3',
          300: '#D7C283',
          400: '#BEA056',
          500: '#A38035',
          600: '#8A6B27',
          700: '#71551A',
        },
        emerald: {
          50: '#F2F7F4',
          100: '#E5EFE9',
          500: '#235840',
          600: '#1A4331',
          700: '#143627',
          800: '#0F281D',
        },
        ruby: {
          50: '#FAF2F2',
          100: '#F9EAEA',
          500: '#A83839',
          600: '#8E2A2B',
          700: '#772021',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        '2xl': '8px',
        '3xl': '8px',
      },
      boxShadow: {
        none: 'none',
        subtle: '0 1px 2px 0 rgba(20, 21, 24, 0.02)',
        card: 'none',
        elevation: 'none',
      },
    },
  },
  plugins: [],
};
