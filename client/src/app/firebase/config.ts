import { Injectable, inject } from "@angular/core";
import {
  getMessaging,
  getToken,
  isSupported,
  type Messaging,
} from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { fcmToken, lang, response } from "../context/global";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = initializeApp(firebaseConfig);

@Injectable({ providedIn: "root" })
export class FirebaseService {
  async setupNotifications(): Promise<void> {
    try {
      if (!(await isSupported())) return;

      if (!("Notification" in window)) return;

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        response.set({
          type: "warning",
          message:
            lang() === "ar"
              ? "فعّل الإشعارات لتلقي التنبيهات."
              : "Enable notifications to receive alerts.",
        });
        return;
      }

      const messaging: Messaging = getMessaging(app);

      const token = await getToken(messaging, {
        vapidKey: "",
      });

      if (token) {
        fcmToken.set(token);
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  }
}
