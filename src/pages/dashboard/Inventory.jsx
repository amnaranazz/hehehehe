import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Search, Plus, AlertTriangle, TrendingUp, 
  FileDown, SlidersHorizontal, Edit2, Eye, Trash2, 
  PackageX, ChevronUp, ChevronDown, Clock, ShieldAlert
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import AddMedicineModal from '../../components/modals/AddMedicineModal';
import DeleteMedicineModal from '../../components/modals/DeleteMedicineModal';
import BulkImportModal from '../../components/modals/BulkImportModal';

/**
 * Implements EUC-10 Manage Inventory per MedSenseAI SRS Section 3.2.10.
 * Core inventory management page for pharmacists.
 */

const MOCK_MEDICINES = [
  { id: 'MED-1001', name: 'Panadol', genericName: 'Paracetamol', category: 'Analgesics', brand: 'GSK', unitPrice: 150, stockQty: 1240, minThreshold: 200, expiryDate: '2027-05-15', requiresRx: false },
  { id: 'MED-1002', name: 'Amoxil', genericName: 'Amoxicillin', category: 'Antibiotics', brand: 'GSK', unitPrice: 450, stockQty: 85, minThreshold: 100, expiryDate: '2026-11-20', requiresRx: true },
  { id: 'MED-1003', name: 'Augmentin', genericName: 'Co-Amoxiclav', category: 'Antibiotics', brand: 'GSK', unitPrice: 850, stockQty: 42, minThreshold: 50, expiryDate: '2026-08-10', requiresRx: true },
  { id: 'MED-1004', name: 'Glucophage', genericName: 'Metformin', category: 'Antidiabetics', brand: 'Merck', unitPrice: 320, stockQty: 680, minThreshold: 150, expiryDate: '2027-02-28', requiresRx: true },
  { id: 'MED-1005', name: 'Loprin', genericName: 'Aspirin', category: 'Cardiovascular', brand: 'Atco', unitPrice: 120, stockQty: 0, minThreshold: 50, expiryDate: '2026-06-30', requiresRx: false },
  { id: 'MED-1006', name: 'Softin', genericName: 'Loratadine', category: 'Antihistamines', brand: 'Hilton', unitPrice: 280, stockQty: 55, minThreshold: 40, expiryDate: '2025-12-15', requiresRx: false },
  { id: 'MED-1007', name: 'Surbex-Z', genericName: 'Multivitamins', category: 'Vitamins and Supplements', brand: 'Abbott', unitPrice: 950, stockQty: 18, minThreshold: 25, expiryDate: '2026-04-12', requiresRx: false },
  { id: 'MED-1008', name: 'Fucidin', genericName: 'Fusidic Acid', category: 'Topical', brand: 'LEO', unitPrice: 580, stockQty: 120, minThreshold: 30, expiryDate: '2027-01-05', requiresRx: false },
];

