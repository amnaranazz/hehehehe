// src/components/consultations/PatientContextPanel.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, ShoppingCart, Info } from 'lucide-react';
import { patientContexts } from '../../utils/consultationData';

export default function PatientContextPanel({ patient }) {
  const context = patientContexts[patient.id] || { allergies: [], medications: [], history: [], cart: [] };
  const [expandedHist, setExpandedHist] = useState(0);
  const [privateNote, setPrivateNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleNoteBlur = () => {
    if (privateNote.trim()) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div style={{ 
      width: '320px', minWidth: '320px', background: 'white', 
      borderLeft: '1px solid var(--dash-border)', display: 'flex', 
      flexDirection: 'column', height: '100%', overflowY: 'auto' 
    }} className="no-scrollbar">
      
      {/* HEADER */}
      <div style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '1px solid var(--dash-border)' }}>
        <div style={{ 
          width: 64, height: 64, borderRadius: '50%', background: 'var(--dash-bg)', 
          margin: '0 auto 1rem', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' 
        }}>
          {patient.name[0]}
        </div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--navy)', fontWeight: 800 }}>{patient.name}</h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--gray-400)' }}>{patient.age} years &middot; {patient.gender}</p>
        <a href={`/patients/${patient.id}`} style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          View Full Profile <ExternalLink size={12} />
        </a>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* SECTION 1: ALLERGIES */}
        <div className="dash-card" style={{ padding: '1rem', borderLeft: '4px solid var(--red)' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Known Allergies</h4>
          {context.allergies.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {context.allergies.map((a, i) => (
                <div 
                  key={i} 
                  title={a.severity}
                  style={{ padding: '4px 10px', borderRadius: '60px', background: '#fff1f0', color: 'var(--red)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #ffa39e', cursor: 'help', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {a.name} <Info size={10} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-400)', fontStyle: 'italic' }}>No known allergies recorded</p>
          )}
        </div>

        {/* SECTION 2: CURRENT MEDICATIONS */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Current Medications</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {context.medications.map((m, i) => (
              <div key={i} style={{ padding: '0.75rem', background: 'var(--dash-bg)', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)' }}>{m.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                  <span>{m.dosage}</span>
                  <span>Since {m.since}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: PRESCRIPTION HISTORY */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Prescription History</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {context.history.map((h, i) => (
              <div key={i} style={{ border: '1px solid var(--dash-border)', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setExpandedHist(expandedHist === i ? -1 : i)}
                  style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700 }}>{h.date}</p>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--gray-400)' }}>By {h.doctor}</p>
                  </div>
                  {expandedHist === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {expandedHist === i && (
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      style={{ overflow: 'hidden', background: 'var(--dash-bg)', borderTop: '1px solid var(--dash-border)' }}
                    >
                      <div style={{ padding: '0.75rem' }}>
                        <ul style={{ margin: '0 0 8px 0', padding: '0 0 0 1.25rem', fontSize: '0.7rem', color: 'var(--gray-600)' }}>
                          {h.items.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                        <span style={{ 
                          fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase',
                          background: h.status === 'Active' ? '#f6ffed' : h.status === 'Cancelled' ? '#fff1f0' : 'var(--dash-border)',
                          color: h.status === 'Active' ? 'var(--green)' : h.status === 'Cancelled' ? 'var(--red)' : 'var(--gray-500)',
                          border: `1px solid ${h.status === 'Active' ? '#b7eb8f' : h.status === 'Cancelled' ? '#ffa39e' : '#d9d9d9'}`
                        }}>
                          {h.status}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CURRENT CART */}
        <div style={{ padding: '1.25rem', background: 'var(--navy)', borderRadius: '12px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <ShoppingCart size={18} />
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>Current Cart</h4>
          </div>
          {context.cart.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                {context.cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ opacity: 0.8 }}>{item.qty}x {item.name}</span>
                    <span style={{ fontWeight: 700 }}>₨{item.price}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.75rem', fontWeight: 800 }}>
                <span>Total</span>
                <span>₨{context.cart.reduce((acc, curr) => acc + curr.price, 0)}</span>
              </div>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>No items in cart</p>
          )}
        </div>

        {/* SECTION 5: PRIVATE NOTES */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
             <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Consultation Notes</h4>
             {isSaved && <span style={{ fontSize: '0.7rem', color: 'var(--green)', fontWeight: 600 }}>Saved ✓</span>}
          </div>
          <textarea 
            placeholder="Add private notes..."
            value={privateNote}
            onChange={(e) => setPrivateNote(e.target.value)}
            onBlur={handleNoteBlur}
            style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '10px', border: '1px solid var(--dash-border)', outline: 'none', fontSize: '0.85rem', fontFamily: 'inherit', background: '#fcfcfc' }}
          />
        </div>
      </div>
    </div>
  );
}
