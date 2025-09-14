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
- [x] 📝 **Registration & Login** – secure JWT authentication  
- [ ] 🕌 **View Jamat Schedules** – next 10 days at preferred mosque  
- [ ] ✔️ **Track Salat** – mark prayers & view progress charts  
- [ ] 📆 **View Events** – browse mosque community events  
- [ ] 📖 **Read Qur’an** – surahs, translations & audio recitations  
- [ ] 🧭 **Check Qibla** – built-in compass for Kaaba direction  
- [ ] 💸 **Donate Monthly** – via Stripe integration  
- [ ] 🕋 **Hajj Packages** – browse & favorite packages  
- [ ] 🌍 **Umrah Packages** – browse & favorite packages  

### 🕌 Mosque Authority Features
- [ ] 👥 **Manage Users** – view & manage mosque users  
- [ ] 🕌 **Create Jamat Schedules** – add/edit/delete daily times  
- [ ] 📆 **Manage Events** – CRUD mosque events  
- [ ] 💰 **Manage Donations** – Stripe or manual records  
- [ ] 🕋 **Manage Hajj Packages** – CRUD hajj offerings  
- [ ] 🌍 **Manage Umrah Packages** – CRUD umrah offerings  

### 👑 Admin Features
- [ ] 👥 **Full User Management** – CRUD across all mosques  
- [ ] 🕌 **Mosque Management** – add/edit/delete mosques & assign authorities  
- [ ] 💰 **Donation Management** – global view of all donations  
- [ ] 🕌 **Jamat Management** – CRUD across any mosque  
- [ ] 📆 **Event Management** – CRUD events across mosques  
- [ ] 🕋 **Hajj Package Management** – CRUD for hajj packages  
- [ ] 🌍 **Umrah Package Management** – CRUD for umrah packages  

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

- [x] `/auth/signup` → create **admin**, **mosque authority**, or **user** accounts  
- [x] `/auth/login` → login & get JWT  
- [x] Include JWT in `Authorization: Bearer <token>` for protected endpoints  

---

## 📚 API Endpoints

### 1. Authentication & User Management

| Done | Endpoint                               | Method | Purpose                                       | Access                       |
| ---- | -------------------------------------- | ------ | --------------------------------------------- | ---------------------------- |
| [x]  | `/auth/signup`                         | POST   | Register new user                             | Public                       |
| [x]  | `/auth/login`                          | POST   | Login & return JWT                            | Public                       |
| [x]  | `/auth/me`                             | GET    | Current authenticated user profile            | user, mosqueAuthority, admin |
| [x]  | `/users/profile`                       | GET    | Current user profile (alias of /auth/me)      | user, mosqueAuthority, admin |
| [x]  | `/users/update`                        | PUT    | Update own profile (name, contact, password)  | user, mosqueAuthority, admin |
| [x]  | `/users`                               | POST   | Create a new user                             | admin                        |
| [x]  | `/users`                               | GET    | List users (mosqueAuthority sees own mosque)  | mosqueAuthority, admin       |
| [x]  | `/users/:id`                           | GET    | Get a user by ID (mosqueAuthority limited)    | mosqueAuthority, admin       |
| [x]  | `/users/:id`                           | PUT    | Update another user’s info                    | admin                        |
| [x]  | `/users/:id/role`                      | PATCH  | Change a user’s role                          | admin                        |
| [x]  | `/users/:id`                           | DELETE | Delete a user                                 | admin                        |
| [x]  | `/users/fcm-token`                     | PATCH  | Add a device’s FCM token for notifications    | user, mosqueAuthority, admin |
| [x]  | `/users/favorites`                     | GET    | Get current user’s favorite packages/events   | user, mosqueAuthority, admin |
| [x]  | `/users/favorites/hajj/:packageId`     | POST   | Add a Hajj package to favorites               | user, mosqueAuthority, admin |
| [x]  | `/users/favorites/umrah/:packageId`    | POST   | Add an Umrah package to favorites             | user, mosqueAuthority, admin |
| [x]  | `/users/favorites/event/:eventId`      | POST   | Add an event to favorites                     | user, mosqueAuthority, admin |


### 2. Jamat Schedule

| Done | Endpoint                      | Method | Purpose                                  | Access                 |
| ---- | ----------------------------- | ------ | ---------------------------------------- | ---------------------- |
| [x]  | `/jamat/today`                | GET    | Today’s jamat times                      | Public                 |
| [x]  | `/jamat/ten-days`             | GET    | 10-day jamat schedule                    | user, guest            |
| [x]  | `/jamat`                      | POST   | Create or upsert a jamat schedule        | mosqueAuthority, admin |
| [x]  | `/jamat/:id/prayer`           | PATCH  | Update a single prayer’s iqama time      | mosqueAuthority, admin |
| [x]  | `/jamat/auto-fill`            | POST   | Auto-fill jamat times by location        | mosqueAuthority, admin |
| [x]  | `/jamat/:id`                  | DELETE | Delete an existing jamat schedule        | mosqueAuthority, admin |


