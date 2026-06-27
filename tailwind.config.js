/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#000000',
        surface: '#0a0a0a',
        panel: '#111111',
        // Dashboard design tokens (skill.md)
        brand: '#2563eb',
        'dash-bg': '#000000',
        'dash-surface': '#0f172a',
        'dash-sunken': '#020617',
        'dash-text': '#e2e8f0',
        'dash-muted': '#64748b',
      },
      boxShadow: {
        'brand-1': 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px',
        'brand-glow': 'rgba(37, 99, 235, 0.3) 0px 0px 20px 0px',
        'brand-raised': 'rgba(37, 99, 235, 0.2) 0px 20px 25px -5px',
        'brand-fab': 'rgba(37, 99, 235, 0.4) 0px 10px 20px -5px',
      },
    },
  },
  plugins: [],
}
