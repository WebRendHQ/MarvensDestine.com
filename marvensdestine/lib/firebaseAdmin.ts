import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

export function getAdminApp(): admin.app.App {
  if (adminApp) return adminApp;

  const json = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  let credential: admin.credential.Credential;
  if (json) {
    const parsed = JSON.parse(json);
    credential = admin.credential.cert(parsed as admin.ServiceAccount);
  } else {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!clientEmail || !privateKey) {
      throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');
    }
    credential = admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail,
      privateKey,
    });
  }

  adminApp = admin.initializeApp({
    credential,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  return adminApp;
}

export function getAdminFirestore() {
  return getAdminApp().firestore();
}


