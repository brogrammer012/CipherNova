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
