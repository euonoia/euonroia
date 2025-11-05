import admin from "firebase-admin";
import fs from "fs";
import { ENV } from "./env.js";

let serviceAccount;

try {
  if (ENV.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(ENV.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else if (fs.existsSync(ENV.FIREBASE_SERVICE_ACCOUNT_PATH)) {
    serviceAccount = JSON.parse(fs.readFileSync(ENV.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"));
  } else {
    throw new Error("Firebase service account key not found");
  }
} catch (err) {
  console.error("❌ Firebase initialization error:", err);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
