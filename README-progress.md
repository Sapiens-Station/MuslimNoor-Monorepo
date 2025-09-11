# 🕌 Muslim Noor – Fullstack Platform

Muslim Noor is a fullstack application designed to empower both mosques and their communities. Users can **register/login**, track **salat performance**, view **jamat schedules**, browse **community events**, read the **Qur’an**, check **Qibla direction**, make **donations**, and explore **Hajj/Umrah packages** — all managed via a unified **admin dashboard**.

---

## 📦 Monorepo Structure

```bash
MuslimNoor-Monorepo/
├── backend/           # NestJS API server (MongoDB + Redis + Auth + Stripe)
├── admin-panel/       # Nuxt 3 Admin Panel (TailwindCSS + Nuxt UI)
├── shared/            # Shared interfaces or config
├── docker-compose.yml # Docker setup for backend, MongoDB, Redis
├── README.md          # This file
└── .gitignore
```

---

## 🚀 Features

### 🙋‍♂️ User Features
* 📝 **Registration & Login** – secure JWT authentication
* 🕌 **View Jamat Schedules** – next 10 days at preferred mosque
* ✔️ **Track Salat** – mark prayers & view progress charts
* 📆 **View Events** – browse mosque community events
* 📖 **Read Qur’an** – surahs, translations & audio recitations
* 🧭 **Check Qibla** – built-in compass for Kaaba direction
* 💸 **Donate Monthly** – via Stripe integration
* 🕋 **Hajj Packages** – browse & favorite packages
* 🌍 **Umrah Packages** – browse & favorite packages

### 🕌 Mosque Authority Features
* 👥 **Manage Users** – view & manage mosque users
* 🕌 **Create Jamat Schedules** – add/edit/delete daily times
* 📆 **Manage Events** – CRUD mosque events
* 💰 **Manage Donations** – Stripe or manual records
* 🕋 **Manage Hajj Packages** – CRUD hajj offerings
* 🌍 **Manage Umrah Packages** – CRUD umrah offerings

### 👑 Admin Features
* 👥 **Full User Management** – CRUD across all mosques
* 🕌 **Mosque Management** – add/edit/delete mosques & assign authorities
* 💰 **Donation Management** – global view of all donations
* 🕌 **Jamat Management** – CRUD across any mosque
* 📆 **Event Management** – CRUD events across mosques
* 🕋 **Hajj Package Management** – CRUD for hajj packages
* 🌍 **Umrah Package Management** – CRUD for umrah packages

---

## 🧰 Tech Stack

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

Starts:
* `backend` → `http://localhost:3000`
* `MongoDB` → port `27017`
* `Redis` → port `6379`

### 3. Run Frontend (Admin Panel)
```bash
cd admin-panel
npm install
npm run dev
```

Frontend runs at: `http://localhost:3001`

---

## 🔐 API Authentication

* `/auth/signup` → create **admin**, **mosque authority**, or **user** accounts
* `/auth/login` → login & get JWT
* Include JWT in `Authorization: Bearer <token>` for protected endpoints

---

## 📚 API Endpoints

### 1. Authentication & User Management

| Endpoint         | Method | Purpose                  | Access                       |
| ---------------- | ------ | ------------------------ | ---------------------------- |
| `/auth/signup`   | POST   | Register new user        | Public                       |
| `/auth/login`    | POST   | Login & return JWT       | Public                       |
| `/users/profile` | GET    | Current user profile     | user, mosqueAuthority, admin |
| `/users`         | GET    | List users by mosque     | mosqueAuthority, admin       |
| `/users/:id`     | PUT    | Update user info         | admin                        |
| `/users/:id/role`| PUT    | Change user role         | admin                        |

### 2. Jamat Schedule

| Endpoint        | Method | Purpose                | Access                       |
| --------------- | ------ | ---------------------- | ---------------------------- |
| `/jamat/today`  | GET    | Today’s jamat times    | Public                       |
| `/jamat/ten-days`| GET   | 10-day jamat schedule  | user, guest                  |
| `/jamat`        | POST   | Create jamat schedule  | mosqueAuthority, admin       |
| `/jamat/:id`    | PUT    | Update jamat schedule  | mosqueAuthority, admin       |
| `/jamat/:id`    | DELETE | Delete jamat schedule  | mosqueAuthority, admin       |

