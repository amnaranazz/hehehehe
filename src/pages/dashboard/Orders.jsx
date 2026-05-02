import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Calendar, X, Eye, Printer, MoreVertical, PackageX, ChevronDown, ChevronUp } from 'lucide-react';
import { mockOrders } from '../../utils/ordersData';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import OrderDetailModal from '../../components/modals/OrderDetailModal';

// Status styling
const statusColors = {
  'New': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', dot: '#3b82f6' },
  'Processing': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', dot: '#f59e0b' },
  'Ready': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', dot: '#10b981' },
  'Dispatched': { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', dot: '#8b5cf6' },
  'Delivered': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', dot: '#10b981' },
  'Cancelled': { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', dot: '#ef4444' }
};

const paymentStatusColors = {
  'Paid': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
  'Pending': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  'Failed': { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
  'Refunded': { bg: 'var(--dash-bg)', color: 'var(--gray-600)' }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  // Sorting
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = ['All', 'New', 'Processing', 'Ready', 'Dispatched', 'Delivered', 'Cancelled'];

  const getTabCount = (tab) => {
    if (tab === 'All') return orders.length;
    return orders.filter(o => o.deliveryStatus === tab).length;
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus: newStatus } : o));
    console.log(`[Toast Success]: Order ${orderId} updated to ${newStatus}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filtering & Sorting Logic
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (activeTab !== 'All') {
      result = result.filter(o => o.deliveryStatus === activeTab);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.patient.name.toLowerCase().includes(q) ||
        o.patient.phone.includes(q)
      );
    }

    if (dateRange.from) {
      result = result.filter(o => new Date(o.date) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      result = result.filter(o => new Date(o.date) <= new Date(dateRange.to + 'T23:59:59'));
    }

    return result.sort((a, b) => {
      let aVal, bVal;
      if (sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (sortField === 'total') {
        aVal = a.items.reduce((s, i) => s + (i.qty * i.unitPrice), 0) + a.deliveryFee - a.discount;
        bVal = b.items.reduce((s, i) => s + (i.qty * i.unitPrice), 0) + b.deliveryFee - b.discount;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, activeTab, searchQuery, dateRange, sortField, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setDateRange({ from: '', to: '' });
  };

  const isFiltering = searchQuery !== '' || dateRange.from !== '' || dateRange.to !== '';

  return (
    <div style={{ padding: '1.5rem', width: '100%', maxWidth: 1600, margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--navy)', marginBottom: 2 }}>
            Orders Management
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', fontWeight: 300, margin: 0 }}>
            Track and manage all customer orders
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 500, margin: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <motion.button
            whileHover={{ y: -2, boxShadow: 'var(--dash-shadow-hover)' }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 100, border: '1px solid var(--dash-border)', background: 'white', color: 'var(--navy)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Download size={14} /> Export Orders
          </motion.button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem', borderRadius: 100, border: 'none',
              background: activeTab === tab ? 'var(--navy)' : 'white',
              color: activeTab === tab ? 'white' : 'var(--gray-600)',
              fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: activeTab === tab ? 600 : 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: activeTab === tab ? 'var(--dash-shadow)' : '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
          >
            {tab}
            <span style={{
              background: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'var(--dash-bg)',
              color: activeTab === tab ? 'white' : (tab === 'Cancelled' ? '#ef4444' : 'var(--navy)'),
              padding: '2px 6px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 700
            }}>
              {getTabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* FILTERS BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
          <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by Order ID or patient name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: 8, border: '1px solid var(--dash-border)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--navy)', outline: 'none' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.3rem', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
          <Calendar size={16} color="var(--gray-400)" style={{ marginLeft: '0.5rem' }} />
          <input 
            type="date" 
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--gray-600)' }}
          />
          <span style={{ color: 'var(--dash-border)' }}>|</span>
          <input 
            type="date" 
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--gray-600)' }}
          />
        </div>

        {isFiltering && (
          <button onClick={clearFilters} style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>

      {/* TABLE */}
      <div style={{ background: 'white', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--dash-bg)', borderBottom: '1px solid var(--dash-border)' }}>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Order ID</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Patient</th>
              <th 
                onClick={() => handleSort('date')}
                style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Date {sortField === 'date' ? (sortOrder === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>) : null}</div>
              </th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Items</th>
              <th 
                onClick={() => handleSort('total')}
                style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Total {sortField === 'total' ? (sortOrder === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>) : null}</div>
              </th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Payment</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Skeleton Rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--dash-border)' }}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} style={{ padding: '1rem' }}>
                      <div style={{ height: 20, background: 'var(--dash-bg)', borderRadius: 4, opacity: 0.5 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredOrders.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={8} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <PackageX size={48} color="var(--gray-200)" strokeWidth={1} style={{ marginBottom: '1rem', margin: '0 auto' }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gray-400)', fontSize: '1.2rem', margin: '0.5rem 0' }}>No orders found</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', fontWeight: 300, margin: 0 }}>Try adjusting your filters or search query.</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => {
                const total = order.items.reduce((s, i) => s + (i.qty * i.unitPrice), 0) + order.deliveryFee - order.discount;
                const pColor = paymentStatusColors[order.paymentStatus];
                const dColor = statusColors[order.deliveryStatus];
                
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--dash-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', background: 'var(--dash-bg)', padding: '2px 6px', borderRadius: 4 }}>
                        {order.id}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                          {order.patient.initials}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--navy)' }}>{order.patient.name}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-400)' }}>{order.patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: '0.85rem', color: 'var(--navy)' }}>{formatDate(order.date)}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-400)' }}>{formatTimeAgo(order.date)}</p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 100, background: 'var(--dash-bg)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-600)' }} title={order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}>
                        {order.items.length} items
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)' }}>
                      Rs. {total}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: pColor.bg, color: pColor.color }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select 
                          value={order.deliveryStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{ 
                            padding: '4px 24px 4px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600,
                            background: dColor.bg, color: dColor.color, border: 'none', outline: 'none',
                            cursor: 'pointer', appearance: 'none'
                          }}
                        >
                          {Object.keys(statusColors).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} color={dColor.color} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <motion.button whileHover={{ scale: 1.1, color: 'var(--blue)' }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedOrder(order)} style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 4 }}>
                          <Eye size={18} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1, color: 'var(--navy)' }} whileTap={{ scale: 0.9 }} onClick={() => { setSelectedOrder(order); setTimeout(() => window.print(), 100); }} style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 4 }}>
                          <Printer size={18} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1, color: 'var(--navy)' }} whileTap={{ scale: 0.9 }} style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 4 }}>
                          <MoreVertical size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        {!isLoading && filteredOrders.length > 0 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
              Showing 1–{filteredOrders.length} of {filteredOrders.length} orders
            </span>
          </div>
        )}
      </div>

      <OrderDetailModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />
    </div>
  );
}
