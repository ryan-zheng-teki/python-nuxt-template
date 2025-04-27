/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1890ff',
        'primary-light': '#40a9ff',
        'primary-dark': '#096dd9',
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d',
        'gray-light': '#f9f9f9',
        'gray-dark': '#333',
      },
      spacing: {
        sidebar: '250px',
        'sidebar-collapsed': '60px',
      },
      zIndex: {
        sidebar: 100,
        modal: 1000,
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.5em'
            },
            ol: {
              paddingLeft: '1.5em'
            },
            li: {
              marginTop: '0.25em',
              marginBottom: '0.25em'
            },
            pre: {
              backgroundColor: 'rgb(243 244 246)',
              color: '#1f2937',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              margin: '1.5rem 0',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderRadius: '0',
              padding: '0',
              color: 'inherit',
              fontSize: '0.875rem',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              lineHeight: '1.5',
            },
            code: {
              backgroundColor: 'rgb(243 244 246)',
              color: '#374151',
              padding: '0.25rem 0.4rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.panel-tabs': {
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '1rem',
        },
        '.tab': {
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderBottom: '2px solid transparent',
          color: '#666',
        },
        '.tab.active': {
          borderBottomColor: '#1890ff',
          color: '#1890ff',
        },
        '.tab-content': {
          display: 'none',
        },
        '.tab-content.active': {
          display: 'block',
        },
        '.btn': {
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease-in-out',
        },
        '.btn-primary': {
          backgroundColor: '#1890ff',
          color: 'white',
        },
        '.btn-primary:hover': {
          backgroundColor: '#40a9ff',
        },
        '.btn-secondary': {
          backgroundColor: 'white',
          color: '#666',
          border: '1px solid #e5e7eb',
        },
        '.btn-secondary:hover': {
          backgroundColor: '#f9fafb',
        },
        '.btn-small': {
          padding: '0.25rem 0.5rem',
          fontSize: '0.875rem',
        },
        '.form-label': {
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#374151',
        },
        '.form-input, .form-textarea, .form-select': {
          width: '100%',
          padding: '0.5rem',
          borderRadius: '0.25rem',
          border: '1px solid #d1d5db',
          marginBottom: '1rem',
        }
      });
    })
  ],
}
