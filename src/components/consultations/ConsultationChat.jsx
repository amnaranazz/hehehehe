// src/components/consultations/ConsultationChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Share2, MoreHorizontal, Send, Zap, 
  Paperclip, ChevronDown, ChevronUp, Bot, Star, X
} from 'lucide-react';
import { chatHistory, cannedResponses } from '../../utils/consultationData';

export default function ConsultationChat({ patient, onResolve, onToggleQueue, isTablet }) {
  const [messages, setMessages] = useState(chatHistory[patient.id] || []);
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showCanned, setShowCanned] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [waitTime, setWaitTime] = useState(Math.floor((Date.now() - patient.waitStart) / 1000));
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWaitTime(Math.floor((Date.now() - patient.waitStart) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [patient.waitStart]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showHistory]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      role: 'pharmacist',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  const insertCanned = (text) => {
    setInput(text);
    setShowCanned(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', position: 'relative' }}>
      {/* HEADER */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isTablet && (
            <button 
              onClick={onToggleQueue}
              style={{ background: 'var(--dash-bg)', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Queue
            </button>
          )}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>{patient.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase' }}>{patient.urgency}</span>
              <span style={{ color: 'var(--gray-300)' }}>&middot;</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Waiting {formatTime(waitTime)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#fffbeb', color: '#92400e', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bot size={14} /> AI Context: {patient.handoff.summary}
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowResolveConfirm(true)}
              style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle size={16} /> Mark Resolved
            </button>
            <AnimatePresence>
              {showResolveConfirm && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '220px', background: 'white', border: '1px solid var(--dash-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '1rem', zIndex: 10 }}
                >
                  <p style={{ fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Mark this consultation as resolved?</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setShowResolveConfirm(false); setIsResolving(true); }} style={{ flex: 1, padding: '6px', background: 'var(--green)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Confirm</button>
                    <button onClick={() => setShowResolveConfirm(false)} style={{ flex: 1, padding: '6px', background: 'var(--dash-bg)', color: 'var(--gray-600)', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button style={{ background: 'var(--dash-bg)', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}><Share2 size={18} color="var(--gray-600)" /></button>
          <button style={{ background: 'var(--dash-bg)', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}><MoreHorizontal size={18} color="var(--gray-600)" /></button>
        </div>
      </div>

      {/* MESSAGE AREA */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: '#f8fafc' }} className="no-scrollbar">
        {/* AI Handoff Card */}
        <div style={{ 
          background: '#fff9eb', borderLeft: '4px solid var(--amber)', borderRadius: '8px', 
          padding: '1rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Bot size={18} color="var(--amber)" />
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#92400e' }}>AI Handoff Summary</h4>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#92400e', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ margin: 0 }}><strong>Patient:</strong> {patient.name}</p>
            <p style={{ margin: 0 }}><strong>Query:</strong> "{patient.handoff.query}"</p>
            <p style={{ margin: 0 }}><strong>AI Confidence:</strong> {patient.handoff.confidence}% (escalated)</p>
            <p style={{ margin: 0 }}><strong>Attempted:</strong> {patient.handoff.attempted}</p>
          </div>
        </div>

        {/* System Message */}
        <div style={{ textAlign: 'center', margin: '2rem 0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--dash-border)', zIndex: 0 }} />
          <span style={{ position: 'relative', zIndex: 1, background: '#f8fafc', padding: '0 1rem', fontSize: '0.75rem', color: 'var(--gray-400)', fontStyle: 'italic' }}>
            AI escalated this conversation &middot; 4 minutes ago
          </span>
        </div>

        {/* History Toggle */}
        <button 
          onClick={() => setShowHistory(!showHistory)}
          style={{ width: '100%', marginBottom: '1.5rem', background: 'transparent', border: 'none', color: 'var(--blue)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
        >
          {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showHistory ? 'Hide' : 'Show'} AI conversation history ({messages.filter(m => m.id.startsWith?.('m')).length} messages)
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg, i) => {
            const isAIHistory = msg.id.toString().startsWith('m');
            if (isAIHistory && !showHistory) return null;

            const isPatient = msg.role === 'patient';
            const isPharmacist = msg.role === 'pharmacist';
            const isAssistant = msg.role === 'assistant';

            return (
              <div key={msg.id} style={{ alignSelf: isPharmacist ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', gap: '10px', flexDirection: isPharmacist ? 'row-reverse' : 'row' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: isPharmacist ? 'var(--blue)' : isAssistant ? 'var(--dash-bg)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isPharmacist ? <span style={{ fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>YOU</span> : isAssistant ? <Bot size={16} color="var(--blue)" /> : <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{patient.name[0]}</span>}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', justifyContent: isPharmacist ? 'flex-end' : 'flex-start' }}>
                     <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-500)' }}>{isPharmacist ? 'You' : isAssistant ? 'AI Assistant' : patient.name}</span>
                     <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{msg.time}</span>
                  </div>
                  <div style={{ 
                    padding: '0.8rem 1.25rem', borderRadius: isPharmacist ? '20px 4px 20px 20px' : '4px 20px 20px 20px', 
                    background: isPharmacist ? 'var(--blue)' : isAssistant ? '#f1f5f9' : 'white', 
                    color: isPharmacist ? 'white' : 'var(--navy)', fontSize: '0.9rem', lineHeight: 1.5,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: isAssistant ? '1px dashed var(--dash-border)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INPUT AREA */}
      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--dash-border)', background: 'white' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ position: 'relative', flex: 1 }}>
             <textarea 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
               placeholder="Type your response..."
               style={{ width: '100%', minHeight: '44px', maxHeight: '120px', padding: '12px 48px 12px 16px', borderRadius: '12px', border: '1px solid var(--dash-border)', outline: 'none', resize: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
             />
             <button 
               onClick={() => setShowCanned(!showCanned)}
               style={{ position: 'absolute', left: '16px', bottom: '12px', padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
               title="Quick Responses"
             >
               {/* Shifted icon position would be better, but user said same as page 9 */}
             </button>
             <div style={{ position: 'absolute', right: '12px', bottom: '10px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setShowCanned(!showCanned)}
                  style={{ background: 'none', border: 'none', color: 'var(--amber)', cursor: 'pointer' }}
                >
                  <Zap size={20} fill="var(--amber)" />
                </button>
                <button style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}><Paperclip size={20} /></button>
             </div>
             
             {/* Canned Responses Popover */}
             <AnimatePresence>
               {showCanned && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                   style={{ position: 'absolute', bottom: 'calc(100% + 12px)', left: 0, right: 0, background: 'white', border: '1px solid var(--dash-border)', borderRadius: '12px', boxShadow: '0 -10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 20 }}
                 >
                   <div style={{ padding: '0.75rem 1rem', background: 'var(--dash-bg)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--gray-500)', borderBottom: '1px solid var(--dash-border)' }}>QUICK RESPONSES</div>
                   {cannedResponses.map((res, i) => (
                     <button key={i} onClick={() => insertCanned(res)} style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', background: 'none', border: 'none', borderBottom: i < cannedResponses.length - 1 ? '1px solid var(--dash-border)' : 'none', fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--dash-bg)'} onMouseLeave={(e) => e.target.style.background = 'none'}>{res}</button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--navy)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: !input.trim() ? 0.5 : 1 }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* RESOLUTION PANEL */}
      <AnimatePresence>
        {isResolving && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '2px solid var(--green)', boxShadow: '0 -20px 50px rgba(0,0,0,0.15)', padding: '2rem', zIndex: 100 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--navy)' }}>Rate & Close Consultation</h3>
               <button onClick={() => setIsResolving(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--gray-400)" /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '0.5rem' }}>Rate this consultation</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={24} color="var(--amber)" fill={s <= 4 ? "var(--amber)" : "none"} style={{ cursor: 'pointer' }} />)}
                </div>
                
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '0.5rem' }}>Resolution Note</label>
                <textarea placeholder="Add a note (optional)..." style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '10px', border: '1px solid var(--dash-border)', outline: 'none', fontSize: '0.85rem' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '0.5rem' }}>Tags</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                  {["Drug interaction", "Dosage question", "Prescription review", "Allergy concern", "Side effects", "General advice"].map(t => (
                    <span key={t} style={{ padding: '6px 12px', borderRadius: '100px', border: '1px solid var(--dash-border)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.borderColor = 'var(--blue)'} onMouseLeave={(e) => e.target.style.borderColor = 'var(--dash-border)'}>{t}</span>
                  ))}
                </div>
                
                <button 
                  onClick={() => onResolve(patient.id)}
                  style={{ width: '100%', padding: '0.8rem', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Save & Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
