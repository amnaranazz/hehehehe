import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, User, Calendar, Pill, FileText } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ImageViewer from '../common/ImageViewer';
import ConfidenceBar from '../common/ConfidenceBar';
import RichTextNote from '../common/RichTextNote';
import StatusBadge from '../common/StatusBadge';
import { fadeUp } from '../../utils/animations';
import { useToast } from '../../hooks/useToast';

export default function PrescriptionReviewModal({ isOpen, onClose, prescription, onUpdate }) {
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  if (!prescription) return null;

  const handleAction = async (action) => {
    setIsProcessing(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    setIsProcessing(false);
    
    if (action === 'approve') {
      showToast({ type: 'success', message: 'Prescription approved successfully' });
      onUpdate(prescription.id, 'approved');
    } else if (action === 'reject') {
      if (!note) {
        showToast({ type: 'error', message: 'Please provide a note for rejection' });
        return;
      }
      showToast({ type: 'error', message: 'Prescription rejected' });
      onUpdate(prescription.id, 'rejected');
    } else if (action === 'flag') {
      showToast({ type: 'warning', message: 'Prescription flagged for review' });
      onUpdate(prescription.id, 'flagged');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={1100}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', height: '100%', minHeight: 600 }}>
        
        {/* LEFT: IMAGE VIEWER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
              Original Document
            </h3>
            <StatusBadge status={prescription.status} />
          </div>
          <div style={{ flex: 1, borderRadius: 'var(--dash-radius)', overflow: 'hidden' }}>
            <ImageViewer 
              src={prescription.imageUrl || "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=800&auto=format&fit=crop"} 
              alt="Prescription" 
              isProcessing={isProcessing} 
            />
          </div>
        </div>

        {/* RIGHT: DATA EXTRACTION & ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', paddingRight: '0.5rem' }} className="no-scrollbar">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-0.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
              Extracted Data
            </h3>
            <ConfidenceBar value={prescription.confidence || 92} />
          </div>

          {/* Patient Details Card */}
          <div className="dash-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--dash-border)', paddingBottom: '0.5rem' }}>
              <User size={16} color="var(--gray-400)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{prescription.patientName}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginLeft: 'auto' }}>ID: {prescription.patientId}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="var(--gray-400)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>Prescribed on: <strong style={{ color: 'var(--navy)' }}>{prescription.date}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="var(--gray-400)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>Doctor: <strong style={{ color: 'var(--navy)' }}>{prescription.doctorName}</strong></span>
            </div>
          </div>

          {/* Medications Extracted */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Prescribed Medications
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {prescription.medicines?.map((med, i) => (
                <div key={i} style={{ 
                  background: 'white', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-sm)', 
                  padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pill size={16} color="var(--blue)" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', margin: '0 0 2px 0' }}>{med.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', margin: 0 }}>{med.dosage} · {med.frequency}</p>
                    </div>
                  </div>
                  <ConfidenceBar value={med.confidence || 95} compact />
                </div>
              ))}
            </div>
          </div>

          {/* Interactions / Warnings (Dark Accent Card) */}
          {prescription.interactions && prescription.interactions.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ 
              background: 'var(--dash-card-dark)', borderRadius: 'var(--dash-radius)', padding: '1.25rem', color: 'white' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={18} color="var(--amber)" />
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', margin: 0 }}>AI Risk Analysis</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                {prescription.interactions.map((warn, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{warn}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Pharmacist Note */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <RichTextNote 
              label="Pharmacist Notes" 
              placeholder="Add clinical notes, reason for rejection, or instructions..." 
              value={note} 
              onChange={setNote} 
            />
          </div>

          {/* Action Panel */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button 
              variant="outline" 
              style={{ flex: 1, borderColor: 'var(--red)', color: 'var(--red)' }}
              icon={XCircle}
              onClick={() => handleAction('reject')}
              loading={isProcessing}
            >
              Reject
            </Button>
            <Button 
              variant="secondary" 
              style={{ flex: 1, background: 'var(--rx-flagged-bg)', color: 'var(--rx-flagged)' }}
              icon={AlertTriangle}
              onClick={() => handleAction('flag')}
              loading={isProcessing}
            >
              Flag
            </Button>
            <Button 
              variant="primary" 
              style={{ flex: 2, background: 'var(--green)', color: 'white', borderColor: 'var(--green)' }}
              icon={CheckCircle}
              onClick={() => handleAction('approve')}
              loading={isProcessing}
            >
              Approve Rx
            </Button>
          </div>

        </div>
      </div>
    </Modal>
  );
}
