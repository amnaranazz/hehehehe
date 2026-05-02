import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Bell, CreditCard, Users, Mail, Phone, 
  MapPin, Camera, ChevronRight, UserPlus, MoreHorizontal, 
  Trash2, MailCheck, ShieldCheck, Globe
} from 'lucide-react';
import InviteTeamModal from '../../components/modals/InviteTeamModal';
import UpgradePlanModal from '../../components/modals/UpgradePlanModal';
import { useToast } from '../../hooks/useToast';

/**
 * Implements Settings & Team Management per MedSenseAI SRS Section 3.2.14.
 * Features: Profile management, Team member controls, and Plan status.
 */

const MOCK_TEAM = [
  { id: 1, name: 'Dr. Sarah Ahmed', role: 'Owner / Chief Pharmacist', email: 'sarah.ahmed@pharmacy.com', status: 'active', joined: '2025-10-12' },
  { id: 2, name: 'Bilal Hussain', role: 'Pharmacist', email: 'bilal.h@pharmacy.com', status: 'active', joined: '2026-01-05' },
  { id: 3, name: 'Zainab Bibi', role: 'Store Manager', email: 'zainab.b@pharmacy.com', status: 'inactive', joined: '2026-03-20' },
  { id: 4, name: 'Ahmed Khan', role: 'Pharmacist', email: 'ahmed.k@pharmacy.com', status: 'active', joined: '2026-04-15' },
];

export default function Settings() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Profile');
  const [team, setTeam] = useState(MOCK_TEAM);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Team', icon: Users },
    { name: 'Notifications', icon: Bell },
    { name: 'Billing', icon: CreditCard },
    { name: 'Security', icon: Shield },
  ];

  const handleToggleStatus = (id) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m));
    showToast({ type: 'success', message: 'Member status updated' });
  };

  const handleDeleteMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    showToast({ type: 'success', message: 'Team member removed' });
  };

  return (
    <div style={{ padding: '1.5rem', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--navy)', marginBottom: 4 }}>
          Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', fontWeight: 300 }}>
          Manage your pharmacy profile, team permissions, and account preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* SIDEBAR TABS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <motion.button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              whileHover={{ x: 4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: activeTab === tab.name ? 'var(--navy)' : 'transparent',
                color: activeTab === tab.name ? 'white' : 'var(--gray-600)',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{tab.name}</span>
              {activeTab === tab.name && (
                 <motion.div layoutId="setting-tab" style={{ marginLeft: 'auto' }}>
                    <ChevronRight size={16} />
                 </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div style={{ background: 'white', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)', overflow: 'hidden' }}>
          
          {activeTab === 'Profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--dash-bg)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)' }}>
                       SA
                    </div>
                    <button style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', background: 'white', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                       <Camera size={16} color="var(--blue)" />
                    </button>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 700 }}>Dr. Sarah Ahmed</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray-400)' }}>Chief Pharmacist at MedLife Pharmacy</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                       <span style={{ padding: '2px 8px', borderRadius: 100, background: 'var(--blue-light)', color: 'var(--blue)', fontSize: '0.65rem', fontWeight: 700 }}>VERIFIED</span>
                       <span style={{ padding: '2px 8px', borderRadius: 100, background: 'var(--dash-bg)', color: 'var(--gray-600)', fontSize: '0.65rem', fontWeight: 700 }}>PH-44921</span>
                    </div>
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                     <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Pharmacy Name</label>
                     <div style={{ position: 'relative' }}>
                        <Globe size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                        <input defaultValue="MedLife Pharmacy & Clinic" style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', borderRadius: 10, border: '1.5px solid var(--dash-border)', outline: 'none' }} />
                     </div>
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Email Address</label>
                     <div style={{ position: 'relative' }}>
                        <Mail size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                        <input defaultValue="sarah.ahmed@pharmacy.com" style={{ width: '100%', padding: '0.7rem 1rem 2.75rem', borderRadius: 10, border: '1.5px solid var(--dash-border)', outline: 'none' }} />
                     </div>
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Phone Number</label>
                     <div style={{ position: 'relative' }}>
                        <Phone size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                        <input defaultValue="+92 300 1234567" style={{ width: '100%', padding: '0.7rem 1rem 2.75rem', borderRadius: 10, border: '1.5px solid var(--dash-border)', outline: 'none' }} />
                     </div>
                  </div>
               </div>

               <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ padding: '0.7rem 2rem', borderRadius: 100, border: 'none', background: 'var(--navy)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                     Save Changes
                  </motion.button>
               </div>
            </motion.div>
          )}

          {activeTab === 'Team' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700 }}>Team Management</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-400)' }}>Manage permissions for your pharmacy staff.</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIsInviteModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.25rem', borderRadius: 100, border: 'none', background: 'var(--navy)', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <UserPlus size={16} /> Invite Member
                  </motion.button>
               </div>

               <div style={{ border: '1px solid var(--dash-border)', borderRadius: 16, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                       <tr style={{ background: 'var(--dash-bg)', borderBottom: '1px solid var(--dash-border)' }}>
                          <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Member</th>
                          <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Role</th>
                          <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Status</th>
                          <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Joined</th>
                          <th style={{ padding: '1rem', textAlign: 'right' }}></th>
                       </tr>
                    </thead>
                    <tbody>
                       {team.map(member => (
                         <tr key={member.id} style={{ borderBottom: '1px solid var(--dash-border)' }}>
                            <td style={{ padding: '1rem' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--dash-bg)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                                     {member.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                     <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>{member.name}</p>
                                     <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--gray-400)' }}>{member.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--gray-600)' }}>{member.role}</td>
                            <td style={{ padding: '1rem' }}>
                               <motion.div 
                                 onClick={() => handleToggleStatus(member.id)}
                                 style={{ 
                                   display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 100, 
                                   cursor: 'pointer', background: member.status === 'active' ? 'var(--green-light)' : 'var(--red-light)',
                                   color: member.status === 'active' ? 'var(--green)' : 'var(--red)'
                                 }}
                               >
                                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: member.status === 'active' ? 'var(--green)' : 'var(--red)' }} />
                                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{member.status}</span>
                               </motion.div>
                            </td>
                            <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--gray-400)' }}>{member.joined}</td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                  <button onClick={() => handleDeleteMember(member.id)} style={{ padding: '0.4rem', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                     <Trash2 size={16} />
                                  </button>
                                  <button style={{ padding: '0.4rem', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                     <MoreHorizontal size={16} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {activeTab === 'Billing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700 }}>Current Plan</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-400)' }}>You are currently on the <strong>Free Tier</strong>.</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIsUpgradeModalOpen(true)}
                    style={{ padding: '0.6rem 1.25rem', borderRadius: 100, border: 'none', background: 'var(--blue)', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Upgrade Plan
                  </motion.button>
               </div>

               <div style={{ background: 'var(--dash-bg)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--dash-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Plan Usage</span>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>42 / 50 Rx</span>
                  </div>
                  <div style={{ width: '100%', height: 8, background: 'rgba(0,0,0,0.05)', borderRadius: 100, overflow: 'hidden' }}>
                     <motion.div 
                       initial={{ width: 0 }} animate={{ width: '84%' }}
                       style={{ height: '100%', background: 'var(--blue)', borderRadius: 100 }}
                     />
                  </div>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.7rem', color: 'var(--gray-400)' }}>Your plan resets in <strong>8 days</strong>. Upgrade to Pro for unlimited prescriptions.</p>
               </div>
            </motion.div>
          )}

        </div>
      </div>

      <InviteTeamModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <UpgradePlanModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
}
