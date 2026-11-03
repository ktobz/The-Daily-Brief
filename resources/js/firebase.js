let appInstance = null;

export function firebaseConfig() {
    return window.FIREBASE_CONFIG || {};
}

export function isFirebaseConfigured() {
    const c = firebaseConfig();
    return Boolean(c.apiKey && c.projectId);
}

export async function getApp() {
    if (!isFirebaseConfigured()) {
        return null;
    }
    if (appInstance) {
        return appInstance;
    }
    const { initializeApp } = await import('firebase/app');
    appInstance = initializeApp(firebaseConfig());
    return appInstance;
}

export async function getMessaging() {
    const app = await getApp();
    if (!app) return null;
    const { getMessaging } = await import('firebase/messaging');
    return getMessaging(app);
}

export async function getFirestore() {
    const app = await getApp();
    if (!app) return null;
    const { getFirestore } = await import('firebase/firestore');
    return getFirestore(app);
}

export async function getAuth() {
    const app = await getApp();
    if (!app) return null;
    const { getAuth } = await import('firebase/auth');
    return getAuth(app);
}

export async function signInWithGoogle() {
    const app = await getApp();
    if (!app) return null;
    const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return await result.user.getIdToken();
}
