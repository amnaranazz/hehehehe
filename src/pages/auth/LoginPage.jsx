// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ExternalLink, Activity } from 'lucide-react';
import Button from '../../components/common/Button';
import { usePharmacistAuth } from '../../hooks/usePharmacistAuth';
import { useToast } from '../../hooks/useToast';
import { navbarSlide, fadeUp } from '../../utils/animations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  
  const { login, isLoading } = usePharmacistAuth();
  const { showToast } = useToast();

  function validate() {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
    
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    try {
      await login(email, password, rememberMe);
      // usePharmacistAuth handles redirect via ProtectedRoute
    } catch (err) {
      setErrors({ form: err.message || 'Invalid credentials' });
      showToast({ type: 'error', message: err.message || 'Invalid credentials' });
    }
  }

  const features = [
    'Drug interaction detection in real-time',
    'AI-powered sales analytics & lead scoring',
    'Smart inventory management & alerts'
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      
      {/* ━━━ LEFT PANEL — Brand Panel ━━━ */}
      <div className="brand-panel" style={{
        flex: 1,
        background: 'var(--auth-panel-bg)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem 4rem'
      }}>
        <style>{`
          @media (max-width: 768px) {
            .brand-panel { display: none !important; }
          }
        `}</style>
        
        {/* DECORATIVE ELEMENTS */}
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 280, height: 280,
          border: '2px solid rgba(255,255,255,0.15)', borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: -30, width: 120, height: 120,
          border: '2px solid rgba(255,255,255,0.15)', borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '15%', width: 100, height: 100,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2px)',
          backgroundSize: '16px 16px', pointerEvents: 'none'
        }} />
        <motion.svg
          style={{ position: 'absolute', top: '40%', right: '5%', width: 300, height: 300, pointerEvents: 'none', fill: 'rgba(255,255,255,0.07)' }}
          animate={{ y: [0, -12, 0], rotate: [0, 0.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 200 200"
        >
          <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,95.5,-3.3C94.2,11.5,85.6,25.6,76.5,38.8C67.4,52,57.7,64.2,44.9,73.1C32.1,82,16.1,87.6,1.4,85.2C-13.3,82.8,-26.6,72.4,-40.4,63.9C-54.2,55.4,-68.4,48.8,-76.5,37.6C-84.6,26.4,-86.6,10.6,-85.4,-4.6C-84.2,-19.8,-79.8,-34.4,-71.4,-46.3C-63,-58.2,-50.6,-67.4,-37.2,-75.2C-23.8,-83,-9.4,-89.4,4.2,-96.5C17.8,-103.6,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </motion.svg>

        {/* CONTENT */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity color="white" size={32} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: '1.4rem', margin: 0, lineHeight: 1 }}>MedSenseAI</h2>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', margin: 0, fontWeight: 600, letterSpacing: '0.05em' }}>for Pharmacists</p>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 0.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'white', borderRadius: 16, padding: '1.25rem 1.5rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.25)', maxWidth: 320, marginBottom: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 600 }}>Today's Revenue</div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)' }}>₨47,290</div>
            </div>
            <div style={{ height: 40, borderBottom: '1px solid var(--gray-200)', marginBottom: '0.5rem', position: 'relative' }}>
               <svg viewBox="0 0 100 30" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
                 <path d="M0,25 Q10,20 20,25 T40,15 T60,20 T80,5 T100,10" fill="none" stroke="var(--blue)" strokeWidth="2" />
               </svg>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', background: 'var(--amber-light)', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 600 }}>3 Alerts</span>
              <span style={{ fontSize: '0.7rem', background: 'var(--blue-light)', color: 'var(--blue)', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 600 }}>12 Orders</span>
            </div>
          </motion.div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Welcome back, pharmacist</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Your AI-powered pharmacy platform</p>

          <div>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" />
                  <motion.path d="M9 12l2 2 4-4" stroke="white" style={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: i * 0.15 + 0.8 }} />
                </svg>
                <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.875rem', fontWeight: 300 }}>
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
          <a href="https://medsenseai.com" target="_blank" rel="noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textDecoration: 'none'
          }}>
            Are you a patient? Visit medsenseai.com
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* ━━━ RIGHT PANEL — Form Panel ━━━ */}
      <div style={{
        flex: 1,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem'
      }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <div className="mobile-logo" style={{ display: 'none', marginBottom: '2rem', alignItems: 'center', gap: '0.5rem' }}>
             <Activity color="var(--blue)" size={28} />
             <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)' }}>MedSenseAI</span>
          </div>
          <style>{`
            @media (max-width: 768px) {
              .mobile-logo { display: flex !important; }
            }
          `}</style>

          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>Welcome Back!</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
            Sign in by entering the information below
          </p>

          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                className={`auth-input ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="email@example.com"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: null }) }}
              />
            </div>
            {errors.email && <p className="auth-error-msg"><AlertCircle size={12}/>{errors.email}</p>}
          </div>

          <div className="auth-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--blue)', fontWeight: 400, textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                className={`auth-input ${errors.password ? 'error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                value={password}
                onChange={e => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: null }) }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)',
                  display: 'flex', padding: 4
                }}
              >
                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            {errors.password && <p className="auth-error-msg"><AlertCircle size={12}/>{errors.password}</p>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--blue)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--gray-600)', fontWeight: 400 }}>
                Remember Me
              </span>
            </label>
          </div>

          {errors.form && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--severity-critical-bg)', color: 'var(--severity-critical)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={14} />
              {errors.form}
            </motion.div>
          )}

          <motion.div animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}>
            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleSubmit}
              style={{ width: '100%', marginBottom: '1.25rem' }}
            >
              Continue
            </Button>
          </motion.div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button disabled style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-btn)', opacity: 0.6, cursor: 'not-allowed', color: 'var(--gray-600)', fontSize: '0.85rem', fontWeight: 500 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button disabled style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-btn)', opacity: 0.6, cursor: 'not-allowed', color: 'var(--gray-600)', fontSize: '0.85rem', fontWeight: 500 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: '1.5rem' }}>
            Don't have an account?
            <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 500, marginLeft: 4, textDecoration: 'none' }}>
              Start your free trial →
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}
