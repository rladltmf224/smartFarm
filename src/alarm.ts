import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import store from "@/store/index";

const firebaseConfig = {
  apiKey: "AIzaSyDeXg4UdOny31P8x1EIQ4blo7D1xBNFURQ",
  authDomain: "smartfarm-43a3e.firebaseapp.com",
  projectId: "smartfarm-43a3e",
  storageBucket: "smartfarm-43a3e.appspot.com",
  messagingSenderId: "877242966497",
  appId: "1:877242966497:web:0f3cd49068acec463e72a0",
  measurementId: "G-4Q464TD6K6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object.
const messaging = getMessaging(app);

// 알림 수신을 위한 사용자 권한 요청
Notification.requestPermission().then((permission) => {
  console.log("permission ", permission);
  if (permission !== "granted") {
    alert("푸시알림을 허용해주세요");
  }
});

getToken(messaging, {
  vapidKey:
    "BJzX7kTFW3S31TKLz6cU2ADGci3wasCDw3XFoTIR_CSwJWW_eXB-71LFnO8Au4y9jOxMoVS9RxTqTlGgsYEYPbo",
}).then((token) => {
  console.log(token);

  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);

    if (payload.notification) {
      store.commit("ALARM/addAlarm", payload.notification);
      //   alert(payload.notification.title + ", " + payload.notification.body);
    } else {
      alert("payload==null");
    }
  });
});
