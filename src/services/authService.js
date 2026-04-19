// src/services/authService.js
import api from './api'

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data),

  register: (data) =>
    api.post('/auth/register', data).then(r => r.data),

  sendOtp: (email) =>
    api.post('/auth/send-otp', { email }).then(r => r.data),

  verifyOtp: (email, otp) =>
    api.post('/auth/verify-otp', { email, otp }).then(r => r.data),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),

  resetPassword: (email, otp, newPassword) =>
    api.post('/auth/reset-password', { email, otp, newPassword }).then(r => r.data),

  selectPlan: (plan, billing) =>
    api.post('/auth/select-plan', { plan, billing }).then(r => r.data),

  checkApprovalStatus: () =>
    api.get('/auth/status').then(r => r.data.status),

  getMe: () =>
    api.get('/auth/me').then(r => r.data),

  logout: () =>
    api.post('/auth/logout').then(r => r.data),
}
