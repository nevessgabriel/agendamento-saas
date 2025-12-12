# SaaS Scheduling System (Multi-tenant)

A full-stack white-label scheduling platform designed for small businesses (barbershops, clinics, tutors). The system uses a **Multi-tenant architecture** to ensure data isolation between different companies while sharing the same infrastructure.

Built with **Vue.js 3** and **Node.js**, focusing on performance, security, and data integrity.

## Tech Stack

### Frontend
- **Framework:** Vue.js 3 (Composition API)
- **State Management:** Pinia
- **Routing:** Vue Router
- **HTTP Client:** Axios (with Interceptors for JWT injection)
- **Styling:** CSS3 (Scoped & Responsive)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **Architecture:** Monorepo with MVC Pattern

---

## ✨ Key Features

- **🔐 Multi-tenancy & Security:**
  - Logic separation of data using `company_id`.
  - Secure Authentication flow with JWT.
  - Password hashing with Bcrypt.

- **📅 Advanced Scheduling Logic:**
  - **Conflict Detection:** Algorithms to prevent overlapping appointments.
  - **ACID Transactions:** Uses PostgreSQL transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) to ensure booking integrity during high concurrency.
  
- **⚡ Reactive UI:**
  - Real-time updates on the Dashboard.
  - Optimistic UI updates for better user experience.
  - Visual Calendar for slot management.

---

## 📸 Screenshots

### Dashboard & Service Management
![Dashboard View] soon 

### Scheduling Calendar
![Calendar View] soon
---
