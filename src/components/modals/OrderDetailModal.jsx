import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, Clock, Printer, CheckCircle, Package, Truck, Home } from 'lucide-react';
import { formatDate, formatTimeAgo } from '../../utils/formatters';

const STATUS_STEPS = [
  { id: 'New', icon: Clock, label: 'Placed' },
  { id: 'Processing', icon: Package, label: 'Processing' },
  { id: 'Ready', icon: CheckCircle, label: 'Ready' },
  { id: 'Dispatched', icon: Truck, label: 'Dispatched' },
  { id: 'Delivered', icon: Home, label: 'Delivered' }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Paid':
    case 'Delivered':
      return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }; 
    case 'Pending':
    case 'Processing':
    case 'Ready':
    case 'Dispatched':
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
    case 'Failed':
    case 'Cancelled':
      return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
    case 'Refunded':
      return { bg: 'var(--dash-bg)', color: 'var(--gray-600)' };
    default:
      return { bg: 'var(--dash-bg)', color: 'var(--navy)' };
  }
};

export default function OrderDetailModal({ isOpen, onClose, order }) {
  if (!order) return null;

  // Determine current step index
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === order.deliveryStatus);
  const isCancelled = order.deliveryStatus === 'Cancelled';

  const subtotal = order.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  const total = subtotal + order.deliveryFee - order.discount;

  const paymentStatusStyle = getStatusColor(order.paymentStatus);
  const orderStatusStyle = getStatusColor(order.deliveryStatus);

  const handlePrint = () => {
    window.print();
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
            className="no-print"
            style={{ position: 'absolute', inset: 0, background: 'rgba(13, 17, 23, 0.4)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'relative', width: '100%', maxWidth: 900,
              background: 'var(--dash-card)', borderRadius: 'var(--dash-radius)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
              maxHeight: '90vh'
            }}
            className="print-container"
          >
            {/* Header */}
            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--dash-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--navy)', margin: 0 }}>
                  Order {order.id}
                </h2>
                <span style={{
                  padding: '4px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600,
                  background: isCancelled ? 'rgba(239, 68, 68, 0.15)' : orderStatusStyle.bg,
                  color: isCancelled ? '#ef4444' : orderStatusStyle.color
                }}>
                  {order.deliveryStatus}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 100,
                    border: '1px solid var(--dash-border)', background: 'white', color: 'var(--navy)',
                    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  <Printer size={16} /> Print Slip
                </motion.button>
                <motion.button
                  whileHover={{ background: 'var(--dash-bg)', scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-600)'
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Print Only Header elements */}
            <div className="print-only" style={{ display: 'none', padding: '2rem 1.5rem 0', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: 0 }}>MedSense Pharmacy</h1>
              <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0' }}>Order Receipt - {formatDate(order.date)} - {order.id}</p>
              <hr style={{ border: 'none', borderTop: '1px solid var(--dash-border)', margin: '1rem 0' }} />
            </div>

            <div className="print-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', gap: '2rem', flexDirection: 'row' }}>
              {/* Left Column: Details */}
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Patient & Delivery Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ background: 'var(--dash-bg)', padding: '1.25rem', borderRadius: 16 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '0.5rem', margin: 0 }}>Patient Info</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                      <div className="no-print" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                        {order.patient.initials}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--navy)' }}>{order.patient.name}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-600)' }}>{order.patient.phone}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-600)' }}>{order.patient.email}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--dash-bg)', padding: '1.25rem', borderRadius: 16 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '0.5rem', margin: 0 }}>Delivery Address</p>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                      <MapPin className="no-print" size={18} color="var(--blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--navy)', lineHeight: 1.4 }}>
                        {order.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '1rem' }}>Order Items</h3>
                  <div style={{ border: '1px solid var(--dash-border)', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--dash-bg)' }}>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Item Name</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Qty</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Price</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i} style={{ borderTop: '1px solid var(--dash-border)' }}>
                            <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--navy)' }}>{item.name}</td>
                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>x{item.qty}</td>
                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>Rs. {item.unitPrice}</td>
                            <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)', textAlign: 'right' }}>Rs. {item.qty * item.unitPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <div style={{ width: '250px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                        <span>Subtotal</span>
                        <span>Rs. {subtotal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                        <span>Delivery Fee</span>
                        <span>Rs. {order.deliveryFee}</span>
                      </div>
                      {order.discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#10b981' }}>
                          <span>Discount</span>
                          <span>- Rs. {order.discount}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--dash-border)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)' }}>
                        <span>Total</span>
                        <span>Rs. {total}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Timeline & Payment */}
              <div className="no-print" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '1px solid var(--dash-border)', paddingLeft: '2rem' }}>
                
                {/* Payment Info */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '1rem' }}>Payment Info</h3>
                  <div style={{ border: '1px solid var(--dash-border)', borderRadius: 16, padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <CreditCard size={18} color="var(--gray-600)" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--navy)' }}>{order.paymentMethod}</span>
                    </div>
                    <div style={{ display: 'inline-flex', padding: '4px 8px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, background: paymentStatusStyle.bg, color: paymentStatusStyle.color }}>
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Timeline Stepper */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '1rem' }}>Order Timeline</h3>
                  <div style={{ position: 'relative' }}>
                    {isCancelled ? (
                       <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                         <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                           <X size={16} />
                         </div>
                         <div style={{ paddingTop: 4 }}>
                           <p style={{ margin: 0, fontWeight: 700, color: '#ef4444', fontSize: '0.95rem' }}>Order Cancelled</p>
                           <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 2 }}>This order has been cancelled.</p>
                         </div>
                       </div>
                    ) : (
                      STATUS_STEPS.map((step, index) => {
                        const isCompleted = currentStepIndex >= index;
                        const isCurrent = currentStepIndex === index;
                        return (
                          <div key={step.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: index === STATUS_STEPS.length - 1 ? 0 : '1.5rem', position: 'relative' }}>
                            {/* Connecting Line */}
                            {index !== STATUS_STEPS.length - 1 && (
                              <div style={{ position: 'absolute', left: 15, top: 32, bottom: -24, width: 2, background: isCompleted ? 'var(--blue)' : 'var(--dash-border)', zIndex: 0 }} />
                            )}
                            
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: isCurrent ? 'var(--blue)' : (isCompleted ? 'var(--blue)' : 'var(--dash-bg)'), color: isCompleted || isCurrent ? 'white' : 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none' }}>
                              <step.icon size={16} />
                            </div>
                            
                            <div style={{ paddingTop: 6 }}>
                              <p style={{ margin: 0, fontWeight: isCurrent ? 700 : 500, color: isCompleted || isCurrent ? 'var(--navy)' : 'var(--gray-400)', fontSize: '0.95rem' }}>
                                {step.label}
                              </p>
                              {index === 0 && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 2 }}>{formatTimeAgo(order.date)}</p>}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Print Footer */}
            <div className="print-only" style={{ display: 'none', padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid var(--dash-border)', marginTop: '2rem' }}>
              <p style={{ fontWeight: 700, fontSize: '1.2rem', margin: '0 0 0.5rem' }}>Thank you for your order!</p>
              <p style={{ color: 'var(--gray-600)', margin: 0 }}>MedSense Pharmacy • +92 300 1234567 • info@medsense.ai</p>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
