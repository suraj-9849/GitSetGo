import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Stethoscope, Building2, Phone, Languages } from 'lucide-react';
import { docreatefordoc } from '../Auth_functions/allauth';
import { useNavigate } from 'react-router-dom';
import { docreate } from '../Auth_functions/allauth';

const INDIAN_LANGUAGES = [
  'Hindi',
  'Bengali',
  'Telugu',
  'Marathi',
  'Tamil',
  'Urdu',
  'Gujarati',
  'Kannada',
  'Malayalam',
  'Odia',
  'Punjabi',
  'Assamese',
];

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    specialization: '',
    hospital: '',
    licenseNumber: '',
  });

  const handleLanguageSelect = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
    } else if (selectedLanguages.length < 3) {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if(role == 'doctor')
    {
      try {
        await docreatefordoc(
          formData.email,
          formData.password,
          formData.fullName,
          formData.phone,
          formData.specialization,
          formData.licenseNumber,
          formData.hospital,
          selectedLanguages
        );
        navigate('/'); // Navigate only if no errors occur
      } catch (error) {
        alert(error.message || "An error occurred. Please try again."); // Display the error message
      }
      
    }
      else{
        try {
          await docreate(
            formData.email,
            formData.password,
            formData.phone,
            selectedLanguages,
            formData.fullName
          );
          navigate('/'); // Navigate only if no errors occur
        } catch (error) {
          alert(error.message || "An error occurred. Please try again."); // Display the error message
        }
        
      }
  };

  return (
    <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-rose-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-rose-600 hover:text-rose-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            type="button"
            className={`flex items-center px-4 py-2 rounded-lg ${
              role === 'patient'
                ? 'bg-rose-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setRole('patient')}
          >
            <User className="h-5 w-5 mr-2" />
            Patient
          </button>
          <button
            type="button"
            className={`flex items-center px-4 py-2 rounded-lg ${
              role === 'doctor'
                ? 'bg-rose-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setRole('doctor')}
          >
            <Stethoscope className="h-5 w-5 mr-2" />
            Doctor
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Languages (Max 3)
              </label>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="relative w-full bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Languages className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="block truncate">
                    {selectedLanguages.length > 0
                      ? selectedLanguages.join(', ')
                      : 'Select languages (max 3)'}
                  </span>
                </button>
                {showLanguageDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {INDIAN_LANGUAGES.map((language) => (
                      <div
                        key={language}
                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 ${
                          selectedLanguages.includes(language)
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-gray-900'
                        }`}
                        onClick={() => handleLanguageSelect(language)}
                      >
                        <span className="block truncate">{language}</span>
                        {selectedLanguages.includes(language) && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-rose-600">
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Selected: {selectedLanguages.length}/3
              </p>
            </div>

            {role === 'doctor' && (
              <>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Stethoscope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Your medical specialization"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">
                    Hospital/Clinic
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="hospital"
                      name="hospital"
                      type="text"
                      required
                      value={formData.hospital}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Your hospital or clinic"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    Medical License Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Your medical license number"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}