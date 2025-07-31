import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

/**
 * Header component displays the application header with optional back navigation
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title text to display in the header
 * @param {Function} [props.onBack] - Optional custom back button handler
 * @param {boolean} [props.showBack=true] - Whether to show the back button
 * @returns {JSX.Element} Rendered header component
 */
// ui/Header.js
const Header = ({ title, showBack = true, onBack }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack(); // Use custom handler if provided
    } else {
      navigate(-1); // Default back behavior
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 p-4 text-white shadow-lg">
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={handleBack} 
            className="mr-3 p-1 rounded-full hover:bg-white/20 text-xl"
            aria-label="Go back"
          >
            <ArrowLeft />
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
};

export { Header };
export default Header;