import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCiwJqV95rwnpLVXi3e5qBAyUICUrIdZqw",
  authDomain: "carelo-bafe6.firebaseapp.com",
  projectId: "carelo-bafe6",
  storageBucket: "carelo-bafe6.firebasestorage.app",
  messagingSenderId: "545795114060",
  appId: "1:545795114060:web:2bd023c793c25774b2e0e9",
  measurementId: "G-D2B07QMN12",
}

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export { db }
