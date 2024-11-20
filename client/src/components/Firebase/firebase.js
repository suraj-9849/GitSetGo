import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnvzPo59fjrwDI181z7c24WUiHuMdf8Ms",
  authDomain: "ruralcare-75fe1.firebaseapp.com",
  projectId: "ruralcare-75fe1",
  storageBucket: "ruralcare-75fe1.firebasestorage.app",
  messagingSenderId: "930023058714",
  appId: "1:930023058714:web:e931501e0594ac2f2490a3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()

export {app, auth}