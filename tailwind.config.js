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
          50: '#FDFCF9',
          100: '#FAF9F5',
          200: '#F3F1EB',
          300: '#E7E3D8',
          400: '#D5CFC1',
        },
        ink: {
          950: '#0A0B0D',
          900: '#121316',
          800: '#1C1E23',
          700: '#2C3038',
          600: '#464C58',
          500: '#687080',
          400: '#949CAE',
          300: '#C2C8D4',
          200: '#E4E7ED',
          100: '#F1F3F6',
        },
        gold: {
          50: '#FAF6EB',
          100: '#F4ECD0',
          200: '#E7D7A0',
          300: '#D7BF70',
          400: '#C9A745',
          500: '#B88E2F',
          600: '#9E7422',
          700: '#7E5A1A',
        },
        emerald: {
          50: '#F0F9F5',
          100: '#DCF1E7',
          500: '#1E7E55',
          600: '#166544',
          700: '#105035',
          800: '#0C3D28',
        },
        ruby: {
          50: '#FDF2F2',
          100: '#FCE7E7',
          500: '#D9383A',
          600: '#B82325',
          700: '#8E1719',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(18, 19, 22, 0.04)',
        card: '0 4px 16px -2px rgba(18, 19, 22, 0.05), 0 2px 4px -1px rgba(18, 19, 22, 0.03)',
        elevation: '0 12px 32px -4px rgba(18, 19, 22, 0.08), 0 4px 12px -2px rgba(18, 19, 22, 0.04)',
      },
    },
  },
  plugins: [],
};
