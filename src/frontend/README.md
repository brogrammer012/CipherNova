# PhishBuster+ - Cybersecurity Platform

A futuristic, student-focused cybersecurity platform designed to help South African students defend against phishing attacks through interactive training and real-time threat detection.

## 🚀 Features

### Landing Page
- **Hero Section**: Animated cyber particle background with compelling CTAs
- **Features Showcase**: Interactive cards for Educational Game, Detection Tool, and Real-Time Alerts
- **Gamification Preview**: XP rings, streak counters, badges, and leaderboard
- **Call-to-Action**: Login and Sign Up buttons with particle animations
- **Footer**: Clean design with social links and security badge

### Authentication System
- **Sign Up Page**: Complete form with validation for user registration
- **Email Verification**: 6-digit code input with timer and resend functionality
- **Login Page**: Secure authentication with demo credentials
- **Password Management**: Show/hide toggle and validation

### Dashboard
- **Welcome Section**: Personalized greeting with animated XP progress bar
- **Detection Tool**: Interactive threat analysis for emails, links, and messages
- **Game Access**: Training game launcher with stats and achievements
- **Gamification Stats**: Weekly XP chart, leaderboard, and quick stats
- **Notifications**: Dynamic alerts with dismissible items
- **Quick Links**: Settings, help, and emergency contact options

## 🎨 Design System

### Color Palette
- **Primary Black**: `#000000`
- **Dark Grey**: `#1E1E1E`
- **Neon Green**: `#00FF7F`
- **Teal**: `#00CED1`
- **White**: `#FFFFFF`
- **Light Grey**: `#2A2A2A`

### Typography
- **Headers**: Orbitron (futuristic, geometric)
- **Body Text**: Inter (clean, readable)

### Animations
- Floating particles and cyber grid backgrounds
- Neon glow effects on hover
- Smooth transitions between pages
- Micro-interactions for enhanced UX

## 🛠 Technology Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.8.0
- **Icons**: Lucide React 0.294.0
- **Animations**: Framer Motion 10.16.4
- **Build Tool**: React Scripts 5.0.1

## 📱 Responsive Design

- **Desktop**: Full-featured layout with grid systems
- **Tablet**: Adapted layouts with adjusted spacing
- **Mobile**: Single-column layouts with mobile navigation

## 🔧 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Demo Credentials
- **Email**: test@example.com
- **Password**: password123
- **Verification Code**: 123456

## 🗂 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── WelcomeSection.js/css
│   │   ├── DetectionTool.js/css
│   │   ├── GameAccess.js/css
│   │   ├── GamificationStats.js/css
│   │   ├── Notifications.js/css
│   │   └── QuickLinks.js/css
│   ├── LandingPage.js
│   ├── LoginPage.js/css
│   ├── SignUpPage.js/css
│   ├── EmailVerificationPage.js/css
│   ├── DashboardPage.js/css
│   ├── Hero.js/css
│   ├── Features.js/css
│   ├── Gamification.js/css
│   ├── CTA.js/css
│   ├── Footer.js/css
│   ├── PrimaryButton.js/css
│   └── SecondaryButton.js/css
├── App.js/css
├── index.js/css
└── public/
    └── index.html
```

## 🎯 User Flow

1. **Landing Page** → Browse features and benefits
2. **Sign Up** → Create account with email verification
3. **Login** → Authenticate with credentials
4. **Dashboard** → Access full platform features
5. **Detection Tool** → Analyze suspicious content
6. **Training Game** → Improve security skills
7. **Progress Tracking** → Monitor XP and achievements

## 🔒 Security Features

- Form validation and sanitization
- Email verification workflow
- Secure authentication flow
- Emergency contact system
- Real-time threat notifications

## 🎮 Gamification Elements

- **XP System**: Earn points for activities
- **Levels**: Progress through security expertise levels
- **Badges**: Unlock achievements for milestones
- **Streaks**: Daily login and activity tracking
- **Leaderboard**: Compete with other students

## 📊 Analytics & Tracking

- Weekly XP progress visualization
- Detection accuracy metrics
- Training completion rates
- Badge and achievement tracking
- User engagement statistics

## 🚀 Deployment

The application is ready for deployment to platforms like:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## 🔮 Future Enhancements

- Backend API integration
- Real phishing detection algorithms
- Advanced training scenarios
- Social features and team challenges
- Mobile app development
- Multi-language support

## 📞 Support

For technical support or security concerns, contact the development team through the emergency contact system in the dashboard.

---

**Built for South African universities and students** 🇿🇦
