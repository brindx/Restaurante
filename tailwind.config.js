/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Aquí conectamos las fuentes de Google con Tailwind
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        // Definimos la paleta premium para usarla siempre igual
        premium: {
          black: '#0a0a0a',
          dark: '#1a1a1a',
          gold: '#d4af37', // Un dorado elegante en lugar del rojo anterior
          cream: '#f4f1ea',
          gray: '#333333'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
