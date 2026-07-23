import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  let serviceAccount;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
      const configPath = path.join(__dirname, 'smart-medicine-reminder-a257b-firebase-adminsdk-fbsvc-e4b4091e92.json');
      const fileContent = fs.readFileSync(configPath, 'utf8');
      serviceAccount = JSON.parse(fileContent);
    }
  } catch (error) {
    throw new FirebaseConfigurationError('Firebase is not configured. Add credentials to .env or place the JSON file in src/config.');
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }

  db = getFirestore();
  return db;
};
