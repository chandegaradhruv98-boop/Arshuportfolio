export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)', // changeable from Admin > Website (public site) - admin panel has its own
        ink: '#2A211C',
        gold: '#B8923A',
        paper: '#F2EEE9',
        sand: '#E5DDD3',
        espresso: '#2B2019',
        plum: '#241F29',
      },
      fontFamily: {
        display: ['var(--font)', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
