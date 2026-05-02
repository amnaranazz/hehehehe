import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Shield, Briefcase, Send } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

/**
 * Implements Team Management per MedSenseAI SRS Section 3.2.14.
 * Allows pharmacy owners to invite staff with specific roles.
 */
export default function InviteTeamModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(''); // 'pharmacist' or 'manager'
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isInvalid = !isValidEmail(email) || !role;

  const handleSend = () => {
    if (isInvalid) return;
    setIsSending(true);
    setTimeout(() => {
      showToast({ type: 'success', message: `Invite sent to ${email}` });
      setIsSending(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(13, 17, 23, 0.4)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'relative', width: '100%', maxWidth: 480,
              background: 'white', borderRadius: 'var(--dash-radius)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.15)', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--dash-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserPlus size={18} color="var(--navy)" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Invite Team Member</h3>
               </div>
               <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)' }}>
                 <X size={20} />
               </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Email Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Email Address *</label>
                <div style={{ position: 'relative' }}>
                   <Mail size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                   <input 
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="e.g. colleague@pharmacy.com"
                     style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', borderRadius: 10, border: '1.5px solid var(--dash-border)', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}
                   />
                </div>
              </div>

              {/* Role Selection (Visual Cards) */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.75rem' }}>Select Role *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                   {[
                     { id: 'pharmacist', label: 'Pharmacist', icon: Shield, desc: 'Can review Rx and alerts' },
                     { id: 'manager', label: 'Store Manager', icon: Briefcase, desc: 'Full access to inventory' }
                   ].map(r => (
                     <motion.div 
                       key={r.id}
                       whileHover={{ y: -2 }}
                       onClick={() => setRole(r.id)}
                       style={{ 
                         padding: '1.25rem 1rem', borderRadius: 12, border: '2.5px solid',
                         borderColor: role === r.id ? 'var(--blue)' : 'var(--dash-border)',
                         background: role === r.id ? 'var(--blue-light)' : 'white',
                         cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
                       }}
                     >
                       {role === r.id && (
                         <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <CheckCircle size={10} color="white" />
                         </div>
                       )}
                       <div style={{ width: 32, height: 32, borderRadius: 8, background: role === r.id ? 'white' : 'var(--dash-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                         <r.icon size={16} color={role === r.id ? 'var(--blue)' : 'var(--gray-400)'} />
                       </div>
                       <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: role === r.id ? 'var(--blue)' : 'var(--navy)' }}>{r.label}</p>
                       <p style={{ margin: '4px 0 0 0', fontSize: '0.65rem', color: 'var(--gray-400)', lineHeight: 1.3 }}>{r.desc}</p>
                     </motion.div>
                   ))}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Personal Message (Optional)</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Invite message..."
                  style={{ width: '100%', minHeight: 80, padding: '0.75rem 1rem', borderRadius: 10, border: '1.5px solid var(--dash-border)', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.88rem', resize: 'none' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
               <button onClick={onClose} style={{ padding: '0.6rem 1.25rem', borderRadius: 100, border: '1px solid var(--dash-border)', background: 'white', color: 'var(--gray-600)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                 Cancel
               </button>
               <motion.button
                 whileHover={!isInvalid ? { scale: 1.02 } : {}}
                 whileTap={!isInvalid ? { scale: 0.98 } : {}}
                 disabled={isInvalid || isSending}
                 onClick={handleSend}
                 style={{ 
                    padding: '0.6rem 1.5rem', borderRadius: 100, border: 'none', background: 'var(--navy)', color: 'white', 
                    fontSize: '0.85rem', fontWeight: 600, cursor: isInvalid ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8, opacity: isInvalid || isSending ? 0.6 : 1
                 }}
               >
                 <Send size={16} />
                 {isSending ? 'Sending...' : 'Send Invite'}
               </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Internal component for small checkmark
function CheckCircle({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
