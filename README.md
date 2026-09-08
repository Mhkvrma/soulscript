# SoulScript

SoulScript is a web-based mental well-being and self-reflection platform designed to help users understand their emotional patterns through mood tracking, energy assessment, guided questions, and journal-based sentiment analysis.

## Features

- 🔐 User registration and secure login
- 😊 Mood assessment
- ⚡ Energy-level tracking
- 📝 Guided emotional questionnaire
- 📖 Personal journaling
- 🧠 Journal sentiment analysis
- 📊 Emotional Index calculation
- 📈 Assessment history and visual charts
- 💾 MongoDB-based data persistence
- 🔑 JWT-based authentication

## How It Works

The application follows a simple assessment flow:

```text
User Registration / Login
          ↓
    Mood & Energy
          ↓
 Guided Questions
          ↓
      Journal
          ↓
 Sentiment Analysis
          ↓
  Emotional Index
          ↓
      Dashboard
          ↓
 Assessment History
Emotional Index

SoulScript calculates an Emotional Index using multiple factors:

Mood
Energy level
Questionnaire responses
Journal sentiment

The combined score is normalized between 0 and 1 and displayed as a percentage on the dashboard.

Note: The Emotional Index is intended for self-reflection and awareness. It is not a medical diagnosis or a substitute for professional mental-health assessment.

Tech Stack
Frontend
HTML5
CSS3
JavaScript
Chart.js
Backend
Node.js
Express.js
REST APIs
Database
MongoDB
Mongoose
Authentication & Security
JSON Web Tokens (JWT)
bcryptjs
Environment variables using dotenv
Project Structure
SoulScript/
│
├── Backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── result.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   └── journal.css
│   ├── js/
│   │   └── app.js
│   ├── index.html
│   ├── guest.html
│   ├── ques.html
│   ├── journal.html
│   ├── dashboard.html
│   └── history.html
│
├── .gitignore
└── README.md
Installation & Setup
1. Clone the repository
git clone https://github.com/Mhkvrma/soulscript.git
cd soulscript
2. Install backend dependencies
cd Backend
npm install
3. Configure environment variables

Create a .env file inside the Backend directory:

MONGO_URI=mongodb://127.0.0.1:27017/SoulScript
JWT_SECRET=your_secret_key

Do not commit the .env file to GitHub.

4. Start MongoDB

Make sure your local MongoDB server is running.

5. Start the backend server

From the Backend directory:

node server.js

The server will run at:

http://localhost:5050
6. Open SoulScript

Open:

http://localhost:5050
API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
Assessment
POST /api/submit
History
GET /api/history/emotional-index
GET /api/history/mood
GET /api/history/energy
GET /api/history/all

Authenticated endpoints require a JWT token in the request header:

Authorization: Bearer <token>
Database

SoulScript uses MongoDB to store:

User accounts
Assessment results
Mood and energy values
Questionnaire scores
Journal entries
Emotional Index scores
Sentiment scores

Mongoose is used as the ODM layer between the Node.js backend and MongoDB.

Security

The application uses:

Password hashing with bcryptjs
JWT-based authentication
Protected API routes
Environment variables for sensitive configuration
.gitignore to prevent .env and node_modules from being committed
Future Enhancements
🤖 Machine-learning-based sentiment analysis
📱 Responsive mobile-first interface
📊 More advanced emotional trend visualization
🔔 Personalized wellness reminders
👤 User profile management
🧠 More comprehensive NLP analysis
☁️ Cloud deployment
🔒 Additional security and privacy improvements
Disclaimer

SoulScript is an educational and self-reflection project. The Emotional Index and related insights are not intended to diagnose, treat, or prevent any mental-health condition.

Author

Mahak Verma

B.Tech — Computer Science & Engineering (Artificial Intelligence)

Indira Gandhi Delhi Technical University for Women (IGDTUW)