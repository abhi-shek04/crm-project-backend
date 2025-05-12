# CRM Backend – Professional SaaS-Style API

## 🚀 Overview
A modern, scalable CRM backend supporting customer segmentation, campaign management, AI-powered insights, analytics, and Google OAuth authentication. Built for the Xeno SDE Internship assignment, but ready for real-world SaaS use.

---

## 🏗️ Architecture Diagram
```
[Frontend (React/Next.js)]
        |
        v
[API Gateway / Express.js Backend]
        |
        v
[MongoDB]   [OpenAI API]   [Google OAuth]
        |
        v
[Optional: Kafka/Redis for pub-sub]
```

---

## ⚙️ Setup Instructions
1. **Clone the repo:**
```bash
git clone <your-repo-url>
   cd crm-project-4/server
```
2. **Install dependencies:**
```bash
npm install
```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in:
     - `MONGO_URI`, `JWT_SECRET`, `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`, etc.
4. **Start the backend:**
   ```bash
   npm start # or node server.js
   ```
5. **Run tests:**
```bash
   npm test
   ```
6. **API Docs:**
   - Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) for Swagger UI.

---

## 🔑 Features
- Customer & Order ingestion APIs (CRUD, pub-sub simulation)
- Campaign management (CRUD, segment builder, delivery simulation, stats)
- Communication log for campaign delivery
- Analytics endpoints (open rate, delivery, audience growth)
- AI-powered segment rule parser (OpenAI or mock)
- Google OAuth 2.0 authentication + JWT
- Secure, rate-limited, and production-ready
- Fully documented with Swagger

---

## 🤖 AI & Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, Google OAuth 2.0 (Passport.js)
- **AI:** OpenAI API (for segment rule parsing, message suggestions)
- **Testing:** Jest, Supertest
- **Docs:** Swagger (OpenAPI 3.0)
- **Bonus:** Pub-sub simulation, consumer-driven delivery, analytics

---

## 📝 Usage & Demo
- Use Swagger UI or Postman to test all endpoints.
- For Google OAuth, set up credentials in Google Cloud Console and update `.env`.
- For AI endpoints, set `OPENAI_API_KEY` or use the built-in mock.
- All endpoints are JWT-protected; obtain a token via login or OAuth.

---

## ⚠️ Known Limitations / Assumptions
- Pub-sub and consumer-driven delivery are simulated (can be extended with Kafka/Redis).
- AI endpoints use OpenAI if available, otherwise mock responses.
- No production email/SMS delivery (demo only).
- Frontend integration is assumed (React/Next.js recommended).

---

## 📦 Submission Checklist
- [x] All core and bonus features implemented
- [x] Automated and manual tests pass
- [x] API documented in Swagger
- [x] README polished and complete
- [x] No secrets or sensitive data in codebase

---

## 💡 Questions?
Open an issue or contact the maintainer for help!
