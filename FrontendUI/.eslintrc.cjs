module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true, jest: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  settings: {
    react: { version: "detect" }
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^React$" }],
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "error",
    "no-console": ["warn", { "allow": ["error"] }]
  }
};
