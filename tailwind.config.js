export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',   // admin can change this from the dashboard
        ink: '#1E2250',
        gold: '#B8923A',
        paper: '#F6F5FA',
      },
      fontFamily: {
        display: ['var(--font)', 'serif'], // admin can change this from the dashboard
        body: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
