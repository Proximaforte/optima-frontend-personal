/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js,ts}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                'euclid': ['Euclid Circular A'],
            }
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
};


//Custom Fonts:  https://chat.openai.com/c/6f907ebd-9eae-4648-8e03-d334734deb73