import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
        deepPurple: {
					DEFAULT:"#8D3DB3",
          100: '#F0E5F5', // Lighter variant
          200: '#D9BBE5',
          300: '#C090D4',
          400: '#A666C4',
          500: '#8D3DB3', // Base deepPurple
          600: '#752F94',
          700: '#5D2274',
          800: '#441655',
          900: '#2E073F', // Darkest shade
        },
        purple: {
					DEFAULT:"#AF34EF",
          100: '#F5E3FB',
          200: '#E4B8F8',
          300: '#D28CF5',
          400: '#C160F2',
          500: '#AF34EF', // Base purple
          600: '#921ACC',
          700: '#751299',
          800: '#580C66',
          900: '#3C0433',
        },
        lightPurple: {
					DEFAULT:"#E149FF",
          100: '#FBE3FF',
          200: '#F5BAFF',
          300: '#EF92FF',
          400: '#E86AFF',
          500: '#E149FF', // Base lightPurple
          600: '#B637CC',
          700: '#8A2999',
          800: '#5F1B66',
          900: '#330D33',
        },
        lavender: {
					DEFAULT:"#F0B8FF",
          100: '#FDF5FF',
          200: '#FAE6FF',
          300: '#F7D7FF',
          400: '#F3C7FF',
          500: '#F0B8FF', // Base lavender
          600: '#C090CC',
          700: '#906999',
          800: '#604066',
          900: '#301933',
        },
      },
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			keyframes: {
				"blink": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0" },
				},
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"dot-blink-1": "blink 1.5s infinite 0s",
				"dot-blink-2": "blink 1.5s infinite 0.5s",
				"dot-blink-3": "blink 1.5s infinite 1s",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config