/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	fontSize: {
  		xs: [
  			'0.75rem',
  			{
  				lineHeight: '1rem'
  			}
  		],
  		sm: [
  			'0.875rem',
  			{
  				lineHeight: '1.25rem'
  			}
  		],
  		base: [
  			'0.875rem',
  			{
  				lineHeight: '1.5rem'
  			}
  		],
  		lg: [
  			'1rem',
  			{
  				lineHeight: '1.75rem'
  			}
  		],
  		xl: [
  			'1.125rem',
  			{
  				lineHeight: '1.75rem'
  			}
  		],
  		'2xl': [
  			'1.25rem',
  			{
  				lineHeight: '2rem'
  			}
  		],
  		'3xl': [
  			'1.5rem',
  			{
  				lineHeight: '2rem'
  			}
  		],
  		'4xl': [
  			'1.875rem',
  			{
  				lineHeight: '2.25rem'
  			}
  		],
  		'5xl': [
  			'2.25rem',
  			{
  				lineHeight: '2.5rem'
  			}
  		],
  		'6xl': [
  			'3rem',
  			{
  				lineHeight: '1'
  			}
  		]
  	},
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Plus Jakarta Sans',
  				'sans-serif'
  			]
  		},
  		keyframes: {
  			"slide-down": {
  				from: { height: "0" },
  				to: { height: "var(--radix-collapsible-content-height)" },
  			},
  			"slide-up": {
  				from: { height: "var(--radix-collapsible-content-height)" },
  				to: { height: "0" },
  			},
  		},
  		animation: {
  			"slide-down": "slide-down 0.2s ease-out",
  			"slide-up": "slide-up 0.2s ease-out",
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

