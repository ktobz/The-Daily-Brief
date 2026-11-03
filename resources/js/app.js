import './bootstrap';
import Alpine from 'alpinejs';
import { isFirebaseConfigured, getMessaging } from './firebase';
import { initComments } from './comments';

window.Alpine = Alpine;
Alpine.start();

async function registerToken(token) {
    try {
        await fetch('/push/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({ token, topics: ['breaking', 'news'] }),
        });
    } catch (e) {
        console.warn('Failed to register push token', e);
    }
}

async function enablePush() {
    if (!isFirebaseConfigured()) {
        alert('Push notifications are not configured yet.');
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('Notifications were denied. Enable them in your browser settings.');
            return;
        }

        const messaging = await getMessaging();
        const { getToken } = await import('firebase/messaging');
        const vapidKey = window.FIREBASE_CONFIG?.vapidKey || null;
        const token = await getToken(messaging, { vapidKey });
        await registerToken(token);
        alert('You will now receive breaking news alerts.');
    } catch (e) {
        console.error(e);
        alert('Could not enable notifications in this browser.');
    }
}

window.enablePush = enablePush;

if (isFirebaseConfigured() && 'serviceWorker' in navigator && 'Notification' in window) {
    navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .catch((e) => console.warn('SW registration failed', e));
}

const commentsApp = document.getElementById('comments-app');
if (commentsApp) {
    initComments(commentsApp.dataset.articleId, { containerId: 'comments-list' });
}
