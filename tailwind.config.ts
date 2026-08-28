import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Inter"', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: '#0055ff',
        'primary-foreground': '#ffffff',
        secondary: '#1a1a1a',
        'secondary-foreground': '#ffffff',
        muted: '#1e1e1e',
        'muted-foreground': '#a3a3a3',
        accent: '#0044cc',
        'accent-foreground': '#ffffff',
        destructive: '#ff3333',
        'destructive-foreground': '#ffffff',
        border: '#262626',
        input: '#262626',
        ring: '#0055ff',
      },
      borderRadius: {
        'DEFAULT': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}

export default config
