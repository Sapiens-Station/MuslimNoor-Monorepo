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

### 2. Run Backend + admin-panel (NestJS + MongoDB + Redis)
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

### 4. Run Frontend & Backend service simultaneously locally

```bash
pnpm dev
run docker and start mongodb
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
| [ ]  | `/auth/refresh`                        | POST   | Rotate refresh, issue aceess + refresh token  | user, mosqueAuthority, admin |
| [ ]  | `/auth/logout`                         | POST   | Clear cookies + remove refresh token from DB  | user, mosqueAuthority, admin |
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


### 5. Mosque & Admin Management

| Done | Endpoint                        | Method | Purpose                    | Access                 |
| ---- | ------------------------------- | ------ | -------------------------- | ---------------------- |
| [x]  | `/mosques`                      | GET    | List mosques               | Public                  |
| [x]  | `/mosques`                      | POST   | Create new mosque          | admin                  |
| [x]  | `/mosques/:id`                  | PUT    | Update mosque details      | admin                  |
| [x]  | `/mosques/:id`                  | DELETE | Delete mosque              | admin                  |
| [x]  | `/mosques/:id/users`            | GET    | List mosque users          | admin, mosqueAuthority |
| [x]  | `/mosques/:id/assign-authority` | POST   | Assign authority to a user | admin                  |

---

## 🎨 Frontend Features (Screens & Pages)

### 1. Authentication & User

| Done | Module / Page                  | Purpose (UI)                          | APIs to Call                                                                                                          | Access                       | Extra Notes                                           |
| ---- | ------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| [ ]  | Signup Page                     | Register new users                     | POST `/auth/signup`                                                                                                   | Public                       | Basic form validation, mosque selection dropdown.     |
| [ ]  | Login Page                      | Authenticate & issue JWT               | POST `/auth/login`                                                                                                    | Public                       | Store token in secure storage.                        |
| [ ]  | Profile Page                    | Show personal info                     | GET `/auth/me` or GET `/users/profile`                                                                                | user, mosqueAuthority, admin | Use one endpoint consistently.                        |
| [ ]  | Edit Profile Page               | Update name, password, contact info    | PUT `/users/update`                                                                                                   | user, mosqueAuthority, admin | Validate password length & email format.              |
| [ ]  | Favorites Page                  | View saved Hajj/Umrah packages & events| GET `/users/favorites`                                                                                                | user, mosqueAuthority, admin | Tabs for Hajj, Umrah, Events.                         |
| [ ]  | Add to Favorites                | Save packages/events                   | POST `/users/favorites/hajj/:packageId` <br> POST `/users/favorites/umrah/:id` <br> POST `/users/favorites/event/:id` | user, mosqueAuthority, admin | Buttons/icons for quick add/remove.                   |
| [ ]  | Users Management Dashboard      | Admin controls over users              | GET `/users`, POST `/users`, GET `/users/:id`, PUT `/users/:id`, PATCH `/users/:id/role`, DELETE `/users/:id`         | admin, mosqueAuthority (limited) | Role dropdowns, confirm dialogs for delete.       |
| [ ]  | FCM Token Setup                 | Manage device tokens                   | PATCH `/users/fcm-token`                                                                                              | user, mosqueAuthority, admin | Needed for push notifications.                        |
| [ ]  | Notifications Settings Page     | Manage alerts preferences              | PATCH `/users/fcm-token` (toggle states)                                                                              | user, mosqueAuthority, admin | Optional toggles for Adhan, events, announcements.    |

---

### 2. Jamat Schedule

| Done | Module / Page            | Purpose (UI)                  | APIs to Call                                                                                   | Access                 | Extra Notes                           |
| ---- | ------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------- |
| [ ]  | Today’s Jamat Times Page | Show iqama times for today    | GET `/jamat/today`                                                                             | Public                 | Display as timetable with icons.      |
| [ ]  | 10-Day Schedule Page     | Show extended jamat schedule  | GET `/jamat/ten-days`                                                                          | user, guest            | Calendar/table view.                   |
| [ ]  | Jamat Admin Dashboard    | Manage prayer schedules       | POST `/jamat`, PATCH `/jamat/:id/prayer`, POST `/jamat/auto-fill`, DELETE `/jamat/:id`         | mosqueAuthority, admin | Inline editing for single prayer.     |
| [ ]  | Edit Single Prayer Time  | Update iqama time             | PATCH `/jamat/:id/prayer`                                                                      | mosqueAuthority, admin | Small inline edit UI.                  |
| [ ]  | Auto-fill Jamat Screen   | Auto-generate schedule        | POST `/jamat/auto-fill`                                                                        | mosqueAuthority, admin | Use lat/lon to pull times from API.   |
| [ ]  | Delete Schedule Action   | Remove mosque schedule        | DELETE `/jamat/:id`                                                                            | mosqueAuthority, admin | Confirmation dialog required.         |

---

### 3. Prayer Times & Qibla

| Done | Module / Page         | Purpose (UI)                | APIs to Call                  | Access | Extra Notes                        |
| ---- | --------------------- | --------------------------- | ----------------------------- | ------ | ---------------------------------- |
| [ ]  | Prayer Times Today    | Show daily Salah times      | GET `/prayer-times/today`     | Public | Can also show Surah/verse snippet. |
| [ ]  | Qibla Finder Page     | Compass to Kaaba            | GET `/prayer-times/fetch`     | Public | Use map/compass integration.       |

---

### 4. Events

| Done | Module / Page         | Purpose (UI)                 | APIs to Call                       | Access                 | Extra Notes                                 |
| ---- | --------------------- | ---------------------------- | ---------------------------------- | ---------------------- | ------------------------------------------- |
| [ ]  | Events List Page      | Browse/search mosque events  | GET `/events`                      | Public                 | Search & filter UI.                          |
| [ ]  | Event Detail Page     | View details of event        | GET `/events/:id`                  | Public                 | Show images, description, date.              |
| [ ]  | Upcoming Event Page   | Highlight next event         | GET `/events/upcoming`             | Public                 | Banner or “starts soon” section.             |
| [ ]  | Event Admin Dashboard | Manage mosque events         | POST `/events`, PUT `/events/:id`, DELETE `/events/:id` | mosqueAuthority, admin | Support image upload.                        |

---

### 5. Mosque & Admin

| Done | Module / Page        | Purpose (UI)                  | APIs to Call                                   | Access                 | Extra Notes                     |
| ---- | -------------------- | ----------------------------- | ---------------------------------------------- | ---------------------- | ------------------------------- |
| [ ]  | Mosque List Page     | Admin can manage all mosques  | GET `/mosques`                                 | admin                  | Add search/sort by city.        |
| [ ]  | Mosque Detail Page   | Show/edit mosque details      | PUT `/mosques/:id`, DELETE `/mosques/:id`      | admin                  | Attach jamat/events inside tab. |
| [ ]  | Assign Authority     | Assign user as authority      | POST `/mosques/:id/assign-authority`           | admin                  | Dropdown + confirm popup.       |
| [ ]  | Mosque Users Page    | List users of a mosque        | GET `/mosques/:id/users`                       | admin, mosqueAuthority | Filter by roles.                |

---

### 6. Shared / Dashboard

| Done | Module / Page           | Purpose (UI)               | APIs to Call                                      | Access                       | Extra Notes                            |
| ---- | ----------------------- | -------------------------- | ------------------------------------------------- | ---------------------------- | -------------------------------------- |
| [ ]  | User Dashboard          | Quick view (prayer, event) | GET `/jamat/today`, GET `/events/upcoming`, GET `/users/favorites` | user, mosqueAuthority, admin | Role-based widgets.                    |
| [ ]  | Mosque Authority Dashboard | Manage mosque data      | Mix of `/jamat`, `/events`, `/mosques/:id/users`  | mosqueAuthority              | Management-centric.                    |
| [ ]  | Admin Dashboard         | Stats & controls           | `/users`, `/mosques`, `/donations`                | admin                        | Overview of system.                     |
| [ ]  | Donations Page          | Stripe/PayPal donations    | (future) POST `/donations`                        | user, mosqueAuthority, admin | Payment integration needed.             |
| [ ]  | Announcements Page      | Send mosque alerts         | (future) `/announcements`                         | mosqueAuthority, admin       | Push via FCM.                           |
| [ ]  | Search/Filter Bar       | Search across data         | UI logic only                                     | All                          | Works for events, mosques, users.       |
| [ ]  | Dark Mode Toggle 🌙     | Theme switcher             | UI logic only                                     | All                          | App-wide toggle.                        |

---

## 🧩 Future Enhancements

- [ ] Forgot Password / Reset Flow  
- [ ] Prayer Reminder Settings (per Jamat time)  
- [ ] Widget / Home Section with next prayer prominently  
- [ ] Event RSVP / Registration system  
- [ ] Event Notifications (“starts in 1 hour”)  
- [ ] Mosque Public Profile Page (address, imam, jamat schedule, events)  
- [ ] Donations Page (Stripe/PayPal integration)  
- [ ] Announcements Page (integrated with FCM)  


---

## 🧩 Next Release


### 1. Donations

| Done | Endpoint          | Method | Purpose                        | Access                 |
| ---- | ----------------- | ------ | ------------------------------ | ---------------------- |
| [ ]  | `/donate/stripe`  | POST   | Create Stripe checkout session | user                   |
| [ ]  | `/donate/history` | GET    | User donation history          | user                   |
| [ ]  | `/donate`         | GET    | List mosque donations          | mosqueAuthority, admin |
| [ ]  | `/donate`         | POST   | Record manual donation         | mosqueAuthority, admin |
| [ ]  | `/donate/:id`     | DELETE | Remove donation record         | mosqueAuthority, admin |


### 2. Salat Tracking

| Done | Endpoint         | Method | Purpose                   | Access                 |
| ---- | ---------------- | ------ | ------------------------- | ---------------------- |
| [ ]  | `/salat/track`   | POST   | Mark prayer completed     | user                   |
| [ ]  | `/salat/today`   | GET    | Today’s completion status | user                   |
| [ ]  | `/salat/history` | GET    | Retrieve prayer logs      | user                   |
| [ ]  | `/salat/summary` | GET    | Mosque prayer statistics  | mosqueAuthority, admin |


### 3. Quran & Qibla

| Done | Endpoint           | Method | Purpose                | Access |
| ---- | ------------------ | ------ | ---------------------- | ------ |
| [ ]  | `/quran/surah/:id` | GET    | Surah or verse content | Public |
| [ ]  | `/qibla/direction` | GET    | Get Qibla coordinates  | Public |


### 4. Hajj & Umrah Packages

| Done | Endpoint                  | Method | Purpose                        | Access                 |
| ---- | ------------------------- | ------ | ------------------------------ | ---------------------- |
| [ ]  | `/packages/hajj`          | GET    | List hajj packages             | Public                 |
| [ ]  | `/packages/hajj/:id`      | GET    | Single hajj package            | Public                 |
| [ ]  | `/packages/hajj/favorite` | POST   | Add hajj package to favourites | user                   |
| [ ]  | `/packages/hajj`          | POST   | Create hajj package            | mosqueAuthority, admin |
| [ ]  | `/packages/hajj/:id`      | PUT    | Update hajj package            | , admin |
| [ ]  | `/packages/hajj/:id`      | DELETE | Delete hajj package            | mosqueAuthority, admin |

*(same endpoints apply for `/packages/umrah`)*


### 5. Future Enhancements

| Done | Endpoint                  | Method | Purpose                        | Access                 |
| ---- | ------------------------- | ------ | ------------------------------ | ---------------------- |
| [ ]  | `/mosques/my`             | GET    | For convenience                | user                   |

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
- [ ] Forgot Password / Reset Flow (Authentication)  
- [ ] Prayer Reminder Settings (choose notifications per Jamat time)  
- [ ] Widget / Home Section showing next prayer time prominently  
- [ ] Event RSVP / Registration system  
- [ ] Event Notifications (e.g., “Event starts in 1 hour”)  
- [ ] Mosque Public Profile Page (address, imam, schedule, events) 

---

## 👨‍💻 Author

Developed by **Sapiens Station**

> For issues, open a GitHub Issue or contact the maintainer.
