# V-REAL MEDIA — Cinematic Portfolio & Media CMS

> **"REAL STORIES. REAL PEOPLE. REAL IMPACT."**  
> Premium Cinematic Street Reality, Human Documentaries & Social Experiments Media Platform.

---

## 1. Overview & Architecture

V-REAL MEDIA is a production-grade digital platform engineered for high-impact street cinema, community social experiments, and unscripted human stories across Cambodia. The platform pairs a high-contrast cinematic public interface with a secure, real-time Firebase Content Management System (CMS).

```
v-real-media/
├── public/
│   ├── assets/
│   │   └── logo.jpg             # V-Real Media 3D claymorphic emblem
│   ├── robots.txt               # SEO indexing directives
│   └── sitemap.xml              # Search engine sitemap
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx       # Sticky glassmorphic nav with REC indicator
│   │   │   ├── Footer.jsx       # Brand info, tel:, mailto: & social links
│   │   │   └── PageTransition.jsx # Framer Motion route animations
│   │   ├── home/
│   │   │   ├── Hero.jsx         # 4K Viewfinder HUD, live REC, headline & CTAs
│   │   │   ├── About.jsx        # Editorial philosophy & 4 brand pillars
│   │   │   ├── PortfolioGrid.jsx# Category filtering & video gallery
│   │   │   ├── PortfolioCard.jsx# Hover interactions, badges, video trigger
│   │   │   ├── VideoModal.jsx   # Safe embed player (YouTube, TikTok, Vimeo)
│   │   │   └── LatestPosts.jsx  # Dynamic editorial feed preview
│   │   ├── posts/
│   │   │   └── PostCard.jsx     # Editorial story card
│   │   └── common/
│   │       ├── Loader.jsx       # Pulsing REC ring spinner
│   │       ├── EmptyState.jsx   # Empty state placeholder
│   │       ├── ConfirmDialog.jsx# Destructive delete modal
│   │       └── ProtectedRoute.jsx # RBAC & Custom Claim gate
│   ├── pages/
│   │   ├── Home.jsx             # Cinematic landing page
│   │   ├── AboutPage.jsx        # Mission, Vision, Methodology
│   │   ├── PortfolioPage.jsx    # Full searchable video archive
│   │   ├── NewsPage.jsx         # Dynamic stories & field notes
│   │   ├── PostDetails.jsx      # Article detail with safe video player
│   │   ├── Login.jsx            # Admin credentials authentication
│   │   ├── AdminDashboard.jsx   # Full dark-theme CMS (Posts & Portfolio)
│   │   └── NotFound.jsx         # Cinematic 404
│   ├── context/
│   │   └── AuthContext.jsx      # Firebase Auth & Custom Claim provider
│   ├── hooks/
│   │   ├── usePosts.js          # Firestore real-time post hook
│   │   └── usePortfolio.js      # Firestore real-time portfolio hook
│   ├── services/
│   │   ├── firebase.js          # Centralized Firebase initialization
│   │   ├── authService.js       # Authentication & token verification
│   │   ├── postService.js       # Firestore Posts CRUD
│   │   ├── portfolioService.js  # Firestore Portfolio CRUD
│   │   └── storageService.js    # Firebase Storage upload & cleanup
│   ├── config/
│   │   └── brand.js             # V-Real branding, contact & categories
│   ├── utils/
│   │   ├── videoUtils.js        # Safe video URL sanitization & providers
│   │   ├── formatDate.js        # Firestore Timestamp / Date formatters
│   │   └── slugify.js           # Unique slug generation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Tailwind base + custom scrollbar
├── scripts/
│   └── setAdminClaim.js         # Firebase Admin SDK custom claim CLI
├── firebase.json                # Hosting SPA rewrites & security rules targets
├── firestore.rules              # Production Firestore security rules
├── firestore.indexes.json       # Composite query indexes
├── storage.rules                # Production Firebase Storage security rules
├── tailwind.config.js           # Dark theme color palette & tokens
└── vite.config.js
```

