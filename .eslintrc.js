module.exports = {
  root: true,
  "env": {
    "browser": true,
    "node": true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
  ],
  rules: {
    'import/no-anonymous-default-export': 0
  }
};
