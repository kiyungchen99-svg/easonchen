/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FC72FF',
          purple: '#7B61FF',
          blue: '#4C82FB',
          dark: '#0D0E14',
          card: '#13141F',
          border: '#2A2B3D',
          muted: '#5D6785',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FC72FF 0%, #7B61FF 50%, #4C82FB 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(124,97,255,0.08) 0%, rgba(76,130,251,0.04) 100%)',
        'gradient-hero': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(252,114,255,0.25) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(76,130,251,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.4)',
        'glow-pink': '0 0 40px rgba(252,114,255,0.3)',
        'glow-purple': '0 0 40px rgba(123,97,255,0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
