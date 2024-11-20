import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, Globe, X, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/firebase'; // Import Firebase authentication

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [user, setUser] = useState(null); // State to track logged-in user

  // Listen for auth state changes and update the `user` state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user when logged in
      } else {
        setUser(null); // Reset user when logged out
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      setUser(null); // Reset the user state on sign-out
      alert('Signed out successfully!');
      navigate('/');
    }).catch((error) => {
      console.error('Sign out error:', error);
      alert('Error signing out');
    });
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-600" />
              <span className="text-xl font-bold text-gray-800">RuralCare</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/consultation" className="text-gray-600 hover:text-rose-600">
              Find Doctor
            </Link>
            <Link to="/symptoms" className="text-gray-600 hover:text-rose-600">
              Check Symptoms
            </Link>
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-600 hover:text-rose-600"
                onClick={() => setLanguage(language === 'English' ? 'हिंदी' : 'English')}
              >
                <Globe className="h-5 w-5" />
                <span>{language}</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="inline-flex items-center text-gray-600 hover:text-rose-600"
                  >
                    <User className="h-5 w-5 mr-1" />
                    Profile
                  </Link>
                  <button
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center text-gray-600 hover:text-rose-600"
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-rose-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/consultation"
              className="block px-3 py-2 text-gray-600 hover:text-rose-600"
            >
              Find Doctor
            </Link>
            <Link
              to="/symptoms"
              className="block px-3 py-2 text-gray-600 hover:text-rose-600"
            >
              Check Symptoms
            </Link>
            <button
              onClick={() => setLanguage(language === 'English' ? 'हिंदी' : 'English')}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-rose-600 w-full"
            >
              <Globe className="h-5 w-5" />
              <span>{language}</span>
            </button>
            <div className="border-t border-gray-200 pt-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-600 hover:text-rose-600"
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-rose-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block mx-3 mt-1 px-3 py-2 bg-rose-600 text-white text-center rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
