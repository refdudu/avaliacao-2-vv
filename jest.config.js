/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Indica que o ambiente de teste é baseado no Node.js
  testEnvironment: "node",

  // Preset que configura o Jest para usar o ts-jest para transpilar arquivos TypeScript
  preset: "ts-jest",

  // Padrão de arquivos que o Jest deve considerar como testes
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // Mapeia os aliases de importação definidos no tsconfig.json para que o Jest os entenda
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/coverage/",
    "server.ts",
    "/e2e/",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage/",
    "server.ts",
    "/e2e/",
  ],

  // Ignora o server.ts no relatório de cobertura
  // Configuração opcional para coletar a cobertura de testes
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
};
