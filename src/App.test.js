import React from 'react';

test('App component exists', () => {
  // Simple test to ensure the app module can be imported
  const App = require('./App').default;
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
});
