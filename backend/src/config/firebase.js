import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './smart-medicine-reminder-a257b-firebase-adminsdk-fbsvc-388259608d.json' with { type: "json" };

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

export { db };
