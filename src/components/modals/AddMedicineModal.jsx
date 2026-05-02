import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pill, DollarSign, Package, Calendar, AlertCircle, Info, Save } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

/**
 * Implements EUC-10 Manage Inventory per MedSenseAI SRS Section 3.2.10.
 * Modal for adding and editing medicine records in the inventory.
 */
export default function AddMedicineModal({ isOpen, onClose, medicine = null, onSave }) {
  const { showToast } = useToast();
  
  const initialFormState = {
    name: '',
    genericName: '',
    category: '',
    brand: '',
    unitPrice: '',
    stockQty: '',
    minThreshold: '',
    expiryDate: '',
    requiresRx: false,
    description: '',
    image: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (medicine) {
      setFormData({
        ...medicine,
        unitPrice: medicine.unitPrice.toString(),
        stockQty: medicine.stockQty.toString(),
        minThreshold: medicine.minThreshold.toString()
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [medicine, isOpen]);

  const categories = [
    'Antibiotics', 'Analgesics', 'Antidiabetics', 'Cardiovascular', 
    'Antihistamines', 'Vitamins and Supplements', 'Topical', 'Other'
  ];

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
      case 'genericName':
      case 'category':
        if (!value) error = 'This field is required';
        break;
      case 'unitPrice':
        if (!value) error = 'Required';
        else if (parseFloat(value) <= 0) error = 'Must be > 0';
        break;
      case 'stockQty':
      case 'minThreshold':
        if (value === '') error = 'Required';
        else if (!Number.isInteger(parseFloat(value)) || parseFloat(value) < 0) error = 'Must be ≥ 0';
        break;
      case 'expiryDate':
        if (!value) error = 'Required';
        else if (new Date(value) <= new Date()) error = 'Must be future date';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast({ type: 'error', message: 'Please fix the errors above before saving' });
      return;
    }

    setIsSubmitting(true);
    // Simulate async save
    setTimeout(() => {
      onSave({
        ...formData,
        id: medicine?.id || `MED-${Math.floor(Math.random() * 10000)}`,
        unitPrice: parseFloat(formData.unitPrice),
        stockQty: parseInt(formData.stockQty),
        minThreshold: parseInt(formData.minThreshold)
      });
      showToast({ type: 'success', message: 'Medicine saved successfully' });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const inputStyle = (name) => ({
    width: '100%',
    padding: '0.65rem 1rem',
    borderRadius: '10px',
    border: `1.5px solid ${errors[name] ? 'var(--red)' : 'var(--dash-border)'}`,
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.2s',
    background: errors[name] ? '#fff1f0' : 'white'
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--gray-600)',
    marginBottom: '0.4rem',
    fontFamily: 'var(--font-display)'
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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'relative', width: '100%', maxWidth: 700,
              background: 'var(--dash-card)', borderRadius: 'var(--dash-radius)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
              maxHeight: '90vh', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--dash-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pill size={20} color="var(--blue)" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--navy)', margin: 0 }}>
                  {medicine ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
              </div>
              <motion.button
                whileHover={{ background: 'var(--dash-bg)', scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-600)'
                }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                
                {/* Medicine Name */}
                <div style={{ gridColumn: 'span 1' }}>
                  <label style={labelStyle}>Medicine Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Panadol"
                    style={inputStyle('name')}
                  />
                  {errors.name && <p style={{ color: 'var(--red)', fontSize: '0.7rem', marginTop: 4, fontWeight: 500 }}>{errors.name}</p>}
                </div>

                {/* Generic Name */}
                <div style={{ gridColumn: 'span 1' }}>
                  <label style={labelStyle}>Generic Name *</label>
                  <input
                    name="genericName"
                    value={formData.genericName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Paracetamol"
                    style={inputStyle('genericName')}
                  />
                  {errors.genericName && <p style={{ color: 'var(--red)', fontSize: '0.7rem', marginTop: 4, fontWeight: 500 }}>{errors.genericName}</p>}
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle('category')}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p style={{ color: 'var(--red)', fontSize: '0.7rem', marginTop: 4, fontWeight: 500 }}>{errors.category}</p>}
                </div>

                {/* Brand */}
                <div>
                  <label style={labelStyle}>Brand</label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. GSK"
                    style={inputStyle('brand')}
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label style={labelStyle}>Unit Price (PKR) *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'var(--gray-400)', fontWeight: 600 }}>PKR</span>
                    <input
                      name="unitPrice"
                      type="number"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0.00"
                      style={{ ...inputStyle('unitPrice'), paddingLeft: '3.25rem' }}
                    />
                  </div>
                  {errors.unitPrice && <p style={{ color: 'var(--red)', fontSize: '0.7rem', marginTop: 4, fontWeight: 500 }}>{errors.unitPrice}</p>}
                </div>

                {/* Stock Quantity */}
                <div>
                  <label style={labelStyle}>Stock Quantity *</label>
                  <input
                    name="stockQty"
                    type="number"
                    value={formData.stockQty}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0"
                    style={inputStyle('stockQty')}
                  />
                  {errors.stockQty && <p style={{ color: 'var(--red)', fontSize: '0.7rem', marginTop: 4, fontWeight: 500 }}>{errors.stockQty}</p>}
                </div>

                {/* Min Threshold */}
                <div>
                  <label style={labelStyle}>Min Threshold *</label>
                  <input
                    name="minThreshold"
                    type="number"
                    value={formData.minThreshold}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="5"
                    style={inputStyle('minThreshold')}
                  />
                  {errors.minThreshold && <p style={{ color: 'var(--red)', fontSize: '0.7rem', marginTop: 4, fontWeight: 500 }}>{errors.minThreshold}</p>}
                </div>

                {/* Expiry Date */}
                <div>
                  <label style={labelStyle}>Expiry Date *</label>
                  <input
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle('expiryDate')}
                  />
                  {errors.expiryDate && <p style={{ color: 'var(--red)', fontSize: '0.7rem', marginTop: 4, fontWeight: 500 }}>{errors.expiryDate}</p>}
                </div>

                {/* Requires Rx Toggle */}
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--dash-bg)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertCircle size={18} color="var(--blue)" />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>Requires Prescription</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--gray-400)' }}>Enable if this medicine requires pharmacist review</p>
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="requiresRx"
                      checked={formData.requiresRx}
                      onChange={handleChange}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: 24, background: formData.requiresRx ? 'var(--blue)' : 'var(--gray-300)',
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute', left: formData.requiresRx ? 22 : 4, top: 4, width: 16, height: 16,
                        borderRadius: '50%', background: 'white', transition: '0.3s'
                      }} />
                    </span>
                  </label>
                </div>

                {/* Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter medicine details..."
                    style={{ ...inputStyle('description'), minHeight: 80, resize: 'vertical' }}
                  />
                </div>

                {/* Image Upload Placeholder */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Product Image</label>
                  <div style={{ border: '1.5px dashed var(--dash-border)', borderRadius: 12, padding: '1.5rem', textAlign: 'center', background: 'var(--dash-bg)', cursor: 'pointer' }}>
                    <Info size={24} color="var(--gray-400)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 500 }}>Click to upload image or drag & drop</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: 'var(--gray-400)' }}>PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <motion.button
                whileHover={{ background: 'var(--dash-bg)' }} whileTap={{ scale: 0.97 }}
                onClick={onClose}
                type="button"
                style={{ padding: '0.6rem 1.25rem', borderRadius: 100, border: '1px solid var(--dash-border)', background: 'white', color: 'var(--gray-600)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }} whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '0.6rem 1.5rem', borderRadius: 100, border: 'none', background: 'var(--blue)', color: 'white',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Medicine'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
