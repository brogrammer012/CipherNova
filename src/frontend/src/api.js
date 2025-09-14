import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// WHOIS lookup API (moved below axiosInstance so axiosInstance exists)
export async function whoisLookup(domain) {
  const token = localStorage.getItem('token');
  return axiosInstance.post('/whois', { domain }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function registerUser({ firstName, surname, email, password }) {
  return axiosInstance.post('/register', {
    name: firstName,
    surname,
    email,
    password,
  });
}

export async function loginUser({ email, password }) {
  return axiosInstance.post('/login', {
    email,
    password,
  });
}

export async function checkPhishing(message) {
  return axiosInstance.post('/checkPhishing', { message });
}

// Dashboard API endpoints
export async function getDashboardData() {
  return axiosInstance.get('/dashboard');
}

export async function getUserAnalyses(limit = 5) {
  return axiosInstance.get(`/analyses?limit=${limit}`);
}

export async function getLeaderboard(limit = 3) {
  return axiosInstance.get(`/leaderboard?limit=${limit}`);
}

export async function getCommunityReports(limit = 5) {
  return axiosInstance.get(`/community-reports?limit=${limit}`);
}

export async function getUserStats() {
  return axiosInstance.get('/user/stats');
}

export async function getUserXp(userId) {
  return axiosInstance.get(`/user/xp/${userId}`);
}

// Community API endpoints
export async function getCommunityPosts() {
  return axiosInstance.get('/community');
}

export async function getUserReports(userId) {
  return axiosInstance.get(`/reports/user/${userId}`);
}

export async function submitReport({ userId, url, detectionType }) {
  return axiosInstance.post('/submit-report', {
    userId,
    url,
    detectionType,
  });
}