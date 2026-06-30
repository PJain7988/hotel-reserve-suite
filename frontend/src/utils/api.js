import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  resetPassword: (data) => API.post('/auth/reset-password', data)
};

export const roomsAPI = {
  getAll: () => API.get('/rooms'),
  randomOccupancy: () => API.post('/rooms/random'),
  reset: () => API.post('/rooms/reset'),
  create: (data) => API.post('/rooms', data),
  update: (roomNumber, data) => API.put(`/rooms/${roomNumber}`, data),
  delete: (roomNumber) => API.delete(`/rooms/${roomNumber}`)
};

export const bookingsAPI = {
  getAll: () => API.get('/bookings'),
  book: (data) => API.post('/bookings', data),
  cancel: (id) => API.delete(`/bookings/${id}`),
  pay: (data) => API.post('/bookings/pay', data),
  getPayments: () => API.get('/bookings/payments'),
  createReview: (data) => API.post('/bookings/reviews', data),
  getReviews: () => API.get('/bookings/reviews'),
  getAnalytics: () => API.get('/bookings/analytics')
};

export default API;
