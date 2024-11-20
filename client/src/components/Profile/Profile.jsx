// import React, { useEffect, useState } from 'react';
// import { db } from '../Firebase/firebase';
// import { doc, getDoc } from 'firebase/firestore';
// // import { useAuth } from '../';  // Assuming you have an auth context for Firebase auth

// const Profile = () => {
//   const { user } = useAuth(); // Assuming you're using an auth context to get the logged-in user
//   const [doctor, setDoctor] = useState(null);

//   useEffect(() => {
//     const fetchDoctorProfile = async () => {
//       if (user) {
//         try {
//           const docRef = doc(db, 'doctors', user.uid); // Fetch doctor details using the uid
//           const docSnap = await getDoc(docRef);
          
//           if (docSnap.exists()) {
//             setDoctor(docSnap.data());
//           } else {
//             console.log("No such document!");
//           }
//         } catch (error) {
//           console.error("Error fetching document:", error);
//         }
//       }
//     };

//     fetchDoctorProfile();
//   }, [user]);

//   if (!doctor) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="profile-container p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">{doctor.displayName}'s Profile</h2>
//       <div className="profile-details space-y-4">
//         <p><strong>Email:</strong> {doctor.email}</p>
//         <p><strong>Hospital:</strong> {doctor.hospital}</p>
//         <p><strong>Phone:</strong> {doctor.phone}</p>
//         <p><strong>Specialization:</strong> {doctor.specialization}</p>
//         <p><strong>License:</strong> {doctor.license}</p>
//         <p><strong>Languages Spoken:</strong></p>
//         <ul className="list-disc pl-5">
//           {doctor.languages.map((language, index) => (
//             <li key={index}>{language}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Profile;
