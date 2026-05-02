// src/components/consultations/ConsultationQueue.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortDesc, Users } from 'lucide-react';

export default function ConsultationQueue({ queue, activeId, onSelect }) {
  const [sortBy, setSortBy] = useState('urgency');

  const sortedQueue = [...queue].sort((a, b) => {
    if (sortBy === 'urgency') {
      const levels = { critical: 0, high: 1, medium: 2, low: 3 };
      return levels[a.urgency] - levels[b.urgency];
    }
    return a.waitStart - b.waitStart;
  });

  return (
    <div style={{ 
      width: '300px', minWidth: '300px', background: 'white', 
      borderRight: '1px solid var(--dash-border)', display: 'flex', 
      flexDirection: 'column', height: '100%' 
    }}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--dash-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Escalated Queue
            <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
              <span className="pulse-dot" style={{ position: 'absolute', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--green)', opacity: 0.75 }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', background: 'var(--green)' }}></span>
            </span>
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)' }}>
            {queue.length} waiting
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <SortButton active={sortBy === 'urgency'} onClick={() => setSortBy('urgency')}>Urgency</SortButton>
          <SortButton active={sortBy === 'wait'} onClick={() => setSortBy('wait')}>Wait Time</SortButton>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }} className="no-scrollbar">
        <AnimatePresence initial={false}>
          {sortedQueue.length > 0 ? (
            sortedQueue.map((item) => (
              <QueueItem 
                key={item.id} 
                item={item} 
                isActive={activeId === item.id} 
                onClick={() => onSelect(item.id)} 
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '4rem', color: 'var(--gray-300)' }}>
              <Users size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No patients in queue</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .pulse-dot { animation: pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
}

function QueueItem({ item, isActive, onClick }) {
  const [waitTime, setWaitTime] = useState(Math.floor((Date.now() - item.waitStart) / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setWaitTime(Math.floor((Date.now() - item.waitStart) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [item.waitStart]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  };

  const getTimerColor = () => {
    if (waitTime >= 600) return 'var(--red)';
    if (waitTime >= 300) return 'var(--amber)';
    return 'var(--gray-400)';
  };

  const colors = {
    critical: { bg: 'var(--red)', label: 'Critical' },
    high: { bg: 'var(--amber)', label: 'High' },
    medium: { bg: 'var(--blue)', label: 'Medium' },
    low: { bg: 'var(--gray-400)', label: 'Low' }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      style={{
        padding: '1rem',
        borderRadius: '12px',
        background: isActive ? 'var(--dash-bg)' : 'transparent',
        borderLeft: `4px solid ${isActive ? 'var(--blue)' : 'transparent'}`,
        cursor: 'pointer',
        marginBottom: '0.5rem',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '50%', 
          background: colors[item.urgency].bg, display: 'flex', 
          alignItems: 'center', justifyContent: 'center', color: 'white',
          fontWeight: 800, fontSize: '0.85rem', flexShrink: 0
        }}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.name}, {item.age}
            </span>
            {item.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)' }} />}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', margin: '0 0 8px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.preview}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: getTimerColor() }}>
              Waiting {formatTime(waitTime)}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
               <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--dash-bg)', color: 'var(--gray-500)', fontWeight: 600 }}>{item.source}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SortButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        fontSize: '0.7rem',
        fontWeight: 600,
        borderRadius: '100px',
        border: '1px solid',
        borderColor: active ? 'var(--blue)' : 'var(--dash-border)',
        background: active ? 'var(--blue)' : 'transparent',
        color: active ? 'white' : 'var(--gray-500)',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </button>
  );
}
