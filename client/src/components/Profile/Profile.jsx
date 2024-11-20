import React, { useEffect, useState } from "react";
import { db } from "../Firebase/firebase";
import { doc, getDoc, collection, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Bell, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate=useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [currentClients, setCurrentClients] = useState([]);  // State for current clients
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

  // Step 2: Fetch Current Clients
  useEffect(() => {
    const fetchCurrentClients = async () => {
      if (!doctor) return;

      try {
        const currentClientsRef = collection(db, "doctors", doctor.uid, "current_clients");
        const currentClientsSnapshot = await getDocs(currentClientsRef);

        if (currentClientsSnapshot.empty) {
          console.log("No current clients.");
          setCurrentClients([]);
          return;
        }

        const clients = [];
        currentClientsSnapshot.forEach((doc) => {
          clients.push({ id: doc.id, ...doc.data() });
        });

        setCurrentClients(clients);
      } catch (error) {
        console.error("Error fetching current clients:", error);
      }
    };

    fetchCurrentClients();
  }, [doctor]);

  // Step 3: Handle "Incoming Requests" click
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

  // Step 4: Handle accept and reject actions
  const handleAcceptRequest = async (requestId) => {
    try {
      console.log("Accepting request:", requestId);
      const requestRef = doc(db, "doctors", doctor.uid, "incoming requests", requestId);
  
      const requestDoc = await getDoc(requestRef);
      if (!requestDoc.exists()) {
        console.error("Request document does not exist.");
        return;
      }
  
      const requestData = requestDoc.data();
      console.log("Request Data:", requestData);
  
      const currentClientsRef = doc(db, "doctors", doctor.uid, "current_clients", requestId);
      console.log("Current Clients Ref Path:", currentClientsRef.path);
  
      await setDoc(currentClientsRef, requestData);
      console.log("Request successfully added to current_clients.");
  
      await deleteDoc(requestRef);
      console.log("Request successfully removed from incoming requests.");
  
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error handling accept request:", error);
    }
  };
  

  const handleRejectRequest = async (requestId) => {
    try {
      const requestRef = doc(db, "doctors", doctor.uid, "incoming requests", requestId);

      // Delete the request from "incoming requests"
      await deleteDoc(requestRef);

      console.log("Request rejected.");

      // Remove from UI
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Handle starting a video call
  const handleStartVideoCall = (clientId) => {
    console.log(`Starting video call with client: ${clientId}`);
    navigate('/videocam');
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
                <p className="mb-2">Name: {request.id}</p>
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

      {/* Current Clients Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Current Clients</h3>
        {currentClients.length === 0 ? (
          <p>No current clients.</p>
        ) : (
          currentClients.map((client) => (
            <div key={client.id} className="p-4 border-b last:border-b-0">
              <p className="mb-2">Name: {client.id}</p>
              <button
                onClick={() => handleStartVideoCall(client.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Start Video Call
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
