/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#0F0B1E',
          800: '#1A1430',
          700: '#2A2342',
        },
        brand: {
          orange: '#FF6B3D',
          magenta: '#E63985',
          violet: '#7C3AED',
          indigo: '#4F46E5',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          sky: '#0EA5E9',
        },
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(135deg, #FF6B3D 0%, #E63985 50%, #7C3AED 100%)',
        'brand-grad-soft': 'linear-gradient(135deg, #FFE4D6 0%, #FFD6E5 50%, #E9D5FF 100%)',
        'mesh': 'radial-gradient(at 20% 10%, #FFE4D6 0px, transparent 50%), radial-gradient(at 80% 0%, #FFD6E5 0px, transparent 50%), radial-gradient(at 50% 50%, #E9D5FF 0px, transparent 50%)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
