// src/components/layout/ContextPanel.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, Package, DollarSign, AlertCircle, Users, 
  ShoppingCart, ClipboardList, BarChart3, Users2, ChevronRight,
  Send
} from 'lucide-react';
import { contextPanelData } from '../../utils/contextPanelData';
import { useToast } from '../../hooks/useToast';

export default function ContextPanel() {
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState(contextPanelData);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh animation
    setTimeout(() => {
      setIsRefreshing(false);
      // Re-set same data to trigger re-render animations
      setData({...contextPanelData});
    }, 600);
  };

  const handleSendReminders = () => {
    showToast({
      type: 'success',
      message: `Reminders sent to ${data.refillDue.length} customers`
    });
  };

  return (
    <aside
      style={{
        width: '280px',
        minWidth: '280px',
        background: 'var(--white)',
        borderLeft: '1px solid var(--dash-border)',
        height: '100vh',
        overflowY: 'auto',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className="no-scrollbar"
    >
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
            Live Overview
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', margin: 0 }}>Today · Apr 29, 2026</p>
        </div>
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRefresh}
          style={{
            background: 'var(--dash-bg)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--gray-600)'
          }}
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isRefreshing ? (
          <motion.div
            key="shimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="dash-shimmer" style={{ height: i === 0 ? '140px' : '180px', borderRadius: '16px' }} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* SECTION 1: TODAY'S SNAPSHOT */}
            <div className="dash-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <SnapshotItem 
                  icon={Package} 
                  label="Today's Orders" 
                  value={data.today.orders} 
                  iconBg="#eff6ff" 
                  iconColor="#3b82f6" 
                />
                <SnapshotItem 
                  icon={DollarSign} 
                  label="Today's Revenue" 
                  value={`₨${data.today.revenue.toLocaleString()}`} 
                  iconBg="#ecfdf5" 
                  iconColor="#10b981" 
                />
                <SnapshotItem 
                  icon={AlertCircle} 
                  label="Pending Alerts" 
                  value={data.today.pendingAlerts} 
                  iconBg="#fff1f0" 
                  iconColor="#ef4444" 
                  badge={data.today.pendingAlerts > 0}
                />
                <SnapshotItem 
                  icon={Users} 
                  label="Active Customers" 
                  value={data.today.activeCustomers} 
                  iconBg="#f5f3ff" 
                  iconColor="#8b5cf6" 
                />
              </div>
            </div>

            {/* SECTION 2: INVENTORY ALERTS */}
            <div className="dash-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Inventory Alerts</h4>
                  <span style={{ background: 'var(--red)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '100px', fontWeight: 800 }}>
                    {data.inventoryAlerts.length}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.inventoryAlerts.map((alert) => (
                  <div key={alert.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: alert.color, marginTop: '5px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{alert.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', margin: 0 }}>{alert.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/dashboard/inventory" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--blue)', fontWeight: 600, textDecoration: 'none', marginTop: '1rem' }}>
                View All <ChevronRight size={12} />
              </a>
            </div>

            {/* SECTION 3: REFILL DUE */}
            <div className="dash-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Refill Reminders</h4>
                  <span style={{ background: 'var(--blue)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '100px', fontWeight: 800 }}>
                    {data.refillDue.length}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.refillDue.map((customer) => (
                  <div key={customer.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--dash-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy)' }}>
                      {customer.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{customer.name}</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--gray-400)', margin: 0 }}>
                        Last order: {customer.lastOrder} days ago &middot; <span style={{ color: 'var(--gray-300)' }}>{customer.medicine}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleSendReminders}
                style={{
                  width: '100%', padding: '0.6rem', marginTop: '1rem', background: 'transparent',
                  border: '1.5px dashed var(--dash-border)', borderRadius: '10px', color: 'var(--gray-600)',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                }}
              >
                <Send size={14} /> Send All Reminders
              </button>
            </div>

            {/* SECTION 4: QUICK ACTIONS */}
            <div className="dash-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>Quick Actions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <QuickActionButton icon={ShoppingCart} label="View Orders" href="/dashboard/orders" />
                <QuickActionButton icon={Package} label="Check Inventory" href="/dashboard/inventory" />
                <QuickActionButton icon={Users2} label="Lead Scoring" href="/dashboard/leads" />
                <QuickActionButton icon={BarChart3} label="View Reports" href="/dashboard/analytics" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </aside>
  );
}

function SnapshotItem({ icon: Icon, label, value, iconBg, iconColor, badge }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ width: 32, height: 32, borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Icon size={16} color={iconColor} />
        {badge && (
          <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: 'var(--red)', border: '2px solid white' }} />
        )}
      </div>
      <div>
        <p style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</p>
        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, href }) {
  return (
    <a 
      href={href}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0.75rem', border: '1px solid var(--dash-border)', borderRadius: '12px',
        textDecoration: 'none', gap: '6px', transition: 'all 0.2s'
      }}
      className="quick-action-btn"
    >
      <Icon size={18} color="var(--gray-600)" />
      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--gray-600)', textAlign: 'center' }}>{label}</span>
      <style>{`
        .quick-action-btn:hover {
          background: var(--dash-bg);
          border-color: var(--blue-mid);
          transform: translateY(-2px);
        }
        .quick-action-btn:hover span { color: var(--blue); }
        .quick-action-btn:hover svg { color: var(--blue); }
      `}</style>
    </a>
  );
}
