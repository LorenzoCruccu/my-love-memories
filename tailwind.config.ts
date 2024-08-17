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
        deepPurple: '#2E073F', // Deep Purple
        purple: '#7A1CAC',      // Purple
        lightPurple: '#AD49E1', // Light Purple
        lavender: '#EBD3F8',    // Lavender
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