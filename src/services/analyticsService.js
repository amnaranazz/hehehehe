// src/services/analyticsService.js

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const generateSparkData = (base, variance) =>
  Array.from({ length: 7 }, () => ({
    v: Math.max(0, base + (Math.random() - 0.5) * variance * 2),
  }));

const generateSalesData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return Array.from({ length: 28 }, (_, i) => ({
    day: days[i % 7],
    revenue: 8000 + Math.random() * 12000,
    prescriptions: 20 + Math.random() * 40,
    otc: 3000 + Math.random() * 6000,
  }));
};

export const analyticsService = {
  async getDashboardData() {
    await delay(600);
    return {
      kpi: {
        todayOrders: 47,
        monthlyRevenue: 284000,
        activeAlerts: 3,
        pendingRx: 12,
        todayReceived: 532921,
      },
      salesData: generateSalesData(),
      gaugePercent: 73,
      alerts: [
        {
          id: 1,
          patientName: 'Ahmed Khan',
          medicines: ['Warfarin', 'Aspirin'],
          severity: 'critical',
          timeAgo: '2m ago',
        },
        {
          id: 2,
          patientName: 'Sara Raza',
          medicines: ['Metformin', 'Ibuprofen'],
          severity: 'warning',
          timeAgo: '15m ago',
        },
        {
          id: 3,
          patientName: 'Bilal Hussain',
          medicines: ['Lisinopril', 'Potassium'],
          severity: 'critical',
          timeAgo: '1h ago',
        },
        {
          id: 4,
          patientName: 'Fatima Ali',
          medicines: ['Ciprofloxacin', 'Antacid'],
          severity: 'info',
          timeAgo: '2h ago',
        },
        {
          id: 5,
          patientName: 'Usman Sheikh',
          medicines: ['Atorvastatin', 'Erythromycin'],
          severity: 'warning',
          timeAgo: '3h ago',
        },
      ],
      kpiSparklines: {
        todayOrders: generateSparkData(40, 15),
        monthlyRevenue: generateSparkData(250000, 60000),
        activeAlerts: generateSparkData(5, 3),
        pendingRx: generateSparkData(10, 5),
      },
    };
  },
};

export default analyticsService;
