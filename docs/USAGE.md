# CipherNova Usage Guide

This document provides comprehensive instructions on how to use the CipherNova cybersecurity awareness platform.

---

## ▶️ Running the Application

### Quick Start
```bash
# 1. Start the backend server (from backend directory)
cd src/backend
npm start

# 2. Start the frontend (from frontend directory, in a new terminal)
cd src/frontend
npm start
```

### Access URLs
- **Frontend Application**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

---

## 🖥️ How to Use CipherNova

### 1. Getting Started

#### Registration & Login
1. **Navigate** to http://localhost:3001
2. **Click "Register"** to create a new account
3. **Fill in your details**: First Name, Last Name, Email, Password
4. **Click "Create Account"** - you'll be automatically logged in
5. **Alternatively**, use the login form if you already have an account

#### Dashboard Overview
After logging in, you'll see the main dashboard with:
- **Personal Stats**: Your XP, analyses completed, threat detection rate
- **Recent Activity**: Your latest security analyses
- **Community Leaderboard**: Top community contributors
- **Quick Actions**: Fast access to detection tools

### 2. Threat Detection Tools

#### Email Address Analysis
1. **Navigate** to "Detection Tools" from the main menu
2. **Select "Email"** as the content type
3. **Enter an email address** (e.g., `suspicious@temp-mail.org`)
4. **Click "Analyze Email"**
5. **Take the interactive quiz** to test your knowledge
6. **Review the detailed analysis** including:
   - Domain reputation
   - Typosquatting detection
   - Temporary email service identification
   - Risk score and recommendations

#### URL/Link Analysis
1. **Select "Link"** as the content type
2. **Paste a suspicious URL** (e.g., `http://g00gle-security.tk/phishing`)
3. **Click "Analyze Link"**
4. **Complete the security awareness quiz**
5. **Review the multi-layer analysis**:
   - Google Web Risk API results
   - Lookalike domain detection
   - Suspicious TLD identification
   - Plain-English security assessment

#### Message Content Analysis
1. **Select "Message"** as the content type
2. **Paste suspicious message content**, such as:
   ```
   URGENT: Your account will be suspended! 
   Click here immediately to verify your information 
   and claim your $1000 prize!
   ```
3. **Click "Analyze Message"**
4. **Take the educational quiz**
5. **Explore the comprehensive analysis**:
   - High-risk indicators (urgency, prize claims, money requests)
   - Suspicious indicators (authority impersonation, clickbait)
   - Minor concerns (grammar issues, generic greetings)
   - Risk score and threat summary

#### Domain WHOIS Lookup
1. **Select "Domain"** as the content type
2. **Enter a domain name** (e.g., `suspicious-site.com`)
3. **Click "Analyze Content"**
4. **Review domain information**:
   - Registrar details
   - Domain age and creation date
   - Risk assessment based on domain characteristics

### 3. Learning & Gamification

#### XP System
- **Earn XP** for every analysis performed (+30 XP)
- **Bonus XP** for correct quiz answers (+50 XP)
- **Community contribution** rewards (+100 XP)
- **Track your progress** on the dashboard

#### Interactive Quizzes
- **Dynamic questions** based on actual analysis results
- **Educational feedback** for both correct and incorrect answers
- **Security tips** tailored to the content type
- **Progressive learning** through hands-on experience

### 4. Community Features

#### Community Reports Page
1. **Navigate** to "Community" from the main menu
2. **View reported threats** from the community
3. **Browse by content type**: Email, Link, Message, Domain
4. **Check risk levels** and threat indicators
5. **Learn from real-world examples**

#### Reporting Suspicious Content
1. **After analyzing content**, click "Report to Community"
2. **Earn bonus XP** for community contributions
3. **Help protect others** by sharing threat intelligence
4. **View your reports** in the community feed

#### Safety Tips Carousel
- **Interactive safety tips** on the community page
- **Navigate through** cybersecurity best practices
- **Learn prevention techniques** for common threats

### 5. Advanced Features

#### Multi-Layer URL Analysis
CipherNova uses a sophisticated 3-layer approach for URL analysis:
- **Layer 1**: Google Web Risk API threat detection
- **Layer 2**: Brand lookalike and typosquatting detection
- **Layer 3**: Suspicious TLD identification

#### Comprehensive Message Analysis
The system detects 12 different types of phishing indicators:
- Urgency language, prize claims, threat language
- Money requests, personal info requests
- Authority impersonation, clickbait, scarcity tactics
- Grammar errors, generic greetings, external links

---

## 🎥 Demo

### Demo Materials
Check out the comprehensive demos:
- **[Demo Video](../demo/Demovid(1).mp4)** - Full walkthrough of all features
- **[Demo Presentation](../demo/Presentation-CipherNova.pptx)** - Technical overview and use cases

### Example Test Cases

#### High-Risk Email
```
phishing@temp-mail-generator.tk
```

#### Suspicious URL
```
https://g00gle-security-update.tk/verify-account
```

#### Phishing Message
```
CONGRATULATIONS! You've won $5000 in our lottery! 
Click here IMMEDIATELY to claim your prize before it expires. 
Send your SSN and credit card info to verify your identity.
```

#### Recently Registered Domain
```
urgent-security-update.ga
```

---

## 📌 Important Notes

### Security Best Practices
- **Never enter real credentials** during testing
- **Use the platform for educational purposes** only
- **Always verify suspicious content** through official channels
- **Report real threats** to appropriate authorities

### Platform Features
- **Real-time analysis** with immediate feedback
- **Educational focus** with interactive learning
- **Community-driven** threat intelligence
- **Gamified experience** to encourage learning

### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **JavaScript must be enabled** for full functionality
- **Responsive design** works on desktop, tablet, and mobile

### Performance Tips
- **Clear browser cache** if experiencing issues
- **Ensure stable internet connection** for API calls
- **Use incognito/private mode** for testing multiple accounts
- **Keep browser tabs minimal** for optimal performance

### Troubleshooting
- **503 Errors**: Check if backend server is running
- **CORS Issues**: Verify CLIENT_ORIGIN environment variable
- **Database Errors**: Confirm Supabase connection settings
- **Missing Features**: Ensure all dependencies are installed

### Educational Value
- **Learn to identify** common phishing techniques
- **Understand threat indicators** through hands-on analysis
- **Develop security awareness** through gamified learning
- **Contribute to community safety** through threat reporting

---

## 🚀 Getting the Most Out of CipherNova

1. **Start with obvious threats** to understand the system
2. **Progress to subtle phishing attempts** as you learn
3. **Participate in the community** by reporting findings
4. **Use the quiz system** to reinforce learning
5. **Check your XP progress** to track improvement
6. **Explore all content types** for comprehensive knowledge
7. **Share with others** to spread cybersecurity awareness
