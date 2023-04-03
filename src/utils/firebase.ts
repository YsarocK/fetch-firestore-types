import firebase, { ServiceAccount } from 'firebase-admin';
import { config } from 'dotenv';
config();

const firebaseConfig: ServiceAccount = {
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  projectId: process.env.FIREBASE_PROJECT_ID,
};

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
});

const databasesClient = firebase.firestore();

export { databasesClient };