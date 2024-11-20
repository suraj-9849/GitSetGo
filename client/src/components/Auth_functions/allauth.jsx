import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";

export const docreate = async (email, password, phone, languages, name) => {
    const db = getFirestore();

    try {
        
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        
        const user = result.user;
        const ref = doc(db, "patients", user.uid);

        
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
        
        const normalizedSpecialization = specialization.toUpperCase();

        
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        
        const ref = doc(db, "doctors", user.uid);

        
        const specializationRef = collection(db, normalizedSpecialization);

        
        const existingDocsSnapshot = await getDocs(specializationRef);

    
        let doctorsList = [];
        existingDocsSnapshot.forEach(doc => {
            doctorsList.push(doc.data()); 
        });

        
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

        
        await setDoc(ref, {
            ...newDoctorDetails,
            password: password 
        });

       
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