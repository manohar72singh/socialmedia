# Tech Digi - Digital Marketing Agency

This project is a premium, AI-powered digital marketing agency platform featuring a modern animated frontend, a fully functional CMS dashboard, and an integrated AI assistant.

---

## 1. Technology Decisions

### Why we selected this tech stack:
We utilized a modern **React (Vite) + Express + MySQL** stack (a customized relational stack).
- **Frontend (Vite + React + Tailwind CSS + Framer Motion):** 
  - **Vite** was chosen over Create React App because it provides lightning-fast Hot Module Replacement (HMR) and highly optimized production builds using Rollup.
  - **React** allows for a highly reusable, state-driven component architecture. 
  - **Tailwind CSS** was selected because it ensures microscopic CSS payloads by purging unused utility classes, allowing rapid, inline styling without bloated CSS files.
  - **Framer Motion** was integrated to handle complex, premium animations (such as the 3D About cards and staggered list reveals) smoothly without manually writing heavy CSS keyframes.
- **Backend (Node.js + Express):** Express is lightweight, highly scalable, and perfectly suits the REST API architecture needed for our custom CMS, database queries, and chatbot routing.
- **Database (MySQL):** A relational database ensures strict schema enforcement. Since an agency manages distinct, non-document-based client data (like specific leads with structured columns for name, email, and service), relational integrity is far superior to a NoSQL approach.

### Why the architecture is suitable:
This decoupled **Client-Server architecture** allows the frontend and backend to scale independently. The frontend SPA can be hosted on edge networks (like Vercel or Netlify) for ultra-fast CDN delivery worldwide. Meanwhile, the Express API and MySQL database can securely reside on a protected backend server (like AWS or DigitalOcean), isolated from public access.

---

## 2. Project Architecture

### Frontend Structure (`/client`)
The frontend is built as a Single Page Application (SPA).
- **Core Components:** Reusable UI components including `Navbar.jsx`, `Footer.jsx`, `ContactForm.jsx`, `Preloader.jsx`, and `CustomCursor.jsx`.
- **Page Sections:** Modularized sections like `Hero.jsx`, `About.jsx`, `Services.jsx`, `WhyUs.jsx`, and `Testimonials.jsx`.
- **State Management:** Handled via React Hooks (`useState`, `useEffect`) and `sessionStorage`/`localStorage` for persistence (e.g., tracking the Preloader so it only runs once per session, and saving chatbot history).
- **Routing:** Handled via `react-router-dom`. The `<AnimatedRoutes>` wrapper uses `AnimatePresence` to manage seamless, fade-in/fade-out page transitions. 
- **Performance:** Code-splitting (`React.lazy`) is used for heavy components like `AdminDashboard` and `ChatWidget` to ensure incredibly fast initial load times.

### Backend Structure (`/server`)
The backend acts as a strict API layer utilizing standard REST conventions.
- **Routes:** 
  - `GET/POST /api/leads` - For capturing contact form submissions and viewing them in the admin panel.
  - `GET/POST/PUT/DELETE /api/services` - Full CRUD functionality for dynamic service offerings.
  - `GET/POST/PUT/DELETE /api/testimonials` - Full CRUD functionality for client reviews.
  - `POST /api/chat` - The gateway to the Gemini AI API.
- **Controllers/Logic:** Contained within the route files, handling request validation and direct database interactions.

### Database Selection & Schema
**MySQL** was selected to ensure data integrity. Connection pooling (`mysql2/promise`) is utilized to maintain high performance and prevent connection timeouts during concurrent traffic.
- **Tables:**
  - `leads`: Stores `id`, `name`, `email`, `phone`, `service`, `message`, `created_at`.
  - `services`: Stores `id`, `title`, `description`, `icon`, `created_at`.
  - `testimonials`: Stores `id`, `name`, `role`, `content`, `image`, `created_at`.

### API Flow
1. The React Client sends an HTTP request (GET/POST) using the native `fetch` API.
2. The Express Server intercepts the request via the router.
3. The Server executes a secure, parameterized SQL query using the MySQL connection pool.
4. The database returns the result to the Server.
5. The Server responds to the Client with formatted JSON data, which updates the React State and the UI.

---

## 3. AI & Automation

### Chatbot Implementation
We implemented **TechBot**, an advanced AI assistant powered by the Google Gemini API (`@google/genai`).
- **Context Awareness:** The chatbot is initialized with a strict `systemInstruction` giving it a precise persona ("premium digital marketing agency assistant"). It is strictly instructed on pricing, services, and how to redirect non-marketing questions.
- **Conversation History Filtering:** The frontend stores the chat history. To comply with Gemini's strict sequence rules, the frontend filters out system welcome messages, and the backend intercepts the history array to collapse any consecutive messages of the same role (e.g., merging two consecutive user messages). This ensures the `user -> model -> user` sequence never breaks.
- **Error Handling:** If the Gemini API fails (e.g., due to a timeout or 500 error), the frontend catches the failure gracefully, blocks the JSON parsing crash, and displays a fallback message ("Sorry, I am having trouble connecting...") to ensure a seamless UX.

### Automation Workflow
- **Lead Capture Validation:** When a user submits the Contact Form, the input is immediately validated on the frontend using `react-hook-form`. A strict Regex pattern (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`) ensures exact email formatting, and the phone number is restricted to exactly 10 digits.
- **Automated Dashboard Syncing:** Validated data is stored directly into the `leads` database table. The Admin Dashboard automatically fetches and reflects this new data in real-time upon viewing, completely automating the lead tracking pipeline without manual entry.

---

## 4. SEO Optimization & Performance Improvements

### Technical SEO Improvements Implemented
- **Dynamic Meta Tags:** Used `react-helmet-async` to inject unique `<title>` and `<meta name="description">` tags into the `<head>` for every single page route (Home, About, Services, News, Contact, Privacy, Terms). This ensures search engine crawlers index each page properly with unique context.
- **Semantic HTML:** Replaced generic `<div>` tags with proper HTML5 semantic elements (`<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`, `<article>`) to improve accessibility and crawler understanding.
- **Performance/Lazy Loading:** All heavy external images (like remote Testimonial avatars and dynamic News thumbnails) utilize the `loading="lazy"` attribute. This defers the loading of off-screen images until the user scrolls near them, ensuring a near-instant initial page load.
- **Code Splitting:** Heavy JavaScript chunks (Admin Dashboard and Chat Widget) are dynamically imported via `React.lazy()`. This massively reduces the initial Time to Interactive (TTI), helping the site achieve a Google Lighthouse/PageSpeed score well above 85.
- **Lenis Smooth Scrolling:** Implemented `@studio-freight/lenis` native smooth scrolling physics to vastly improve User Experience (UX) metrics, which indirectly benefits SEO rankings by increasing average session duration.
