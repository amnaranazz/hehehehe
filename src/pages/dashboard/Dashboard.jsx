// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, TrendingUp, AlertTriangle, FileText, 
  ChevronDown, Upload, SlidersHorizontal, ArrowUpRight, 
  X, MoreHorizontal, Package, Bot, Send, Download, Printer, ChevronRight
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

import { fadeUp, cardReveal, staggerContainer, floatAnim } from '../../utils/animations';
import { useCountUp } from '../../hooks/useCountUp';
import { useToast } from '../../hooks/useToast';

import { analyticsService } from '../../services/analyticsService';
import { orderService } from '../../services/orderService';
import { consultationService } from '../../services/consultationService';

import MetricCard from '../../components/common/MetricCard';
import SeverityBadge from '../../components/common/SeverityBadge';
import OrderDetailModal from '../../components/modals/OrderDetailModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [dashData, setDashData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  const [aiInput, setAiInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your pharmacy AI. Ask me anything." }
  ]);

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [dash, orders] = await Promise.all([
          analyticsService.getDashboardData(),
          orderService.getRecentOrders(10),
        ]);
        setDashData(dash);
        setRecentOrders(orders);
        setAlerts(dash.alerts);
      } catch (err) {
        showToast({ type: 'error', message: 'Failed to load dashboard data' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleAiSend() {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiInput('');
    setAiMessages(m => [...m, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    try {
      const reply = await consultationService.askAI(userMsg);
      setAiMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setAiMessages(m => [...m, { role: 'assistant', content: 'Sorry, I had trouble with that. Try again.' }]);
    } finally {
      setIsTyping(false);
    }
  }

  const handleQuickPrompt = (prompt) => {
    setAiInput(prompt);
  };

  const handleExportCSV = () => {
    const data = [
      ['Metric', 'Value', 'Trend'],
      ['Daily Revenue', 'PKR 124,500', '+12%'],
      ['Total Orders', '156', '+8%'],
      ['Critical Alerts', '12', '-2%'],
      ['Active Pharmacists', '8', 'Stable']
    ];
    const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `medsenseai-dashboard-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: 'success', message: 'CSV exported successfully' });
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    setShowExportMenu(false);
    showToast({ type: 'success', message: 'Preparing PDF for print...' });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleProcessOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="dash-shimmer" style={{ gridColumn: 'span 3', height: 160 }} />
        ))}
        <div className="dash-shimmer" style={{ gridColumn: 'span 7', height: 320 }} />
        <div className="dash-shimmer" style={{ gridColumn: 'span 5', height: 320 }} />
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Today's Orders",
      icon: ShoppingCart,
      iconBg: '#dbeafe', iconColor: '#2563eb',
      value: dashData.kpi.todayOrders,
      trend: 12.4,
      sparkData: dashData.kpiSparklines.todayOrders
    },
    {
      label: 'Monthly Revenue',
      icon: TrendingUp,
      iconBg: '#d1fae5', iconColor: '#10b981',
      value: dashData.kpi.monthlyRevenue,
      prefix: '₨',
      trend: 8.7,
      sparkData: dashData.kpiSparklines.monthlyRevenue
    },
    {
      label: 'Active Alerts',
      icon: AlertTriangle,
      iconBg: '#fff1f0', iconColor: '#ef4444',
      value: dashData.kpi.activeAlerts,
      trend: -2,
      sparkData: dashData.kpiSparklines.activeAlerts
    },
    {
      label: 'Pending Rx',
      icon: FileText,
      iconBg: '#ede9fe', iconColor: '#7c3aed',
      value: dashData.kpi.pendingRx,
      trend: 5.1,
      sparkData: dashData.kpiSparklines.pendingRx
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="dash-card" style={{ padding: '0.75rem 1rem', background: 'white' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '0.8rem', color: 'var(--navy)' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                {entry.name}: <span style={{ fontWeight: 600 }}>{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const topMeds = [
    { name:'Panadol', units:1240 },
    { name:'Amoxicillin', units:890 },
    { name:'Metformin', units:720 },
    { name:'Omeprazole', units:580 },
    { name:'Atorvastatin', units:410 },
  ];

  const lowStockItems = [
    { name:'Panadol 500mg', stock:8, minStock:20 },
    { name:'Amoxicillin 500mg', stock:3, minStock:15 },
    { name:'Insulin Pen', stock:2, minStock:10 },
    { name:'ORS Sachets', stock:12, minStock:30 },
    { name:'Metformin 1g', stock:5, minStock:25 },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.6rem', color: 'var(--navy)', margin: '0 0 4px 0' }}>
            Pharmacy Overview
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', fontWeight: 300, margin: 0 }}>
            Overview &rsaquo; All Reports
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }} ref={exportMenuRef}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowExportMenu(!showExportMenu)}
              style={{ padding: '0.6rem 1.25rem', borderRadius: 100, border: '1px solid var(--dash-border)', background: 'white', color: 'var(--navy)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Download size={16} /> Export
            </motion.button>
            
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                    background: 'white', borderRadius: 12, border: '1px solid var(--dash-border)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, width: 180, overflow: 'hidden'
                  }}
                >
                  <button 
                    onClick={handleExportCSV}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--navy)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dash-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileText size={16} color="var(--gray-400)" /> Export as CSV
                  </button>
                  <button 
                    onClick={handleExportPDF}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--navy)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dash-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Printer size={16} color="var(--gray-400)" /> Export as PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.02, background: 'var(--navy-light)' }}
              whileTap={{ scale: 0.98 }}
              style={{ padding: '0.6rem 1.25rem', borderRadius: 100, border: 'none', background: 'var(--navy)', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Share Report
            </motion.button>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'auto', gap: '1rem' }}>
        
        {/* ROW 1: KPIs */}
        {kpiCards.map((card, i) => (
          <MetricCard key={i} {...card} index={i} />
        ))}

        {/* ROW 2 LEFT: Sales Trend */}
        <motion.div variants={fadeUp} style={{ gridColumn: 'span 7' }} className="dash-card">
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Sales Trend</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', color: 'var(--navy)', margin: 0 }}>
                    ₨{dashData.salesData.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[
                      {label: 'Revenue', color: '#2563eb'},
                      {label: 'Prescriptions', color: '#7c3aed'},
                      {label: 'OTC Sales', color: 'var(--gray-300)'}
                    ].map(legend => (
                      <div key={legend.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: legend.color }} />
                        <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)', fontWeight: 500 }}>{legend.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: 'var(--dash-bg)', cursor: 'pointer' }}>Daily</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: 'var(--navy)', color: 'white', cursor: 'pointer' }}>Weekly <ChevronDown size={12} style={{display:'inline', verticalAlign:'middle'}}/></div>
              </div>
            </div>
            <div style={{ height: 180, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashData.salesData} margin={{top: 5, right: 5, bottom: 5, left: 0}}>
                  <XAxis dataKey="day" tick={{fontSize: 11, fill: 'var(--gray-400)'}} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--dash-border)', strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{r: 5, fill: '#2563eb', strokeWidth: 0}} isAnimationActive={true} animationBegin={300} />
                  <Line type="monotone" dataKey="prescriptions" name="Prescriptions" stroke="#7c3aed" strokeWidth={2} dot={false} strokeDasharray="4 2" isAnimationActive={true} animationBegin={500} />
                  <Line type="monotone" dataKey="otc" name="OTC Sales" stroke="var(--gray-300)" strokeWidth={1.5} dot={false} isAnimationActive={true} animationBegin={700} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* ROW 2 RIGHT: Stacked Cards */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <motion.div variants={fadeUp} className="dash-card" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronDown size={14} color="var(--gray-600)" />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 400 }}>Today Received</span>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', color: 'var(--navy)', margin: '0 0 0.5rem 0' }}>
              ₨5,32,921
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={14} color="var(--green)" />
                <span style={{ fontSize: '0.78rem', color: 'var(--green)', fontWeight: 500 }}>12%</span>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronDown size={14} color="var(--gray-600)" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ boxShadow: '0 16px 48px rgba(0,0,0,0.25)' }} style={{ background: 'var(--dash-card-dark)', borderRadius: 'var(--dash-radius)', padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {[{ icon: X, action: 'dismiss' }, { icon: FileText, action: 'view' }, { icon: ArrowUpRight, action: 'open' }].map(btn => (
                <motion.div key={btn.action} whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.95 }}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <btn.icon size={14} color="white" />
                </motion.div>
              ))}
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 100, display: 'inline-block', marginBottom: '0.5rem' }}>
                Track and Review
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'white', margin: 0 }}>
                Prescription Queue
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: 300, margin: '4px 0 0 0' }}>
                {dashData.kpi.pendingRx} prescriptions awaiting review
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/dashboard/prescriptions')}
              style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--blue)', color: 'white', padding: '0.4rem 0.85rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
              Review Now <ArrowUpRight size={12} />
            </motion.div>
          </motion.div>
          
        </div>

        {/* ROW 3 LEFT: Interaction Alerts */}
        <motion.div variants={fadeUp} style={{ gridColumn: 'span 7' }} className="dash-card">
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Interaction Alerts</h3>
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ background: 'var(--red)', color: 'white', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', minWidth: 20, textAlign: 'center' }}>
                  {dashData.kpi.activeAlerts}
                </motion.div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Sort by Severity ↓', 'All Alerts'].map(label => (
                  <div key={label} style={{ fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: 'var(--dash-bg)', cursor: 'pointer' }}>{label}</div>
                ))}
                <div style={{ padding: '4px', borderRadius: 100, background: 'var(--dash-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MoreHorizontal size={14}/></div>
              </div>
            </div>

            <div>
              {alerts.map((alert, i) => (
                <motion.div key={alert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ background: 'var(--dash-bg)', borderRadius: 12, transition: { duration: 0.15 } }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.65rem 0.5rem', borderBottom: i !== alerts.length - 1 ? '1px solid var(--dash-border)' : 'none', cursor: 'pointer' }}
                  onClick={() => navigate('/dashboard/alerts')}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `var(--severity-${alert.severity}-bg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={16} color={`var(--severity-${alert.severity})`} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.patientName}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontWeight: 300, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.medicines.join(' + ')}</p>
                  </div>
                  <SeverityBadge severity={alert.severity} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontWeight: 300, flexShrink: 0, width: 45, textAlign: 'right' }}>{alert.timeAgo}</span>
                  <motion.button whileHover={{ background: 'var(--blue)', color: 'white', borderColor: 'var(--blue)' }} whileTap={{ scale: 0.95 }}
                    style={{ flexShrink: 0, padding: '0.3rem 0.75rem', borderRadius: 100, border: '1px solid var(--dash-border)', background: 'white', fontSize: '0.72rem', fontWeight: 500, color: 'var(--navy)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', marginLeft: '0.5rem' }}>
                    Review
                  </motion.button>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/dashboard/alerts')}>View all alerts →</span>
            </div>
          </div>
        </motion.div>

        {/* ROW 3 RIGHT: Revenue Score Gauge */}
        <motion.div variants={fadeUp} style={{ gridColumn: 'span 5' }} className="dash-card">
           <div style={{ padding: '1.25rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Revenue Balance</h3>
              <ArrowUpRight size={16} color="var(--gray-400)" />
            </div>
            
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-20px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="80%" innerRadius="70%" outerRadius="100%" startAngle={180} endAngle={0}
                  data={[
                    { name: 'Background', value: 100, fill: '#f1f5f9' },
                    { name: 'Revenue', value: dashData.gaugePercent, fill: '#2563eb' }
                  ]}
                >
                  <RadialBar minAngle={15} dataKey="value" cornerRadius={10} isAnimationActive={true} animationBegin={800} animationDuration={1500} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: 'var(--navy)', margin: 0, lineHeight: 1 }}>
                  {dashData.gaugePercent}%
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 300, margin: '4px 0 0 0' }}>from yesterday</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '-10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f1f5f9' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>Total</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>Profit Today</span>
              </div>
            </div>

            <div style={{ background: 'var(--dash-bg)', borderRadius: 12, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy)', margin: '0 0 2px 0' }}>Profit is 12% More</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', margin: 0 }}>than last week</p>
              </div>
              <div style={{ background: 'var(--navy)', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>Go Pro</div>
            </div>
          </div>
        </motion.div>

        {/* ROW 4 LEFT: Top Selling Medicines */}
        <motion.div variants={fadeUp} style={{ gridColumn: 'span 6' }} className="dash-card">
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Top Selling Medicines</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <div style={{ fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: 'var(--dash-bg)', cursor: 'pointer' }}>7 Days</div>
                 <div style={{ fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: 'var(--navy)', color: 'white', cursor: 'pointer' }}>30 Days</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ flexShrink: 0, width: '120px' }}>
                 <div style={{ background: '#0f0f0f', color: 'white', display: 'inline-block', padding: '4px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem' }}>30 Days</div>
                 <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', color: 'var(--navy)', margin: '0 0 0.25rem 0', lineHeight: 1 }}>3,840</p>
                 <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', margin: 0, lineHeight: 1.3 }}>units sold this month</p>
               </div>
               <div style={{ flex: 1, height: 200 }}>
                 <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topMeds} layout="vertical" margin={{left: 10, right: 20, top: 5, bottom: 5}}>
                    <XAxis type="number" tick={{fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={v => v+'u'} />
                    <YAxis type="category" dataKey="name" tick={{fontSize: 11}} width={80} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.04)'}} contentStyle={{ borderRadius: 12, border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)' }} />
                    <Bar dataKey="units" radius={[0, 6, 6, 0]} isAnimationActive={true} animationDuration={1200} animationBegin={300} barSize={20}>
                      {topMeds.map((_, i) => (
                        <Cell key={i} fill={i===0?'#0f0f0f':i===1?'#2563eb':i===2?'#3b82f6':'#93c5fd'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
               </div>
            </div>
          </div>
        </motion.div>

        {/* ROW 4 CENTER: Low Stock */}
        <motion.div variants={fadeUp} style={{ gridColumn: 'span 3' }} className="dash-card">
           <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Low Stock</h3>
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ background: 'var(--red)', color: 'white', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', minWidth: 20, textAlign: 'center' }}>
                    {lowStockItems.length}
                  </motion.div>
                </div>
                <ArrowUpRight size={16} color="var(--gray-400)" style={{cursor: 'pointer'}} onClick={() => navigate('/dashboard/inventory')} />
              </div>
              
              <div>
                {lowStockItems.map((item, i) => (
                  <motion.div key={i} whileHover={{ background: 'var(--dash-bg)', borderRadius: 8 }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: i !== lowStockItems.length - 1 ? '1px solid var(--dash-border)' : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={13} color="var(--red)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--navy)', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--gray-400)', fontWeight: 300, margin: 0 }}>{item.stock} left &middot; Min {item.minStock}</p>
                    </div>
                    <motion.div animate={item.stock < 5 ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }} style={{ background: 'var(--red-light)', color: 'var(--red)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 100, flexShrink: 0 }}>
                      {item.stock}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/dashboard/inventory')}>Order now →</span>
              </div>
           </div>
        </motion.div>

        {/* ROW 4 RIGHT: AI Assistant Compact */}
        <motion.div variants={fadeUp} style={{ gridColumn: 'span 3', background: 'var(--dash-card-dark)', borderRadius: 'var(--dash-radius)', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Bot size={18} color="white" />
               <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', color: 'white', margin: 0 }}>AI Assistant</h3>
            </div>
            <ArrowUpRight size={16} color="rgba(255,255,255,0.5)" style={{cursor: 'pointer'}} onClick={() => navigate('/dashboard/ai-assistant')} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '0.75rem', maxHeight: 110, scrollbarWidth: 'none' }} className="no-scrollbar">
            <AnimatePresence>
              {aiMessages.slice(-2).map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  {msg.role === 'assistant' && (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot size={11} color="white" />
                    </div>
                  )}
                  <p style={{ fontSize: '0.72rem', color: msg.role === 'user' ? 'white' : 'rgba(255,255,255,0.7)', background: msg.role === 'user' ? 'var(--blue)' : 'rgba(255,255,255,0.08)', borderRadius: msg.role === 'user' ? '8px 8px 0 8px' : '0 8px 8px 8px', padding: '0.4rem 0.6rem', lineHeight: 1.5, fontWeight: 300, margin: 0, maxWidth: '85%' }}>
                    {msg.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.65rem', overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }} className="no-scrollbar">
            {['Low stock?', 'Today sales', 'Top meds'].map(chip => (
              <motion.div key={chip} whileHover={{ background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.95 }} onClick={() => handleQuickPrompt(chip)}
                style={{ flexShrink: 0, padding: '0.25rem 0.65rem', borderRadius: 100, border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {chip}
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.08)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', padding: '0.35rem 0.5rem' }}>
            <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSend()} placeholder="Ask about your pharmacy…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: 300 }} />
            {isTyping ? (
              <div style={{ display: 'flex', gap: 2, padding: '0 4px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', animation: `typingDot 0.8s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleAiSend}
                style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Send size={12} color="white" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ROW 5 (FULL): Recent Orders Table */}
        <motion.div variants={fadeUp} style={{ gridColumn: 'span 12' }} className="dash-card">
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
               <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                 <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>Recent Orders</h3>
                 <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Last 10 orders</span>
               </div>
               <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                 <div style={{ fontSize: '0.75rem', fontWeight: 600, padding: '5px 12px', borderRadius: 100, background: 'var(--dash-bg)', cursor: 'pointer' }}>Sort by Date ↓</div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 600, padding: '5px 12px', borderRadius: 100, background: 'var(--dash-bg)', cursor: 'pointer' }}>All Orders</div>
                 <div style={{ padding: '5px', borderRadius: 100, background: 'var(--dash-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MoreHorizontal size={14}/></div>
                 <span style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 500, cursor: 'pointer', marginLeft: '0.5rem' }} onClick={() => navigate('/dashboard/orders')}>View All →</span>
               </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--dash-border)', color: 'var(--gray-400)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Order ID</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Patient</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Medicines</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Amount</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Time</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => {
                    const statusConfig = {
                      pending:    { bg:'#fef3c7', color:'#d97706', label:'Pending' },
                      processing: { bg:'#dbeafe', color:'#2563eb', label:'Processing' },
                      completed:  { bg:'#d1fae5', color:'#059669', label:'Completed' },
                      cancelled:  { bg:'#fee2e2', color:'#dc2626', label:'Cancelled' },
                    }[order.status];

                    return (
                      <motion.tr key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ borderBottom: '1px solid var(--dash-border)', transition: 'background 0.2s', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dash-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: 'var(--navy)' }}>{order.id}</td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--navy)', fontWeight: 500 }}>{order.patient}</td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--gray-600)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.medicines}</td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>₨{order.amount.toLocaleString()}</td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span style={{ background: statusConfig.bg, color: statusConfig.color, padding: '3px 8px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600 }}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--gray-400)' }}>{order.time}</td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <motion.button 
                            whileHover={{ scale: 1.1, color: 'var(--blue)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleProcessOrder(order)}
                            style={{ border: 'none', background: 'transparent', padding: '0.4rem', cursor: 'pointer', color: 'var(--gray-400)' }}
                          >
                            <ChevronRight size={18} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

      </div>
      {/* MODALS */}
      <OrderDetailModal 
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        order={selectedOrder}
      />

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .dash-card { box-shadow: none !important; border: 1px solid #eee !important; }
          .main-content { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        }
      `}</style>
    </motion.div>
  );
}
