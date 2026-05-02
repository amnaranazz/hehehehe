import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Search, Filter, ChevronRight, X, 
  MessageSquare, History, BookOpen, Send, CheckCircle, 
  AlertCircle, ShieldAlert, MoreHorizontal, User, Clock
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import AlertResolutionModal from '../../components/modals/AlertResolutionModal';

/**
 * Implements EUC-08 Pharmacist Guidance for Drug Interaction per MedSenseAI SRS Section 3.2.08.
 * Comprehensive dashboard for managing drug interaction alerts.
 */

const MOCK_ALERTS = [
  { id: 'AL-101', patientName: 'Ahmed Khan', patientId: 'PAT-1042', initials: 'AK', medicines: ['Warfarin', 'Aspirin'], type: 'Drug-Drug', severity: 'critical', description: 'Concurrent use significantly increases bleeding risk.', timestamp: '2026-05-01T10:30:00Z', status: 'unreviewed', timeAgo: '2h ago' },
  { id: 'AL-102', patientName: 'Sara Raza', patientId: 'PAT-2091', initials: 'SR', medicines: ['Metformin', 'Contrast Dye'], type: 'Drug-Condition', severity: 'warning', description: 'Risk of lactic acidosis during radiological procedures.', timestamp: '2026-05-01T11:15:00Z', status: 'unreviewed', timeAgo: '1h ago' },
  { id: 'AL-103', patientName: 'Bilal Hussain', patientId: 'PAT-0337', initials: 'BH', medicines: ['Lisinopril', 'Spironolactone'], type: 'Drug-Drug', severity: 'warning', description: 'Risk of hyperkalemia. Monitor potassium levels.', timestamp: '2026-05-01T09:45:00Z', status: 'resolved', timeAgo: '3h ago' },
  { id: 'AL-104', patientName: 'Fatima Ali', patientId: 'PAT-1155', initials: 'FA', medicines: ['Amoxicillin', 'Methotrexate'], type: 'Drug-Drug', severity: 'info', description: 'Amoxicillin can reduce methotrexate clearance.', timestamp: '2026-04-30T16:20:00Z', status: 'unreviewed', timeAgo: 'Yesterday' },
  { id: 'AL-105', patientName: 'Usman Sheikh', patientId: 'PAT-2240', initials: 'US', medicines: ['Atorvastatin', 'Erythromycin'], type: 'Drug-Drug', severity: 'critical', description: 'Increased risk of rhabdomyolysis due to CYP3A4 inhibition.', timestamp: '2026-05-01T08:10:00Z', status: 'unreviewed', timeAgo: '4h ago' },
  { id: 'AL-106', patientName: 'Zainab Bibi', patientId: 'PAT-4412', initials: 'ZB', medicines: ['Digoxin', 'Furosemide'], type: 'Drug-Drug', severity: 'warning', description: 'Diuretic-induced hypokalemia may potentiate digoxin toxicity.', timestamp: '2026-05-01T07:30:00Z', status: 'unreviewed', timeAgo: '5h ago' },
  { id: 'AL-107', patientName: 'Ibrahim Malik', patientId: 'PAT-0992', initials: 'IM', medicines: ['Ciprofloxacin', 'Tizanidine'], type: 'Drug-Drug', severity: 'critical', description: 'Severe hypotension and sedation risk.', timestamp: '2026-04-30T14:15:00Z', status: 'resolved', timeAgo: 'Yesterday' },
  { id: 'AL-108', patientName: 'Mariam Jameel', patientId: 'PAT-3321', initials: 'MJ', medicines: ['Fluoxetine', 'Tramadol'], type: 'Drug-Drug', severity: 'warning', description: 'Increased risk of serotonin syndrome.', timestamp: '2026-04-30T11:40:00Z', status: 'unreviewed', timeAgo: 'Yesterday' },
];

