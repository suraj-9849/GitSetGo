import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";

export const docreate = async (email, password, phone, languages, name) => {
    const db = getFirestore();

    try {
        // Create user with email and password
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Access the user's UID directly from the result
        const user = result.user;
        const ref = doc(db, "patients", user.uid);

        // Set the user's document in Firestore
        await setDoc(ref, {
            displayName: name,
            uid: user.uid,
            phone: phone,
            email: email,
            password: password,
            languages : languages
        });

        console.log("User created and details set in Firestore!");
    } catch (error) {
        console.log("There was an error setting the details:", error.message);
    }
};

export const docreatefordoc = async (
    email, 
    password, 
    fullname, 
    phone, 
    specialization, 
    license, 
    hospital, 
    languages
) => {
    const db = getFirestore();

    try {
        // Normalize specialization name to uppercase
        const normalizedSpecialization = specialization.toUpperCase();

        // Create user with email and password
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Reference for the doctor's main collection
        const ref = doc(db, "doctors", user.uid);

        // Reference for the specialized collection
        const specializationRef = collection(db, normalizedSpecialization);

        // Fetch existing doctors in the specialization
        const existingDocsSnapshot = await getDocs(specializationRef);

        // Prepare a list of doctors in this specialization
        let doctorsList = [];
        existingDocsSnapshot.forEach(doc => {
            doctorsList.push(doc.data()); // Add existing doctor data
        });

        // Add the new doctor's details to the list
        const newDoctorDetails = {
            displayName: fullname,
            uid: user.uid,
            hospital: hospital,
            phone: phone,
            email: email,
            license: license,
            specialization: normalizedSpecialization,
            languages: languages
        };
        doctorsList.push(newDoctorDetails);

        // Set the new doctor in the main doctors collection
        await setDoc(ref, {
            ...newDoctorDetails,
            password: password // Only stored in the main collection, not specialization
        });

        // Update the specialized collection
        for (const doctor of doctorsList) {
            const doctorRef = doc(db, normalizedSpecialization, doctor.uid);
            await setDoc(doctorRef, doctor);
        }

        console.log("Doctor added successfully to main and specialized collections!");
    } catch (error) {
        console.log("There was an error setting the details:", error.message);
    }
};

export const dosignin = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Signed in successfully");
    } catch (error) {
        console.log("Error signing in:", error.message);
    }
};

export const dosignout = async () => {
    try {
        await auth.signOut();
        console.log("Signed out successfully");
    } catch (error) {
        console.log("Error signing out:", error.message);
    }
};