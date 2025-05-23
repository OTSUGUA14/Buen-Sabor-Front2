/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx,html}",
    ],
    theme: {
        extend: {
            fontFamily: {
                lato: ['Lato', 'sans-serif'],
                righteous: ['Righteous', 'cursive'],
            },
            colors: {
                'orange-highlight': '#FFA500', // ejemplo para tu color naranja destacado
            },
        },
    },
    plugins: [],
}
