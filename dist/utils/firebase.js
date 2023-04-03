var _a;
import firebase from 'firebase-admin';
import { config } from 'dotenv';
config();
const firebaseConfig = {
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: ((_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')) || '',
    projectId: process.env.FIREBASE_PROJECT_ID,
};
firebase.initializeApp({
    credential: firebase.credential.cert(firebaseConfig),
});
const databasesClient = firebase.firestore();
export { databasesClient };