export default function Inventory() {
  const { showToast } = useToast();
  const [medicines, setMedicines] = useState(MOCK_MEDICINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'low', label: 'Low Stock' },
    { id: 'expiring', label: 'Expiring Soon' },
    { id: 'out', label: 'Out of Stock' },
  ];

  // Sorting & Filtering Logic
  const filteredAndSortedMedicines = useMemo(() => {
    let result = medicines;

    // Filter by tab
    if (activeTab === 'low') {
      result = result.filter(m => m.stockQty > 0 && m.stockQty <= m.minThreshold);
    } else if (activeTab === 'expiring') {
      const soon = new Date();
      soon.setMonth(soon.getMonth() + 6);
      result = result.filter(m => new Date(m.expiryDate) <= soon);
    } else if (activeTab === 'out') {
      result = result.filter(m => m.stockQty === 0);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.genericName.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [medicines, activeTab, searchQuery, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSaveMedicine = (newMed) => {
    if (selectedMedicine) {
      // Update
      setMedicines(prev => prev.map(m => m.id === newMed.id ? newMed : m));
    } else {
      // Add
      setMedicines(prev => [newMed, ...prev]);
    }
    setSelectedMedicine(null);
  };

  const handleDeleteMedicine = (id) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    setIsDeleteModalOpen(false);
    setSelectedMedicine(null);
    showToast({ type: 'success', message: 'Medicine removed from inventory' });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Generic', 'Category', 'Brand', 'Price', 'Stock', 'Threshold', 'Expiry', 'Requires Rx'];
    const rows = filteredAndSortedMedicines.map(m => [
      m.id, m.name, m.genericName, m.category, m.brand, m.unitPrice, m.stockQty, m.minThreshold, m.expiryDate, m.requiresRx
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `medsense-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: 'success', message: 'Inventory exported successfully' });
  };

  const getStockStatusColor = (qty, threshold) => {
    if (qty === 0) return 'var(--red)';
    if (qty <= threshold) return 'var(--red)';
    if (qty <= threshold * 1.5) return 'var(--amber)';
    return 'var(--green)';
  };

  return (
    <div style={{ padding: '1.5rem', width: '100%', maxWidth: 1600, margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--navy)', marginBottom: 2 }}>
            Inventory Management
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', fontWeight: 300, margin: 0 }}>
            Manage your stock, set low-stock alerts, and track expirations.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.button
            whileHover={{ y: -2, boxShadow: 'var(--dash-shadow-hover)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setSelectedMedicine(null); setIsAddModalOpen(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.25rem', borderRadius: 100, background: 'var(--navy)', color: 'white', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: 'none' }}
          >
            <Plus size={16} /> Add Medicine
          </motion.button>
          <motion.button
            whileHover={{ y: -2, background: 'var(--dash-bg)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsImportModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.25rem', borderRadius: 100, border: '1px solid var(--dash-border)', background: 'white', color: 'var(--navy)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={16} /> Import CSV
          </motion.button>
          <motion.button
            whileHover={{ y: -2, background: 'var(--dash-bg)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.25rem', borderRadius: 100, border: '1px solid var(--dash-border)', background: 'white', color: 'var(--navy)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <FileDown size={16} /> Export CSV
          </motion.button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Products', value: medicines.length.toLocaleString(), icon: Package, color: 'var(--blue)' },
          { label: 'Low Stock Items', value: medicines.filter(m => m.stockQty > 0 && m.stockQty <= m.minThreshold).length, icon: AlertTriangle, color: 'var(--amber)' },
          { label: 'Out of Stock', value: medicines.filter(m => m.stockQty === 0).length, icon: PackageX, color: 'var(--red)' },
          { label: 'Total Value', value: `PKR ${(medicines.reduce((acc, m) => acc + (m.stockQty * m.unitPrice), 0)).toLocaleString()}`, icon: TrendingUp, color: 'var(--green)' },
        ].map((metric, i) => (
          <motion.div key={i} whileHover={{ y: -3 }} style={{ background: 'white', borderRadius: 'var(--dash-radius)', padding: '1.25rem', border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${metric.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <metric.icon size={18} color={metric.color} />
              </div>
            </div>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--navy)', margin: '0 0 0.25rem 0' }}>{metric.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* FILTERS & TABS BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.35rem', background:'white', borderRadius:100, padding:4, border:'1px solid var(--dash-border)', boxShadow:'var(--dash-shadow)' }}>
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ position:'relative', padding:'0.45rem 1.1rem', borderRadius:100, border:'none', background:'transparent', fontFamily:'var(--font-body)', fontSize:'0.82rem', fontWeight: activeTab===tab.id ? 600 : 500, color: activeTab===tab.id ? 'white' : 'var(--gray-600)', cursor:'pointer' }}
            >
              {activeTab===tab.id && (
                <motion.div layoutId="inv-tab-pill" style={{ position:'absolute', inset:0, borderRadius:100, background:'var(--navy)', zIndex:0 }} transition={{ type:'spring', stiffness:500, damping:35 }} />
              )}
              <span style={{ position:'relative', zIndex:1 }}>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: 400 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by name, brand, or generic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 100, border: '1px solid var(--dash-border)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--navy)', outline: 'none', background: 'white' }}
            />
          </div>
          <motion.button whileHover={{ background: 'var(--dash-bg)' }} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--dash-border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <SlidersHorizontal size={16} color="var(--navy)" />
          </motion.button>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div style={{ background: 'white', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--dash-bg)', borderBottom: '1px solid var(--dash-border)' }}>
                <th onClick={() => handleSort('name')} style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Medicine Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>) : null}
                  </div>
                </th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Brand</th>
                <th onClick={() => handleSort('unitPrice')} style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Unit Price {sortConfig.key === 'unitPrice' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>) : null}
                  </div>
                </th>
                <th onClick={() => handleSort('stockQty')} style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Stock Qty {sortConfig.key === 'stockQty' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>) : null}
                  </div>
                </th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Min Thr.</th>
                <th onClick={() => handleSort('expiryDate')} style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Expiry {sortConfig.key === 'expiryDate' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>) : null}
                  </div>
                </th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Rx</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedMedicines.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <PackageX size={48} color="var(--gray-200)" strokeWidth={1} />
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gray-400)', fontSize: '1.1rem', margin: 0 }}>No medicines found</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', fontWeight: 300, marginTop: 4 }}>Try adjusting your search or filters.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedMedicines.map((med, i) => (
                  <motion.tr 
                    key={med.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ borderBottom: '1px solid var(--dash-border)', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dash-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)' }}>{med.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 400 }}>{med.genericName}</p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: 'var(--blue-light)', color: 'var(--blue)' }}>
                        {med.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 500 }}>{med.brand}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'monospace' }}>
                      PKR {med.unitPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: getStockStatusColor(med.stockQty, med.minThreshold) }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>{med.stockQty}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--gray-400)', fontWeight: 500 }}>{med.minThreshold}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: new Date(med.expiryDate) < new Date() ? 'var(--red)' : 'var(--gray-600)' }}>
                        <Clock size={12} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{med.expiryDate}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {med.requiresRx ? (
                        <ShieldAlert size={16} color="var(--blue)" title="Requires Prescription" />
                      ) : (
                        <span style={{ color: 'var(--gray-200)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <motion.button 
                          whileHover={{ scale: 1.1, color: 'var(--blue)' }} whileTap={{ scale: 0.9 }}
                          onClick={() => { setSelectedMedicine(med); setIsAddModalOpen(true); }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 4 }}
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, color: 'var(--navy)' }} whileTap={{ scale: 0.9 }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 4 }}
                        >
                          <Eye size={17} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, color: 'var(--red)' }} whileTap={{ scale: 0.9 }}
                          onClick={() => { setSelectedMedicine(med); setIsDeleteModalOpen(true); }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 4 }}
                        >
                          <Trash2 size={17} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <AddMedicineModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        medicine={selectedMedicine}
        onSave={handleSaveMedicine}
      />
      
      <DeleteMedicineModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        medicine={selectedMedicine}
        onDelete={handleDeleteMedicine}
      />

      <BulkImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(data) => {
          // Handle imported data if needed
          showToast({ type: 'success', message: 'Import logic ready' });
        }}
      />

    </div>
  );
}
