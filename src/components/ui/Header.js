import React from 'react';

/**
 * Header component displays the application header with optional back navigation
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title text to display in the header
 * @param {Function} props.onBack - Callback function to handle back button click
 * @param {boolean} [props.showBack=true] - Whether to show the back button
 * @returns {JSX.Element} Rendered header component
 */
const Header = ({ title, onBack, showBack = true }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 p-4 text-white shadow-lg">
      <div className="flex items-center">
        {showBack && (
          <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-white/20 text-xl">
            ←
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
};

export { Header };
export default Header;