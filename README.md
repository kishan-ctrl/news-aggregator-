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

text

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/news-aggregator.git
cd news-aggregator
2️⃣ Install Dependencies
bash
npm install
3️⃣ Create .env File
Create a .env file in the root folder:

env
PORT=5000
MONGO_URL=mongodb://localhost:27017/News-Aggregator
JWT_SECRET=your_generated_secret
NEWS_API_KEY=your_newsapi_key
Generate a JWT secret:

bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
Get your NewsAPI key and place it in .env.

4️⃣ Start MongoDB
Make sure MongoDB is running locally:

bash
mongod
5️⃣ Start the Server
bash
node Server.js
You should see:

text
🚀 Server running on 5000
MongoDB is connected successfully
🧪 API Testing (Postman)
Signup
bash
POST http://localhost:5000/auth/signup
Headers:
Content-Type: application/json
Body:
{
  "email": "user@example.com",
  "password": "pass123",
  "preference": ["technology", "sports"]
}
Login
bash
POST http://localhost:5000/auth/login
Headers:
Content-Type: application/json
Body:
{
  "email": "user@example.com",
  "password": "pass123"
}
Response: Returns a JWT token for use in authorized requests.

Get Articles
bash
GET http://localhost:5000/articles
Headers:
Authorization: Bearer <your_token>
Get Single Article
bash
GET http://localhost:5000/articles/:id
Favorite an Article
bash
POST http://localhost:5000/articles/:id/favorite
Headers:
Authorization: Bearer <your_token>
Remove Favorite
bash
DELETE http://localhost:5000/articles/:id/favorite
Headers:
Authorization: Bearer <your_token>
Get Favorite Articles
bash
GET http://localhost:5000/articles/favorites
Headers:
Authorization: Bearer <your_token>
