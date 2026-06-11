module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,svg,json,ico,woff,woff2,ttf}'
  ],
  swDest: 'dist/sw.js',
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ]
};
