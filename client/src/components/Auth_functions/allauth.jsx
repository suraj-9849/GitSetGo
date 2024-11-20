import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

export const docreatefordoc = async (email, password, fullname, phone, specialization, license, hospital,languages) => {
    const db = getFirestore();

    try {
        // Create user with email and password
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Access the user's UID directly from the result
        const user = result.user;
        const ref = doc(db, "doctors", user.uid);

        // Set the user's document in Firestore
        await setDoc(ref, {
            displayName: fullname,
            uid: user.uid,
            hospital: hospital,
            phone: phone,
            email: email,
            password: password,
            license : license,
            specialization : specialization,
            languages : languages
        });

        console.log("User created and details set in Firestore!");
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