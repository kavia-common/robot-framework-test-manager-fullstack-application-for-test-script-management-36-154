export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json", useESM: true }]
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "\\.(css)$": "<rootDir>/src/test/styleMock.js"
  }
};
