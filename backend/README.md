# 🕌 Muslim Noor Backend (NestJS + MongoDB)

This is the official backend API for **Muslim Noor** – a platform that helps users track Salat times, get notified for Jamat, view community events, and make donations.

---

## ✅ Phases & Progress

| Phase                        | Status       | Notes                                         |
|-----------------------------|--------------|-----------------------------------------------|
| Phase 1: Setup & Architecture   | ✅ Completed  | NestJS, MongoDB, Redis, Docker, JWT, GitHub   |
| Phase 2: API & Notifications   | ✅ Completed  | Salat & Jamat APIs, FCM integration           |
| Phase 3: Events & Donations    | ✅ Completed  | Events module, Stripe donations               |
| Phase 4: Admin Panel (NuxtJS)  | 🟡 In Progress| Frontend being built in NuxtJS                |
| Phase 5: Flutter App           | 🔜 Pending    | Flutter app to consume backend APIs           |
| Phase 6: Final Testing & Deploy| 🔜 Pending    | Deploy backend & integrate with mobile app    |

---

## 🧰 Technologies Used

- **NestJS** (backend framework)
- **MongoDB** (database)
- **Redis** (caching & sessions)
- **Docker** (optional containerization)
- **Stripe API** (for donations)
- **Firebase Cloud Messaging (FCM)** (notifications)

---

## ⚙️ Environment Setup

### 🔐 .env
```env
MONGO_URI=mongodb://localhost:27017/muslimnoor
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
