import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Import context providers
import { AuthProvider } from './context/AuthContext';
import { JobsProvider } from './context/JobsContext';
import { TransactionProvider } from './context/TransactionContext';

// Import main app router
import AppRouter from './components/AppRouter';

/**
 * Main application entry point with context provider hierarchy
 * 
 * Provider structure:
 * AuthProvider (top level - manages user authentication)
 *   └── JobsProvider (depends on user data from AuthProvider)
 *       └── TransactionProvider (depends on user data, links to jobs)
 *           └── AppRouter (has access to all contexts)
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <JobsProvider>
        <TransactionProvider>
          <AppRouter />
        </TransactionProvider>
      </JobsProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