### 3. Salat Tracking

| Endpoint       | Method | Purpose                    | Access                       |
| -------------- | ------ | -------------------------- | ---------------------------- |
| `/salat/track` | POST   | Mark prayer completed      | user                         |
| `/salat/today` | GET    | Today’s completion status  | user                         |
| `/salat/history`| GET   | Retrieve prayer logs       | user                         |
| `/salat/summary`| GET   | Mosque prayer statistics   | mosqueAuthority, admin       |

### 4. Events

| Endpoint      | Method | Purpose             | Access                       |
| ------------- | ------ | ------------------- | ---------------------------- |
| `/events`     | GET    | List mosque events  | Public                       |
| `/events/:id` | GET    | Get single event    | Public                       |
| `/events`     | POST   | Create event        | mosqueAuthority, admin       |
| `/events/:id` | PUT    | Edit event          | mosqueAuthority, admin       |
| `/events/:id` | DELETE | Remove event        | mosqueAuthority, admin       |

### 5. Donations

| Endpoint          | Method | Purpose                        | Access                       |
| ----------------- | ------ | ------------------------------ | ---------------------------- |
| `/donate/stripe`  | POST   | Create Stripe checkout session | user                         |
| `/donate/history` | GET    | User donation history          | user                         |
| `/donate`         | GET    | List mosque donations          | mosqueAuthority, admin       |
| `/donate`         | POST   | Record manual donation         | mosqueAuthority, admin       |
| `/donate/:id`     | DELETE | Remove donation record         | mosqueAuthority, admin       |

### 6. Quran & Qibla

| Endpoint           | Method | Purpose                 | Access |
| ------------------ | ------ | ----------------------- | ------ |
| `/quran/surah/:id` | GET    | Surah or verse content  | Public |
| `/qibla/direction` | GET    | Get Qibla coordinates   | Public |

### 7. Hajj & Umrah Packages

| Endpoint                  | Method | Purpose                        | Access                       |
| ------------------------- | ------ | ------------------------------ | ---------------------------- |
| `/packages/hajj`          | GET    | List hajj packages             | Public                       |
| `/packages/hajj/:id`      | GET    | Single hajj package            | Public                       |
| `/packages/hajj/favorite` | POST   | Add hajj package to favourites | user                         |
| `/packages/hajj`          | POST   | Create hajj package            | mosqueAuthority, admin       |
| `/packages/hajj/:id`      | PUT    | Update hajj package            | mosqueAuthority, admin       |
| `/packages/hajj/:id`      | DELETE | Delete hajj package            | mosqueAuthority, admin       |

*(same endpoints apply for `/packages/umrah`)*

### 8. Mosque & Admin Management

| Endpoint                        | Method | Purpose                    | Access                 |
| ------------------------------- | ------ | -------------------------- | ---------------------- |
| `/mosques`                      | GET    | List mosques               | admin                  |
| `/mosques`                      | POST   | Create new mosque          | admin                  |
| `/mosques/:id`                  | PUT    | Update mosque details      | admin                  |
| `/mosques/:id`                  | DELETE | Delete mosque              | admin                  |
| `/mosques/:id/users`            | GET    | List mosque users          | admin, mosqueAuthority |
| `/mosques/:id/assign-authority` | POST   | Assign authority to a user | admin                  |

---

## 🧾 Environment Variables

`.env` inside `backend/`

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

* 🧙‍♂️ Tailwind v4+ for rapid UI (Nuxt 3)
* 🧘 Nuxt composables for reusable logic (auth, donation, user)
* 🐳 Dockerized environment (backend, MongoDB, Redis)
* 🛡️ Protected routes with NestJS guards & Nuxt middleware
* 📦 Modular backend (auth, user, events, donations, salat, packages)

---

## 🧩 Future Plans

* [ ] Push notification management from Admin
* [ ] Flutter app for users
* [ ] Admin analytics dashboard (salat attendance, donation trends)
* [ ] Support multiple mosques per user

---

## 👨‍💻 Author

Developed by **Sapiens Station**

> For issues, open a GitHub Issue or contact the maintainer.
