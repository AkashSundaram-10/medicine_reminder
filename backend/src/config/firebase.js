import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

export class FirebaseConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FirebaseConfigurationError';
    this.statusCode = 503;
  }
}

export const getDb = () => {
  if (db) return db;

  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new FirebaseConfigurationError(
      'Firebase is not configured. Add FIREBASE_SERVICE_ACCOUNT_JSON to backend/.env and restart the server.'
    );
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch {
    throw new FirebaseConfigurationError('FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON on one line.');
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }

  db = getFirestore();
  return db;
};
