import React, { useEffect, useState } from "react";
import { db } from "../Firebase/firebase";
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Bell, Mail, Phone, Hospital, Award, Globe2 } from "lucide-react";

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  // Step 1: Fetch current user and doctor profile
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);

    const fetchDoctorProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "doctors", currentUser.uid);
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
    if (!doctor) return;

    try {
      const incomingRequestsRef = collection(db, "doctors", doctor.uid, "incoming requests");
      const incomingRequestsSnapshot = await getDocs(incomingRequestsRef);

      if (incomingRequestsSnapshot.empty) {
        console.log("No incoming requests.");
        setIncomingRequests([]);
        return;
      }

      const requests = [];
      incomingRequestsSnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });

      setIncomingRequests(requests);
      setShowRequests(true); // Show the modal or list
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
    }
  };

  // Step 3: Handle accept and reject actions
  const handleAcceptRequest = async (requestId) => {
    try {
      const requestRef = doc(db, "doctors", doctor.uid, "incoming requests", requestId);

      // Example: Move the request to an "accepted requests" collection
      const requestDoc = await getDoc(requestRef);
      const requestData = requestDoc.data();
      const acceptedRequestsRef = collection(db, "doctors", doctor.uid, "accepted requests");
      await updateDoc(requestRef, { status: "accepted" });

      console.log("Request accepted:", requestData);

      // Remove from UI
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const requestRef = doc(db, "doctors", doctor.uid, "incoming requests", requestId);

      // Example: Delete the request from Firestore
      await deleteDoc(requestRef);

      console.log("Request rejected.");

      // Remove from UI
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
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
      </div>

      {/* Incoming Requests Modal or Section */}
      {showRequests && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Incoming Requests</h3>
          {incomingRequests.length === 0 ? (
            <p>No requests at the moment.</p>
          ) : (
            incomingRequests.map((request) => (
              <div key={request.id} className="p-4 border-b last:border-b-0">
                <p className="mb-2">Name: {request.name}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
