import firebase from 'firebase/app'
import 'firebase/firestore'
require('dotenv').config()

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: 'https://steam-quest-ed9fd.firebaseio.com',
  projectId: 'steam-quest-ed9fd'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// firebase.analytics()

export { firebase }