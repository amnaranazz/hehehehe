// src/components/layout/TopBar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Bell } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics' },
  { id: 'inventory', label: 'Inventory', path: '/dashboard/inventory' },
  { id: 'orders', label: 'Orders', path: '/dashboard/orders' },
  { id: 'ai', label: 'AI Assistant', path: '/dashboard/ai-assistant' },
];

export default function TopBar({ unreadCount = 3 }) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = tabs.find((t) => {
    if (t.path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(t.path);
  })?.id || 'dashboard';

  const fullName = 'Dr. Amna Raza';
  const email = 'amna@medsense.ai';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        height: 60,
        background: 'white',
        borderBottom: '1px solid var(--dash-border)',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Tab navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'var(--dash-bg)',
          borderRadius: 100,
          padding: '4px',
          flex: 1,
          maxWidth: 480,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <motion.button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              layout
              style={{
                flex: 1,
                padding: '0.45rem 1rem',
                borderRadius: 100,
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'white' : 'var(--gray-600)',
                background: 'transparent',
                cursor: 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap',
                outline: 'none',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-pill"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 100,
                    background: 'var(--navy)',
                    zIndex: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Right action icons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginLeft: 'auto',
        }}
      >
        {/* Settings */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/settings')}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid var(--dash-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'white',
          }}
        >
          <Settings size={16} color="var(--gray-600)" />
        </motion.div>

        {/* Bell with notification dot */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid var(--dash-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
            }}
          >
            <Bell size={16} color="var(--gray-600)" />
          </div>
          {unreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--red)',
                border: '2px solid white',
              }}
            />
          )}
        </motion.div>

        {/* User avatar + info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard/settings')}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: 'white',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--navy)',
                lineHeight: 1.2,
              }}
            >
              {fullName}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--gray-400)',
                fontWeight: 300,
              }}
            >
              {email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
