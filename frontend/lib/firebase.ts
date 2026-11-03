"use client";

import { FIREBASE_CONFIG } from "./constants";

export function isFirebaseConfigured(): boolean {
  return Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
}

let appPromise: Promise<unknown> | null = null;

export async function getApp() {
  if (!isFirebaseConfigured()) return null;
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp }) => initializeApp(FIREBASE_CONFIG));
  }
  return appPromise;
}

export async function signInWithGoogle(): Promise<string | null> {
  const app = await getApp();
  if (!app) return null;
  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const auth = getAuth(app as import("firebase/app").FirebaseApp);
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}

export async function enablePush(): Promise<boolean> {
  if (!isFirebaseConfigured() || !("Notification" in window)) return false;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;
    const { getMessaging, getToken } = await import("firebase/messaging");
    const app = (await getApp()) as import("firebase/app").FirebaseApp;
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: FIREBASE_CONFIG.vapidKey || undefined });
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/push/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, topics: ["breaking", "world"] }),
    });
    return true;
  } catch (e) {
    console.error("Push registration failed", e);
    return false;
  }
}

export interface LiveComment {
  id: string;
  body: string;
  authorName: string;
  reactions?: number;
  verified?: boolean;
  createdAt?: { toDate: () => Date };
}

export async function listenToComments(
  articleId: number | string,
  onUpdate: (comments: LiveComment[]) => void
): Promise<() => void> {
  const app = (await getApp()) as import("firebase/app").FirebaseApp | null;
  if (!app) return () => {};
  const { getFirestore, collection, query, orderBy, onSnapshot } = await import("firebase/firestore");
  const db = getFirestore(app);
  const q = query(
    collection(db, "articles", String(articleId), "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const comments: LiveComment[] = [];
    snap.forEach((doc) => comments.push({ id: doc.id, ...(doc.data() as Omit<LiveComment, "id">) }));
    onUpdate(comments);
  });
}
