import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let db: Firestore | undefined;

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables
 */
export function initializeFirebase(): Firestore {
    // Return existing instance if already initialized
    if (db) {
        return db;
    }

    try {
        // Check if Firebase app is already initialized
        const apps = getApps();
        if (apps.length > 0) {
            app = apps[0];
        } else {
            // Initialize Firebase Admin with service account credentials
            const projectId = process.env.FIREBASE_PROJECT_ID;
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (!projectId || !clientEmail || !privateKey) {
                throw new Error(
                    'Firebase credentials missing. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local'
                );
            }

            app = initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });

            console.log('✅ Firebase Admin initialized successfully');
        }

        db = getFirestore(app);
        return db;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        throw error;
    }
}

/**
 * Get Firestore instance (initializes if needed)
 */
export function getDb(): Firestore {
    if (!db) {
        return initializeFirebase();
    }
    return db;
}
