import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, Globe, X, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/firebase';
import GoogleTranslate from '../Google/GoogleTranslate'; // Create this component

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser ? currentUser : null);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        setUser(null);
        navigate('/');
      })
      .catch((error) => {
        console.error('Sign out error:', error);
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
            <Link to="/image" className="text-gray-600 hover:text-rose-600">
              WoundDetection
            </Link>
            <Link to="/symptoms" className="text-gray-600 hover:text-rose-600">
              Check Symptoms
            </Link>
            
            {/* Google Translate Component */}
            <div className="relative">
              <GoogleTranslate />
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
              to="/image"
              className="block px-3 py-2 text-gray-600 hover:text-rose-600"
            >
              WoundDetection
            </Link>
            <Link
              to="/symptoms"
              className="block px-3 py-2 text-gray-600 hover:text-rose-600"
            >
              Check Symptoms
            </Link>
            
            {/* Google Translate Component for Mobile */}
            <div className="px-3 py-2">
              <GoogleTranslate />
            </div>

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


