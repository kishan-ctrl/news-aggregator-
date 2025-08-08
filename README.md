# 📰 Real-Time News Aggregator

A Node.js + MongoDB application that automatically fetches the latest news from the [NewsAPI](https://newsapi.org/) based on user preferences, stores them in MongoDB, and delivers **real-time notifications** via WebSockets (Socket.IO) to connected clients.  
Users can register, log in with JWT authentication, set preferences, favorite/unfavorite articles, and receive instant updates when new articles matching their preferences are fetched.

---

## 🚀 Features
- **JWT Authentication** for secure user access
- **Signup/Login** with password hashing using bcrypt
- **User Preferences** to filter news categories
- **Automatic News Fetch** every minute using `node-cron`
- **Store Articles** in MongoDB
- **Real-Time Notifications** with Socket.IO
- **Favorite / Unfavorite Articles**
- **View Favorite Articles**
- RESTful API ready for Postman testing
- Lightweight HTML frontend (`page.html`) for live news updates

---

## 📦 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Real-Time:** Socket.IO
- **Job Scheduling:** node-cron
- **API Provider:** NewsAPI
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcrypt for password hashing

---

## 📂 Project Structure
news-aggregator/
│
├── config/
│ └── db.js # MongoDB connection
├── jobs/
│ ├── fetchNews.js # Cron job to fetch news and send to clients
│ └── page.html # Simple frontend for testing notifications
├── middleware/
│ └── auth.js # JWT authentication middleware
├── models/
│ ├── User.js # User schema
│ └── Article.js # Article schema
├── routes/
│ ├── auth.js # Signup/Login routes
│ └── articles.js # Article CRUD & favorites
├── .env # Environment variables
├── Server.js # Main server file
└── package.json

yaml
Copy
Edit

---

## ⚙️ Installation & Setup


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/news-aggregator.git

# 📰 News Aggregator API

A Node.js-based news aggregation service that fetches articles based on user preferences and allows favoriting articles.

## 🛠️ Prerequisites
- Node.js (v14+)
- MongoDB (running locally)
- [NewsAPI](https://newsapi.org/) account (for API key)

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/news-aggregator.git
cd news-aggregator
npm install

### Environment Configuration
```bash

PORT=5000
MONGO_URL=mongodb://localhost:27017/News-Aggregator
JWT_SECRET=your_generated_secret
NEWS_API_KEY=your_newsapi_key


### Generate JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"


### Start Service

```bash
node Server.js

### Expected Output

```bash

🚀 Server running on 5000
MongoDB is connected successfully

### Postman Request 
```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "pass123",
  "preference": ["technology", "sports"]
}

### Signup Testing in postman

![Project Logo](./Images/WhatsApp%20Image%202025-08-08%20at%2017.13.24_97c0b509.jpg)