/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta exclusiva do Hero.
        hero: {
          bg: '#050816',
          surface: '#0D1528',
          cyan: '#1BC9E6',
          blue: '#397FF4',
          violet: '#9A72E9',
          white: '#F7F9FF',
          muted: '#AAB9D1'
        },
        // Design system das demais seções.
        night: { DEFAULT: '#050816', 2: '#0B1224', 3: '#111B30' },
        mist: { DEFAULT: '#ECEFEA', 2: '#F6F7F3' },
        ion: { DEFAULT: '#22D3EE', deep: '#0E7490' },
        azure: '#3B82F6',
        iris: '#8B5CF6',
        snow: '#F5F7FB',
        fog: '#A8B6CB',
        graphite: '#3A4557'
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      opacity: {
        8: '0.08',
        12: '0.12',
        14: '0.14',
        18: '0.18',
        35: '0.35',
        45: '0.45'
      }
    }
  },
  plugins: []
};
