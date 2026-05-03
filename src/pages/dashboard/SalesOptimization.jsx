// src/pages/dashboard/SalesOptimization.jsx
// ─────────────────────────────────────────────────────────────────────
// Page 7 — AI Sales Optimization
// Single `selectedPeriod` state drives ALL child components atomically.
// All theme tokens inherited from index.css — zero hardcoded values.
// ─────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp, ArrowDown, Minus, Calendar,
  AlertTriangle, TrendingUp, Package, DollarSign,
} from 'lucide-react';
import { salesData, aiRecommendationsPool } from '../../utils/salesData';

import RevenueChart            from '../../components/charts/RevenueChart';
import ProductBarChart         from '../../components/charts/ProductBarChart';
import CategoryDonut           from '../../components/charts/CategoryDonut';
import SalesHeatmap            from '../../components/charts/SalesHeatmap';
import AIRecommendationsPanel  from '../../components/dashboard/SalesOptimization/AIRecommendationsPanel';
import ProductPerformanceTable from '../../components/dashboard/SalesOptimization/ProductPerformanceTable';
import SlowMoversAlert         from '../../components/dashboard/SalesOptimization/SlowMoversAlert';

// ── Period config ──────────────────────────────────────────────────────
const PERIODS = [
  { id: 'today',  label: 'Today' },
  { id: 'last7',  label: 'This Week'  },
  { id: 'last30', label: 'This Month' },
  { id: 'last90', label: 'This Quarter' },
  { id: 'custom', label: 'Custom Range' },
];

// ── KPI Card ──────────────────────────────────────────────────────────
const KPICard = ({ title, icon: Icon, color, value, delta, isAlert }) => {
  const isPos  = delta > 0;
  const isNeg  = delta < 0;
  // For alerts, more = bad (red), fewer = good (green)
  const deltaColor = isAlert
    ? (isPos ? 'var(--red)' : isNeg ? 'var(--green)' : 'var(--gray-400)')
    : (isPos ? 'var(--green)' : isNeg ? 'var(--red)' : 'var(--gray-400)');
  const DeltaIcon = isPos ? ArrowUp : isNeg ? ArrowDown : Minus;

  const fmtVal = () => {
    if (title.includes('Revenue') || title.includes('Order Value'))
      return `PKR ${value.toLocaleString()}`;
    return value.toLocaleString();
  };

  return (
    <div className="dash-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-400)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={13} color={color} />
        </div>
        {title}
      </div>

      {/* Value + delta */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <motion.p
          key={value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: isAlert ? 'var(--amber)' : 'var(--navy)', lineHeight: 1 }}
        >
          {fmtVal()}
        </motion.p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', fontWeight: 700, color: deltaColor, background: `${deltaColor}14`, padding: '2px 7px', borderRadius: 5 }}>
          <DeltaIcon size={11} />
          {title === 'Top Selling Category' ? '' : Math.abs(delta)}{title === 'Low Stock Alerts' || title === 'Top Selling Category' ? '' : '%'}
          <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: '0.65rem', marginLeft: 1 }}>vs last</span>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────
