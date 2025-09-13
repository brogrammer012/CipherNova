import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