### 3. Prayer-times

| Done | Endpoint              | Method | Purpose                | Access |
| ---- | --------------------- | ------ | ---------------------- | ------ |
| [x]  | `/prayer-times/today` | GET    | Surah or verse content | Public |
| [x]  | `/prayer-times/fetch` | GET    | Get Qibla coordinates  | Admin, mosqueAuthority |

### 4. Events

| Done | Endpoint           | Method | Purpose            | Access                 |
| ---- | -----------------  | ------ | ------------------ | ---------------------- |
| [x]  | `/events`          | GET    | List mosque events | Public                 |
| [x]  | `/events/:id`      | GET    | Get single event   | Public                 |
| [x]  | `/events/upcoming` | GET    | Get upcoming event | Public                 |
| [x]  | `/events`          | POST   | Create event       | mosqueAuthority, admin |
| [x]  | `/events/:id`      | PUT    | Edit event         | mosqueAuthority, admin |
| [x]  | `/events/:id`      | DELETE | Remove event       | mosqueAuthority, admin |

### 5. Donations

| Done | Endpoint          | Method | Purpose                        | Access                 |
| ---- | ----------------- | ------ | ------------------------------ | ---------------------- |
| [ ]  | `/donate/stripe`  | POST   | Create Stripe checkout session | user                   |
| [ ]  | `/donate/history` | GET    | User donation history          | user                   |
| [ ]  | `/donate`         | GET    | List mosque donations          | mosqueAuthority, admin |
| [ ]  | `/donate`         | POST   | Record manual donation         | mosqueAuthority, admin |
| [ ]  | `/donate/:id`     | DELETE | Remove donation record         | mosqueAuthority, admin |


### 6. Mosque & Admin Management

| Done | Endpoint                        | Method | Purpose                    | Access                 |
| ---- | ------------------------------- | ------ | -------------------------- | ---------------------- |
| [ ]  | `/mosques`                      | GET    | List mosques               | admin                  |
| [ ]  | `/mosques`                      | POST   | Create new mosque          | admin                  |
| [ ]  | `/mosques/:id`                  | PUT    | Update mosque details      | admin                  |
| [ ]  | `/mosques/:id`                  | DELETE | Delete mosque              | admin                  |
| [ ]  | `/mosques/:id/users`            | GET    | List mosque users          | admin, mosqueAuthority |
| [ ]  | `/mosques/:id/assign-authority` | POST   | Assign authority to a user | admin                  |


---

## 🧩 Next Release

### 1. Salat Tracking

| Done | Endpoint         | Method | Purpose                   | Access                 |
| ---- | ---------------- | ------ | ------------------------- | ---------------------- |
| [ ]  | `/salat/track`   | POST   | Mark prayer completed     | user                   |
| [ ]  | `/salat/today`   | GET    | Today’s completion status | user                   |
| [ ]  | `/salat/history` | GET    | Retrieve prayer logs      | user                   |
| [ ]  | `/salat/summary` | GET    | Mosque prayer statistics  | mosqueAuthority, admin |

### 2. Quran & Qibla

| Done | Endpoint           | Method | Purpose                | Access |
| ---- | ------------------ | ------ | ---------------------- | ------ |
| [ ]  | `/quran/surah/:id` | GET    | Surah or verse content | Public |
| [ ]  | `/qibla/direction` | GET    | Get Qibla coordinates  | Public |

### 3. Hajj & Umrah Packages

| Done | Endpoint                  | Method | Purpose                        | Access                 |
| ---- | ------------------------- | ------ | ------------------------------ | ---------------------- |
| [ ]  | `/packages/hajj`          | GET    | List hajj packages             | Public                 |
| [ ]  | `/packages/hajj/:id`      | GET    | Single hajj package            | Public                 |
| [ ]  | `/packages/hajj/favorite` | POST   | Add hajj package to favourites | user                   |
| [ ]  | `/packages/hajj`          | POST   | Create hajj package            | mosqueAuthority, admin |
| [ ]  | `/packages/hajj/:id`      | PUT    | Update hajj package            | , admin |
| [ ]  | `/packages/hajj/:id`      | DELETE | Delete hajj package            | mosqueAuthority, admin |

*(same endpoints apply for `/packages/umrah`)*

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

- [ ] 🧙‍♂️ Tailwind v4+ for rapid UI (Nuxt 3)
- [ ] 🧘 Nuxt composables for reusable logic (auth, donation, user)
- [ ] 🐳 Dockerized environment (backend, MongoDB, Redis)
- [ ] 🛡️ Protected routes with NestJS guards & Nuxt middleware
- [ ] 📦 Modular backend (auth, user, events, donations, salat, packages)

---

## 🧩 Future Plans

- [ ] Push notification management from Admin
- [ ] Flutter app for users
- [ ] Admin analytics dashboard (salat attendance, donation trends)
- [ ] Support multiple mosques per user

---

## 👨‍💻 Author

Developed by **Sapiens Station**

> For issues, open a GitHub Issue or contact the maintainer.
