/** @type {import('tailwindcss').Config} */
module.exports = {

  // Tailwind scanne ces fichiers pour détecter les classes utilisées.
  // Seules les classes trouvées ici seront incluses dans le CSS final.
  // Un fichier non listé = ses classes Tailwind seront supprimées du bundle.
  // "class" = on contrôle le dark mode via une classe CSS
  // (au lieu de "media" qui suivrait le système sans contrôle)
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}"
  ],

  theme: {
    extend: {

      // --- Palette extraite de ta maquette Figma ---
      colors: {
        primary: {
          50:  '#F0EEFF',
          100: '#E0DAFF',
          400: '#8B7FF7',
          500: '#6C63FF',    // violet principal
          600: '#5A52E8',
          700: '#4840D4',
        },
        'bg-base':      '#F8F9FF',
        'bg-surface':   '#FFFFFF',
        'bg-hover':     '#F3F4F6',
        'text-heading': '#1A1A2E',
        'text-body':    '#4B5563',
        'text-muted':   '#9CA3AF',
        'border-soft':  '#E5E7EB',
        'border-card':  '#EEEEFF',
        success:        '#22C55E',
        warning:        '#F59E0B',
        error:          '#EF4444',
        info:           '#3B82F6',
      },

      // --- Typographie ---
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      // --- Ombres ---
      boxShadow: {
        'card':       '0 2px 12px rgba(108, 99, 255, 0.08)',
        'card-hover': '0 8px 30px rgba(108, 99, 255, 0.15)',
        'btn':        '0 4px 15px rgba(108, 99, 255, 0.35)',
      },

      // --- Animations ---
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },

  plugins: [],
};