export default function InteractionAlerts() {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warning').length,
      info: alerts.filter(a => a.severity === 'info').length,
    };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    let result = alerts;
    if (activeTab !== 'all') {
      result = result.filter(a => a.severity === activeTab);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.patientName.toLowerCase().includes(q) || 
        a.medicines.some(m => m.toLowerCase().includes(q))
      );
    }
    return result;
  }, [alerts, activeTab, searchQuery]);

  const handleResolve = (id, resolutionData) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved', ...resolutionData } : a));
    if (selectedAlert?.id === id) {
      setSelectedAlert(prev => ({ ...prev, status: 'resolved', ...resolutionData }));
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'critical': return 'var(--red)';
      case 'warning': return '#f59e0b';
      case 'info': return 'var(--blue)';
      default: return 'var(--gray-400)';
    }
  };

  return (
    <div style={{ padding: '1.5rem', width: '100%', maxWidth: 1600, margin: '0 auto', display: 'flex', gap: '1.5rem', position: 'relative' }}>
      
      {/* MAIN CONTENT */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* HEADER */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--navy)', marginBottom: 4 }}>
            Interaction Alerts
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', fontWeight: 300 }}>
            Real-time drug-drug and drug-condition interaction monitoring.
          </p>
        </div>

        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Alerts', value: stats.total, icon: ShieldAlert, color: 'var(--navy)' },
            { label: 'Critical', value: stats.critical, icon: AlertCircle, color: 'var(--red)' },
            { label: 'Warning', value: stats.warning, icon: AlertTriangle, color: '#f59e0b' },
            { label: 'Mild/Info', value: stats.info, icon: AlertCircle, color: 'var(--blue)' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} style={{ background: 'white', borderRadius: 'var(--dash-radius)', padding: '1.25rem', border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--navy)', margin: '0 0 0.25rem 0' }}>{stat.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* FILTER BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 350 }}>
            <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by patient or medicine..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: 100, border: '1px solid var(--dash-border)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--navy)', outline: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'critical', 'warning', 'info'].map(sev => (
              <button 
                key={sev} 
                onClick={() => setActiveTab(sev)}
                style={{ 
                  padding: '0.5rem 1rem', borderRadius: 100, border: '1px solid var(--dash-border)',
                  background: activeTab === sev ? 'var(--navy)' : 'white',
                  color: activeTab === sev ? 'white' : 'var(--gray-600)',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* ALERTS TABLE */}
        <div style={{ background: 'white', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--dash-bg)', borderBottom: '1px solid var(--dash-border)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Patient</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Medicines</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Severity</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map(alert => (
                <motion.tr 
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  style={{ borderBottom: '1px solid var(--dash-border)', cursor: 'pointer', background: selectedAlert?.id === alert.id ? 'var(--dash-bg)' : 'transparent' }}
                  onMouseEnter={(e) => !selectedAlert && (e.currentTarget.style.background = 'var(--dash-bg)')}
                  onMouseLeave={(e) => selectedAlert?.id !== alert.id && (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--dash-bg)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy)' }}>
                        {alert.initials}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>{alert.patientName}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--gray-400)' }}>{alert.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {alert.medicines.map(m => (
                        <span key={m} style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--dash-bg)', fontSize: '0.7rem', fontWeight: 500, color: 'var(--gray-600)' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 500 }}>{alert.type}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <motion.div 
                        animate={alert.severity === 'critical' && alert.status === 'unreviewed' ? { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: getSeverityColor(alert.severity) }} 
                      />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: getSeverityColor(alert.severity), textTransform: 'capitalize' }}>
                        {alert.severity}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--navy)', fontWeight: 500 }}>{alert.timeAgo}</p>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '3px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700,
                      background: alert.status === 'resolved' ? 'var(--green-light)' : 'var(--dash-bg)',
                      color: alert.status === 'resolved' ? 'var(--green)' : 'var(--gray-400)'
                    }}>
                      {alert.status === 'resolved' ? 'Resolved' : 'Unreviewed'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <ChevronRight size={18} color="var(--gray-300)" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{ width: 400, background: 'white', borderLeft: '1px solid var(--dash-border)', boxShadow: '-12px 0 48px rgba(0,0,0,0.08)', position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 1000, display: 'flex', flexDirection: 'column' }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Alert Details</h3>
               <button onClick={() => setSelectedAlert(null)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--dash-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                 <X size={18} color="var(--gray-600)" />
               </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {/* Severity Banner */}
              <div style={{ background: `${getSeverityColor(selectedAlert.severity)}10`, padding: '1rem', borderRadius: 12, display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <AlertCircle size={20} color={getSeverityColor(selectedAlert.severity)} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: getSeverityColor(selectedAlert.severity), textTransform: 'capitalize' }}>
                    {selectedAlert.severity} Interaction
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--gray-600)', lineHeight: 1.4 }}>
                    {selectedAlert.description}
                  </p>
                </div>
              </div>

              {/* Patient History Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                  <User size={16} color="var(--gray-400)" />
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>Patient History</p>
                </div>
                <div style={{ border: '1px solid var(--dash-border)', borderRadius: 12, padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Previous Interactions</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy)' }}>2</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Adherence Score</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)' }}>92%</span>
                  </div>
                </div>
              </div>

              {/* Guidelines Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                  <BookOpen size={16} color="var(--gray-400)" />
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>Clinical Guidelines</p>
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-600)', lineHeight: 1.5, padding: '0.75rem', background: 'var(--dash-bg)', borderRadius: 10 }}>
                  According to NICE guidelines, the combination of {selectedAlert.medicines[0]} and {selectedAlert.medicines[1]} requires close monitoring of renal function and electrolyte balance.
                </p>
              </div>

              {/* Resolution Action */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                  <MessageSquare size={16} color="var(--gray-400)" />
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>Action Taken</p>
                </div>
                {selectedAlert.status === 'resolved' ? (
                  <div style={{ padding: '1rem', background: 'var(--green-light)', borderRadius: 12, border: '1px solid var(--green)' }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: 'var(--green)' }}>{selectedAlert.resolutionType}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--gray-600)', fontStyle: 'italic' }}>"{selectedAlert.note}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <Clock size={12} color="var(--gray-400)" />
                      <span style={{ fontSize: '0.65rem', color: 'var(--gray-400)' }}>Resolved at {new Date(selectedAlert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <textarea 
                    placeholder="Enter resolution notes for the physician..."
                    style={{ width: '100%', minHeight: 100, background: 'var(--dash-bg)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none' }}
                  />
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '0.75rem' }}>
              {selectedAlert.status === 'unreviewed' ? (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIsResolutionModalOpen(true)}
                    style={{ flex: 1.5, background: 'var(--green)', color: 'white', border: 'none', borderRadius: 100, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <CheckCircle size={18} /> Mark Resolved
                  </motion.button>
                  <motion.button 
                    whileHover={{ background: 'var(--dash-bg)' }} whileTap={{ scale: 0.98 }}
                    style={{ flex: 1, background: 'white', color: 'var(--navy)', border: '1px solid var(--dash-border)', borderRadius: 100, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Escalate
                  </motion.button>
                </>
              ) : (
                <motion.button 
                  whileHover={{ background: 'var(--dash-bg)' }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAlert(null)}
                  style={{ width: '100%', background: 'white', color: 'var(--navy)', border: '1px solid var(--dash-border)', borderRadius: 100, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close Detail
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESOLUTION MODAL */}
      <AlertResolutionModal 
        isOpen={isResolutionModalOpen}
        onClose={() => setIsResolutionModalOpen(false)}
        alert={selectedAlert}
        onResolve={handleResolve}
      />

    </div>
  );
}
