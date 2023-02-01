import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
} from "firebase/messaging";
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

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);

  if (payload.notification) {
    store.commit("ALARM/addAlarm", payload.notification);
    //   alert(payload.notification.title + ", " + payload.notification.body);
  } else {
    alert("payload==null");
  }
});

async function subscribe(): Promise<boolean> {
  let permission: NotificationPermission =
    await Notification.requestPermission();
  if (permission != "granted") {
    alert("푸시알림을 허용해주세요");
    return false;
  }

  let token: string = await getToken(messaging, {
    vapidKey:
      "BJzX7kTFW3S31TKLz6cU2ADGci3wasCDw3XFoTIR_CSwJWW_eXB-71LFnO8Au4y9jOxMoVS9RxTqTlGgsYEYPbo",
  });
  if (!token) {
    console.log(
      "No registration token available. Request permission to generate one."
    );
    return false;
  }
  // Send token to server
  console.log("SSSSSSSSSS 토큰받기 성공", token);
  return true;
}

async function unsubscribe(): Promise<void> {
  let result: boolean = await deleteToken(messaging);
  if (result) alert("알림을 해제하였습니다");
  else alert("알림 해제 실패");
  // Send token to Server
}

export default {
  subscribe,
  unsubscribe,
};
