# CipherNova Setup Instructions

Follow the steps below to set up and run the CipherNova cybersecurity awareness platform.

---

## 📦 Requirements

### System Requirements
- **Node.js** v18+ (LTS recommended)
- **npm** v8+ or **yarn** v1.22+
- **Git** for version control

### External Services
- **Supabase Account** (for database and authentication)
- **Google Cloud Console** (for Web Risk API - optional)

### Environment Variables
Create the following environment files:

#### Backend (.env.local)
```bash
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
JWT_SECRET=your_jwt_secret_key

# Google Web Risk API (optional)
GOOGLE_API_KEY=your_google_api_key

# Server Configuration
CLIENT_ORIGIN=http://localhost:3001
NODE_ENV=development
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:3000
```

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CipherNova.git
cd CipherNova
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd src/backend

# Install dependencies
npm install

# Or using yarn
yarn install
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd src/frontend

# Install dependencies
npm install

# Or using yarn
yarn install
```

### 4. Database Setup
1. Create a **Supabase** project at https://supabase.com
2. Set up the following tables in your Supabase dashboard:

#### Users Table
```sql
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  xp INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Verified',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Community Table
```sql
CREATE TABLE Community (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  type VARCHAR(50),
  risk_level VARCHAR(20),
  reports INTEGER DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE
);
```

#### Reports Table
```sql
CREATE TABLE Reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES Users(id),
  url TEXT NOT NULL,
  detection_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### UserBadges Table
```sql
CREATE TABLE UserBadges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES Users(id),
  badge_name VARCHAR(255) NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW()
);
```

---

## ▶️ Running the Project

### Development Mode

#### 1. Start the Backend Server
```bash
# From the backend directory
cd src/backend
npm start

# Server will run on http://localhost:3000
```

#### 2. Start the Frontend Development Server
```bash
# From the frontend directory (in a new terminal)
cd src/frontend
npm start

# Frontend will run on http://localhost:3001
```

### Production Mode

#### Backend
```bash
cd src/backend
npm run build
npm run start:prod
```

#### Frontend
```bash
cd src/frontend
npm run build
# Serve the build folder with your preferred web server
```

---

## 🧪 Testing the Application

1. **Register a new account** at http://localhost:3001/register
2. **Login** with your credentials
3. **Test the detection tools**:
   - Email analysis: Enter suspicious email addresses
   - Link analysis: Test URLs for phishing detection
   - Message analysis: Analyze suspicious messages
4. **Explore community features** to view reported threats

---

## 🔧 Troubleshooting

### Common Issues

#### "CORS Error"
- Ensure `CLIENT_ORIGIN` in backend `.env.local` matches your frontend URL
- Check that both servers are running on the correct ports

#### "Supabase Connection Failed"
- Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check your Supabase project is active and accessible

#### "Module Not Found"
- Run `npm install` in both frontend and backend directories
- Clear node_modules and reinstall if needed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Conflicts
If default ports are in use:
- Backend: Change port in `server.js` (default: 3000)
- Frontend: Set `PORT=3002` in frontend `.env` file

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Google Web Risk API](https://developers.google.com/web-risk)
