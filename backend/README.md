# CampusOS — City University Hub Backend System

Production-grade, strict TypeScript backend system for **CampusOS — City University Hub** built with Express.js, Mongoose, and MongoDB.

---

## 🛠️ Technology Stack & Architecture

- **Runtime & Language**: Node.js (LTS), TypeScript (Strict Mode enabled).
- **Web Framework**: Express.js with `helmet`, `cors`, `morgan`, and `express-rate-limit`.
- **Database & ODM**: MongoDB with Mongoose (strict schema validation, compound indices, and text search indices).
- **Authentication**: Stateless JWT with `bcryptjs` password hashing and role-based access control (`STUDENT`, `CLUB_ADMIN`, `UNIVERSITY_ADMIN`).
- **Data Validation**: Strict runtime schema parsing via Zod.
- **Context & Localization**: Bangladeshi university semester model (Spring/Summer/Fall; departments CSE, EEE, BBA, English, Law, Civil, Pharmacy; course codes `^[A-Z]{3}-[0-9]{3}$`).

---

## 📁 Directory Structure Verbatim

```
backend/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
├── jest.config.ts
├── README.md
│
├── src/
│   ├── app.ts                  # Express app config
│   ├── server.ts               # App bootstrap & graceful shutdown
│   │
│   ├── config/                 # App configuration
│   │   ├── env.ts              # Env validation (Zod)
│   │   ├── database.ts         # DB connection & lifecycle
│   │   ├── jwt.ts              # JWT configuration
│   │   └── index.ts
│   │
│   ├── constants/              # Global constants
│   │   ├── roles.ts            # User roles (STUDENT, CLUB_ADMIN, UNIVERSITY_ADMIN)
│   │   ├── enums.ts            # Departments, categories, formats, patterns
│   │   └── messages.ts         # Central response messages
│   │
│   ├── modules/                # Feature-based modular architecture
│   │   ├── auth/               # Register, login, profile, user model
│   │   ├── event/              # Event management, atomic RSVP, passes
│   │   ├── resource/           # Course materials, text & regex search, upvoting
│   │   ├── helpdesk/           # Campus FAQ, pinned guidelines, notices
│   │   ├── lost-found/         # Lost and found listings and resolution
│   │   └── complaint/          # Grievance box, anonymous masking, public tracking
│   │
│   ├── middlewares/            # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── routes/                 # Route aggregator
│   │   └── index.ts
│   │
│   ├── utils/                  # Helper utilities
│   │   ├── AppError.ts
│   │   ├── catchAsync.ts
│   │   ├── sendResponse.ts
│   │   ├── logger.ts
│   │   ├── pagination.ts
│   │   └── crypto.ts
│   │
│   ├── types/                  # Global TypeScript types
│   │   ├── express.d.ts
│   │   └── index.ts
│   │
│   ├── docs/                   # API documentation
│   │   └── api.md
│   │
│   ├── seeds/                  # Idempotent DB seeder
│   │   └── seed.ts
│   │
│   └── scripts/                # Dev scripts
│       └── seed.ts
│
└── tests/                      # Unit and integration test suites
    ├── unit/
    └── integration/
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18.x
- MongoDB (local instance on `mongodb://localhost:27017/campusos` or MongoDB Atlas URI)

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusos
JWT_SECRET=super_secret_jwt_signing_key_for_campusos_city_university_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 3. Installation
```bash
npm install
```

### 4. Database Seeding
Execute the idempotent database seeder to populate realistic Bangladeshi university data:
```bash
npm run seed
```
Pre-seeded test credentials:
- **Student**: `student@city.edu` / `password123`
- **Club Admin**: `club@city.edu` / `password123`
- **University Admin**: `admin@city.edu` / `admin123`

### 5. Running the Application
Development server (with ts-node-dev hot reload):
```bash
npm run dev
```

Build and run in production:
```bash
npm run build
npm start
```

---

## 🧪 Testing

Execute test suites with Jest and in-memory MongoDB:
```bash
# Run all tests (unit + integration)
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

---

## 📖 API Documentation
Full API documentation with schemas, parameters, and curl examples is available in [src/docs/api.md](file:///d:/OrbitCU/OrbitCU-Server/backend/src/docs/api.md).
