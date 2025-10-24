import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { 
    languageOptions: { 
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      },
      globals: {
        // Browser globals
        document: true,
        window: true,
        localStorage: true,
        console: true,
        alert: true,
        process: true,
        setInterval: true,
        clearInterval: true,
        setTimeout: true,
        clearTimeout: true,
        fetch: true,
        FormData: true,
        
        // Test globals
        test: true,
        expect: true,
        jest: true,
        describe: true,
        it: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true
      }
    },
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: 'React|App',
        argsIgnorePattern: '^_'
      }]
    }
  },
  pluginJs.configs.recommended,
  {
    plugins: { react: pluginReact },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off"
    }
  }
]
