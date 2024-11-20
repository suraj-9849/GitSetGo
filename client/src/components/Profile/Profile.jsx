import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Bell, Mail, Phone, Hospital, Award, Globe2 } from 'lucide-react';

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  
  // Step 1: Fetch current user and doctor profile
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);

    const fetchDoctorProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'doctors', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setDoctor(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };

    fetchDoctorProfile();
  }, []);

  // Step 2: Handle "Incoming Requests" click
  const handleIncomingRequests = async () => {
    if (!doctor) return; // Ensure doctor data is available

    try {
      const incomingRequestsRef = collection(db, 'doctors', doctor.uid, 'incoming requests');
      const incomingRequestsSnapshot = await getDocs(incomingRequestsRef);
      
      if (incomingRequestsSnapshot.empty) {
        console.log('No incoming requests.');
        return;
      }

      incomingRequestsSnapshot.forEach((doc) => {
        console.log('Request:', doc.data()); // Logs the incoming request details
      });
    } catch (error) {
      console.error('Error fetching incoming requests:', error);
    }
  };

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={handleIncomingRequests}
        >
          <Bell className="h-4 w-4" />
          Incoming Requests
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {doctor.displayName?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{doctor.displayName}</h2>
              <p className="text-gray-500">{doctor.specialization}</p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Hospital className="h-5 w-5" />
                  <span>{doctor.hospital}</span>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Professional Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Award className="h-5 w-5" />
                  <span>License: {doctor.license}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Globe2 className="h-5 w-5" />
                  <span>Languages:</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-8">
                  {doctor.languages.map((language, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
