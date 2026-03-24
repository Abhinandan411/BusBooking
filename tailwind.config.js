/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
     "./App.tsx",
     "./components/**/*.{js,jsx,ts,tsx}",
     "./src/**/*.{js,jsx,ts,tsx}", 
    ],
     
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        okra:[
          'Okra-Regular',
          'Okra-Medium',
          'Okra-Bold',
          'Okra-MediumLight',
          'Okra-SemiBold',
          'Okra-ExtraBold'
        ]
      },
      colors: {
        'primary': '#FC5431',
        'secondary': '#FDBB8A',
        'tertiary': '#CF3239',
      }
    },
  },
  plugins: [],
}