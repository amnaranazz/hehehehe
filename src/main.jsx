import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './landing/LandingPage'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPassword from './pages/auth/ForgotPassword'
import PendingApproval from './pages/auth/PendingApproval'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import PrescriptionReview from './pages/dashboard/PrescriptionReview'
import Inventory from './pages/dashboard/Inventory'
import Orders from './pages/dashboard/Orders'
import LeadScoring from './pages/dashboard/LeadScoring'
import SalesOptimization from './pages/dashboard/SalesOptimization'
import Analytics from './pages/dashboard/Analytics'
import AIAssistant from './pages/dashboard/AIAssistant'
import Consultations from './pages/dashboard/Consultations'
import InteractionAlerts from './pages/dashboard/InteractionAlerts'
import Settings from './pages/dashboard/Settings'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
        </Route>

        {/* Dashboard Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="prescriptions" element={<PrescriptionReview />} />
            <Route path="sales" element={<SalesOptimization />} />
            <Route path="settings" element={<Settings />} />
            
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="alerts" element={<InteractionAlerts />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="leads" element={<LeadScoring />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="consultations" element={<Consultations />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
