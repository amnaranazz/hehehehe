// src/pages/dashboard/Consultations.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from '../../hooks/useWindowSize';
import { queueData as initialQueue } from '../../utils/consultationData';

// Sub-components
import ConsultationQueue from '../../components/consultations/ConsultationQueue';
import ConsultationChat from '../../components/consultations/ConsultationChat';
import PatientContextPanel from '../../components/consultations/PatientContextPanel';

export default function Consultations() {
  const [queue, setQueue] = useState(initialQueue);
  const [activeId, setActiveId] = useState(initialQueue[0]?.id || null);
  const [isQueueOpen, setIsQueueOpen] = useState(false); // For tablet drawer
  const { width } = useWindowSize();

  const isTablet = width < 1024;
  const isMobile = width < 768;

  const activePatient = queue.find(p => p.id === activeId);

  // Play soft beep sound
  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  }, []);

  // Simulate new patient after 15s
  useEffect(() => {
    const timer = setTimeout(() => {
      const newPatient = {
        id: 'p5',
        name: 'Usman Ghani',
        age: 29,
        gender: 'Male',
        urgency: 'medium',
        waitStart: new Date(),
        preview: 'Hi, I received my order but one item is missing...',
        unread: true,
        source: 'Direct',
        handoff: {
          summary: 'Missing item in order',
          query: 'Hi, I received my order but one item is missing...',
          confidence: 100,
          attempted: 'Direct escalation',
        }
      };
      setQueue(prev => [newPatient, ...prev]);
      playBeep();
    }, 15000);

    return () => clearTimeout(timer);
  }, [playBeep]);

  const handleResolve = (id) => {
    setQueue(prev => prev.filter(p => p.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  };

  const handleSelectPatient = (id) => {
    setActiveId(id);
    setQueue(prev => prev.map(p => p.id === id ? { ...p, unread: false } : p));
    if (isTablet) setIsQueueOpen(false);
  };

  return (
    <div style={{ 
      display: 'flex', height: 'calc(100vh - 64px - 2.5rem)', 
      margin: '-1.25rem -1.5rem', overflow: 'hidden',
      background: 'var(--dash-bg)'
    }}>
      {/* QUEUE PANEL */}
      {!isTablet ? (
        <ConsultationQueue 
          queue={queue} 
          activeId={activeId} 
          onSelect={handleSelectPatient} 
        />
      ) : (
        <AnimatePresence>
          {isQueueOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsQueueOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100 }}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 300, zIndex: 101, background: 'white' }}
              >
                <ConsultationQueue 
                  queue={queue} 
                  activeId={activeId} 
                  onSelect={handleSelectPatient} 
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* CHAT PANEL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {activePatient ? (
          <ConsultationChat 
            patient={activePatient} 
            onResolve={handleResolve}
            onToggleQueue={() => setIsQueueOpen(true)}
            isTablet={isTablet}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--dash-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ fontSize: '2rem' }}>✓</span>
              </div>
              <h3 style={{ margin: 0, color: 'var(--navy)' }}>All caught up!</h3>
              <p style={{ fontSize: '0.85rem' }}>No patients waiting in queue at the moment.</p>
              {isTablet && (
                <button 
                  onClick={() => setIsQueueOpen(true)}
                  style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Open Queue ({queue.length})
                </button>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* CONTEXT PANEL */}
      {!isMobile && activePatient && (
        <PatientContextPanel patient={activePatient} />
      )}
    </div>
  );
}
