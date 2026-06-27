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
        // Overview tab tokens (skill.md — monochrome, content-first)
        'ov-bg': '#000000',
        'ov-strong': '#111111',
        'ov-raised': '#151515',
        'ov-muted': '#1a1a1a',
        'ov-border': '#242424',
        'ov-fg': '#ffffff',
        'ov-fg-2': '#9d9d9d',
        'ov-fg-3': '#989898',
        // zyo.lol account UI tokens
        'zy-bg': '#0a0a0d',
        'zy-surface': '#0d0d11',
        'zy-card': '#141419',
        'zy-elevated': '#1b1b21',
        'zy-border': '#26262d',
        'zy-fg': '#f4f4f5',
        'zy-fg-2': '#a1a1aa',
        'zy-fg-3': '#71717a',
      },
      boxShadow: {
        'brand-1': 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px',
        'brand-glow': 'rgba(37, 99, 235, 0.3) 0px 0px 20px 0px',
        'brand-raised': 'rgba(37, 99, 235, 0.2) 0px 20px 25px -5px',
        'brand-fab': 'rgba(37, 99, 235, 0.4) 0px 10px 20px -5px',
        'ov-1': 'rgba(0, 0, 0, 0.24) 0px 14px 34px 0px',
      },
    },
  },
  plugins: [],
}
