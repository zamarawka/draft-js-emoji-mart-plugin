module.exports = {
  presets: [
    '@babel/env',
    '@babel/typescript',
  ],
  plugins: [
    '@babel/transform-react-jsx',
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
  ]
};
