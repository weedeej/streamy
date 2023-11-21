import admin from "firebase-admin";

const serviceAccountConfig = {
  
}

const app = admin.apps.length < 1 ? admin.initializeApp({
  credential: admin.credential.cert(serviceAccountConfig)
}) : admin.app();