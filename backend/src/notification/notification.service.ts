import { Injectable, Logger  } from '@nestjs/common';
import { admin } from 'src/firebase/firebase.config';


@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendToDevice(fcmToken: string, title: string, body: string) {
    return admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
    });
  }

  async sendToTopic(topic: string, title: string, body: string) {
    return admin.messaging().send({
      topic,
      notification: { title, body },
    });
  }

  async sendToUsers(payload: {
    title: string;
    body: string;
    topic: string; // or use token instead
  }) {
    // Stub: Replace this with real FCM logic later
    this.logger.log(
      `[FCM] Sending notification to topic "${payload.topic}": ${payload.title} - ${payload.body}`
    );
    return { success: true };
  }

  async sendToMosqueTopic(mosqueId: string, title: string, body: string) {
    const topic = `mosque-${mosqueId}`;

    try {
      const res = await admin.messaging().send({
        topic,
        notification: {
          title,
          body,
        },
        android: {
          priority: 'high',
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              alert: {
                title,
                body,
              },
              sound: 'default',
            },
          },
        },
      });

      this.logger.log(`✅ Sent to topic ${topic} - ID: ${res}`);
    } catch (error) {
      this.logger.error(`❌ Error sending to topic ${topic}:`, error);
    }
  }
}
