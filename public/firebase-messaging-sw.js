// importScripts(
//   "https://www.gstatic.com/firebasejs/9.16.0/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.16.0/firebase-messaging-compat.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyDeXg4UdOny31P8x1EIQ4blo7D1xBNFURQ",
//   authDomain: "smartfarm-43a3e.firebaseapp.com",
//   projectId: "smartfarm-43a3e",
//   storageBucket: "smartfarm-43a3e.appspot.com",
//   messagingSenderId: "877242966497",
//   appId: "1:877242966497:web:0f3cd49068acec463e72a0",
//   measurementId: "G-4Q464TD6K6",
// });

// const messaging = firebase.messaging();

// // 백그라운드 상태에서 받은 알림 처리
// messaging.onBackgroundMessage(function (payload) {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = "Smart Farm";
//   const notificationOptions = {
//     body: "Smart Farm에서 알림 도착",
//     // icon: "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
