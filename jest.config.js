module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-pdf|@react-pdf/.*)/)'
  ],
  moduleNameMapper: {
    '^@react-pdf/renderer$': '<rootDir>/src/__mocks__/@react-pdf/renderer.js'
  }
};