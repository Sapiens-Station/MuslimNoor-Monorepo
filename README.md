
# 🕌 Muslim Noor – Fullstack Platform

Muslim Noor is a fullstack application designed to help users track **Salat** times, get notified for **Jamat**, view upcoming **community events**, and make **donations** — all managed via a powerful **admin dashboard**.

---

## 📦 Monorepo Structure

```bash
MuslimNoor-Monorepo/
├── backend/           # NestJS API server (MongoDB + Redis + Auth + Stripe)
├── admin-panel/       # Nuxt 3 Admin Panel (TailwindCSS + Nuxt UI)
├── shared/            # (Optional) Shared interfaces or config
├── docker-compose.yml # Docker setup for backend, MongoDB, Redis
├── README.md          # You are here
└── .gitignore
````

---

## 🚀 Features

### ✅ Admin Features:

* 🔐 JWT Admin Login
* 🕋 Add/Edit/Delete **Salat** & **Jamat Times**
* 📆 Manage **Events** with images & timestamps
* 💰 Manage **Donations** via Stripe
* 📩 Send **FCM Notifications** to users
* 👥 View Authenticated Admin Info

### 🧰 Tech Stack:

| Layer          | Tech                                                      |
| -------------- | --------------------------------------------------------- |
| **Backend**    | [NestJS](https://nestjs.com/), MongoDB, Redis, Stripe API |
| **Frontend**   | [Nuxt 3](https://nuxt.com/), TailwindCSS, Nuxt UI         |
| **Database**   | MongoDB v8.0                                              |
| **Deployment** | Docker & Docker Compose                                   |

---

## 🧪 Local Development

### 1. Clone & Install

```bash
git clone https://github.com/Sapiens-Station/MuslimNoor-Monorepo.git
cd MuslimNoor-Monorepo
```

### 2. Run Backend (NestJS + MongoDB + Redis)

> Make sure Docker is running.

```bash
docker-compose up --build
```

This starts:

* `backend` on `http://localhost:3000`
* `MongoDB` on port `27017`
* `Redis` on port `6379`

### 3. Run Frontend (Admin Panel)

```bash
cd admin-panel
npm install
npm run dev
```

> Frontend runs at: `http://localhost:3001`

---

## 🔐 API Authentication

* Use `/auth/register` to create admin users.
* Login via `/auth/login` to get JWT.
* Include token in `Authorization: Bearer <token>` header for all admin endpoints.

---

## 📚 API Endpoints (Admin Only)

| Category      | Endpoint         | Method | Description              |
| ------------- | ---------------- | ------ | ------------------------ |
| **Auth**      | `/auth/register` | POST   | Register admin user      |
|               | `/auth/login`    | POST   | Login admin user         |
|               | `/auth/me`       | GET    | Get current admin info   |
| **Salat**     | `/salat`         | GET    | Get all salat times      |
|               | `/salat`         | POST   | Add new salat time       |
|               | `/salat/:id`     | PUT    | Update salat time        |
|               | `/salat/:id`     | DELETE | Delete salat time        |
| **Events**    | `/events`        | GET    | List all events          |
|               | `/events`        | POST   | Create new event         |
|               | `/events/:id`    | PUT    | Edit event               |
|               | `/events/:id`    | DELETE | Remove event             |
| **Donations** | `/donations`     | GET    | List donations           |
|               | `/donations`     | POST   | Create donation (Stripe) |
|               | `/donations/:id` | PUT    | Update donation          |
|               | `/donations/:id` | DELETE | Delete donation          |

---

## 📷 Admin Panel Preview

> Sample Nuxt UI sidebar:

* Dashboard

  * 🕋 Salat & Jamat
  * 📆 Events
  * 💰 Donations

---

## 🧾 Environment Variables

`.env` for Backend (`backend/.env`)

```env
MONGO_URI=mongodb://mongodb:27017/muslimnoor
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_secret_key

FIREBASE_PROJECT_ID=muslim-noor
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...

STRIPE_SECRET_KEY=...
```

---

## 🛠 Tech Highlights

* 🔥 **Tailwind v4+** with PostCSS via `@tailwindcss/postcss`
* ⚡ Nuxt 3 with `composables` for reusable logic (auth, donation, user)
* 🐳 Docker with `backend`, `mongodb`, `redis` networked using Docker Compose
* ✅ Protected routes via `middleware/auth.ts`
* 💡 Modular NestJS structure: `auth`, `user`, `events`, `donations`, `salat`

---

## 🧩 Future Plans

* [ ] Add Push Notification Management from Admin
* [ ] Flutter App to consume APIs
* [ ] Admin Analytics Dashboard (Salat attendance, donation stats)
* [ ] Support for Multiple Mosques

---

## 👨‍💻 Author

Developed by **[Sapiens Station](https://github.com/Sapiens-Station)**

---

> For any issues, feel free to open a GitHub Issue or contact the maintainer.

```

---

✅ You can copy this into `MuslimNoor-Monorepo/README.md` right now.

Let me know if you want to:

- Add **Flutter app instructions**
- Add **deployment steps**
- Add **screenshots**

I'll handle it for you.
```