---

## 2. Brand Identity & Design System

- **Primary Background**: `#050505`
- **Secondary Background**: `#0A0A0A`
- **Surface**: `#111111`
- **Elevated Surface**: `#1A1A1A`
- **Recording Red**: `#FF3030`
- **Dark Red**: `#C90000`
- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#A1A1AA`
- **Muted Text**: `#71717A`
- **Border**: `#27272A`
- **Subtle Border**: `#3F3F46`
- **Typography**: Space Grotesk, Inter, Manrope

### Official Brand Details
- **Brand**: V-REAL MEDIA
- **Phone**: `0968691543` (Display: `096 869 1543`)
- **Email**: `v.real.khmer@gmail.com`
- **Target URL**: `https://v-real.web.app`
- **TikTok**: `@V-Real`
- **YouTube**: `V-Real`

---

## 3. Getting Started & Installation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your Firebase client credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=v-real.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=v-real
VITE_FIREBASE_STORAGE_BUCKET=v-real.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...
```

### Step 3: Run Local Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 4. Administrator Setup & Security Rules

### Role-Based Access Control (RBAC) via Custom Claims
Access to the CMS (`/admin`, `/admin/posts`, `/admin/portfolio`) requires an authenticated Firebase user who holds the custom claim `{ admin: true }`.

To grant administrator permissions to your account:

1. In the **Firebase Console**, go to **Project Settings** → **Service accounts** → click **Generate new private key**.
2. Save the downloaded JSON file as `serviceAccountKey.json` in the root folder of this project.
3. Run the CLI script:
   ```bash
   node scripts/setAdminClaim.js v.real.khmer@gmail.com
   ```
4. Sign in at `http://localhost:3000/login` with `v.real.khmer@gmail.com`.

---

## 5. Firebase Security Rules

### Firestore Security (`firestore.rules`)
- **Public Users**: Read access restricted to documents where `status == 'published'`.
- **Administrators**: Full create, update, delete, and draft read access enforced via `request.auth.token.admin == true`.
- **Validation**: Strict checks on required fields (`title`, `slug`, `category`, `status`).

### Storage Security (`storage.rules`)
- **Public Users**: Read access for published media under `/uploads/{folder}/{docId}/{fileName}`.
- **Administrators**: Write access restricted to `{ admin: true }`.
- **File Validation**: Image MIME types (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) and max size `10MB`.

---

## 6. Deployment to Firebase Hosting

### Step 1: Install Firebase CLI & Login
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Build for Production
```bash
npm run build
```

### Step 3: Deploy to `v-real.web.app`
Deploy hosting, Firestore security rules, composite indexes, and Storage rules:
```bash
firebase deploy
```

Or deploy individual components:
```bash
# Hosting only
firebase deploy --only hosting

# Security rules only
firebase deploy --only firestore:rules,storage

# Firestore indexes only
firebase deploy --only firestore:indexes
```

---

## 7. Features Matrix

| Feature | Description | Status |
|---|---|---|
| **Cinematic Hero** | 4K Viewfinder HUD, animated REC indicator, video trigger | Ready |
| **Responsive Navbar** | Sticky scroll transition, brand emblem, contact & CMS links | Ready |
| **About Showcase** | Documentary philosophy, 4 brand pillars, origin story | Ready |
| **Portfolio Gallery** | Category filter, search, safe video modal playback | Ready |
| **News / Stories** | Real-time Firestore listener, slug routing, article reader | Ready |
| **Admin Dashboard** | Real-time stats, Post Manager, Portfolio Manager | Ready |
| **Image Upload** | Firebase Storage upload with live progress & preview | Ready |
| **Storage Cleanup** | Deletes associated image files when documents are removed | Ready |
| **RBAC Gate** | Enforces `{ admin: true }` Custom Claim on all CMS routes | Ready |
| **SEO & Meta** | OpenGraph tags, sitemap.xml, robots.txt | Ready |
