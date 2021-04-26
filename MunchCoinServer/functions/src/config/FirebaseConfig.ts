import { initializeApp } from "firebase-admin";

export const app = initializeApp();
export const firestore = app.firestore();
export const messaging = app.messaging();
export const auth = app.auth();