export default function SalesOptimization() {
  const [selectedPeriod,  setSelectedPeriod]  = useState('last30');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Period switch — propagate to all children via props
  const handlePeriodChange = (id) => {
    if (id === 'custom') {
      setShowCustomPicker(prev => !prev);
      // Custom maps to last30 data for mock purposes
    } else {
      setShowCustomPicker(false);
      setSelectedPeriod(id);
    }
  };

  // Derive active data key
  const activeKey  = (selectedPeriod === 'custom' || !salesData[selectedPeriod])
    ? 'last30'
    : selectedPeriod;
  const currentData = salesData[activeKey];

  const { kpis, revenueTrend, topProducts, bottomProducts, categoryBreakdown, productTable, slowMovers } = currentData;

  return (
    <div style={{ width: '100%', maxWidth: 1600, margin: '0 auto' }}>

      {/* ── 1. PAGE HEADER ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
        {/* Left: title */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.65rem', color: 'var(--navy)', margin: '0 0 2px' }}>
            Sales Optimization
          </h1>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--gray-400)', fontWeight: 300 }}>
            AI-powered insights to maximize pharmacy revenue
          </p>
        </div>

        {/* Right: period selector + date label */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          {/* Segmented pill */}
          <div style={{ display: 'flex', background: 'white', borderRadius: 100, padding: 3, border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)', flexWrap: 'wrap', gap: 2 }}>
            {PERIODS.map(p => {
              const isActive = (p.id !== 'custom' && selectedPeriod === p.id) || (p.id === 'custom' && showCustomPicker);
              return (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id)}
                  style={{
                    background:   isActive ? 'var(--blue)' : 'transparent',
                    color:        isActive ? 'white' : 'var(--gray-600)',
                    border:       'none',
                    borderRadius: 100,
                    padding:      '0.38rem 1rem',
                    fontSize:     '0.78rem',
                    fontWeight:   600,
                    cursor:       'pointer',
                    transition:   'all 0.2s',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          5,
                    fontFamily:   'var(--font-body)',
                    whiteSpace:   'nowrap',
                  }}
                >
                  {p.id === 'custom' && <Calendar size={12} />}
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom date picker */}
          <AnimatePresence>
            {showCustomPicker && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'white', padding: '0.5rem 0.75rem', borderRadius: 10, border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)' }}
              >
                <input type="date" style={{ border: '1px solid var(--dash-border)', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.75rem', outline: 'none', fontFamily: 'var(--font-body)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>→</span>
                <input type="date" style={{ border: '1px solid var(--dash-border)', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.75rem', outline: 'none', fontFamily: 'var(--font-body)' }} />
                <button style={{ background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Apply
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Period label + last updated */}
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--gray-400)', fontStyle: 'italic' }}>
            {currentData.periodLabel}&nbsp;·&nbsp;Last updated:{' '}
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* ── 2. KPI STRIP ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <KPICard title="Total Revenue"    icon={DollarSign}    color="var(--blue)"              value={kpis.revenue?.value || 0}  delta={kpis.revenue?.delta || 0}  isAlert={false} />
        <KPICard title="Total Orders"     icon={Package}       color="#f97316"                  value={kpis.orders?.value || 0}   delta={kpis.orders?.delta || 0}   isAlert={false} />
        <KPICard title="Units Sold"       icon={Package}       color="var(--green)"             value={kpis.units?.value || 0}    delta={kpis.units?.delta || 0}    isAlert={false} />
        <KPICard title="Top Selling Category" icon={TrendingUp} color="#10b981"                 value={kpis.topCategory?.value || 'N/A'} delta={0}                  isAlert={false} />
        <KPICard title="Avg. Order Value" icon={TrendingUp}    color="#8b5cf6"                  value={kpis.aov?.value || 0}      delta={kpis.aov?.delta || 0}      isAlert={false} />
        <KPICard title="Low Stock Alerts" icon={AlertTriangle} color="var(--amber)"             value={kpis.lowStock?.value || 0} delta={kpis.lowStock?.delta || 0} isAlert={true}  />
      </div>

      {/* ── 3. CHARTS ───────────────────────────────────────────────── */}
      {/* Full-width revenue trend */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RevenueChart data={revenueTrend} selectedPeriod={activeKey} />
      </div>

      {/* 60/40 split: bar chart | donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <ProductBarChart
          topProducts={topProducts}
          bottomProducts={bottomProducts}
          selectedPeriod={activeKey}
        />
        <CategoryDonut data={categoryBreakdown} selectedPeriod={activeKey} />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <SalesHeatmap selectedPeriod={activeKey} />
      </div>

      {/* ── 4. AI RECOMMENDATIONS ───────────────────────────────────── */}
      <AIRecommendationsPanel pool={aiRecommendationsPool} selectedPeriod={activeKey} />

      {/* ── 5. PRODUCT PERFORMANCE TABLE ────────────────────────────── */}
      <ProductPerformanceTable data={productTable} selectedPeriod={activeKey} />

      {/* ── 6. SLOW MOVERS ALERT ────────────────────────────────────── */}
      <SlowMoversAlert data={slowMovers} />
    </div>
  );
}
