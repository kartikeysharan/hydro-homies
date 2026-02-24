
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCfMLAnZKb7cAiEwliEnCtrpwIoKOjr1kg",
  authDomain: "hydro-homies-458f6.firebaseapp.com",
  projectId: "hydro-homies-458f6",
  messagingSenderId: "533318428966",
  appId: "1:533318428966:web:3f9ee356e1e3c0b3c939e7"
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body.',
    icon: '/firebase-logo.png'  // Replace with your own icon if you want
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  event.notification.close();

  // Example: open your app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
