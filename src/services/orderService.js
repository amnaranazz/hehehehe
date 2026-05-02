// src/services/orderService.js

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const medicines = [
  'Panadol 500mg',
  'Amoxicillin 250mg',
  'Metformin 500mg',
  'Omeprazole 20mg',
  'Atorvastatin 10mg',
  'Lisinopril 5mg',
  'Aspirin 75mg',
  'Ciprofloxacin 500mg',
];

const patients = [
  'Ahmed Khan',
  'Sara Raza',
  'Bilal Hussain',
  'Fatima Ali',
  'Usman Sheikh',
  'Nadia Malik',
  'Tariq Jameel',
  'Hina Baig',
  'Asad Mirza',
  'Zara Siddiqui',
];

const statuses = ['pending', 'processing', 'completed', 'cancelled'];
const statusWeights = [0.3, 0.2, 0.4, 0.1];

function weightedRandom(arr, weights) {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return arr[i];
  }
  return arr[arr.length - 1];
}

function generateOrders(n) {
  return Array.from({ length: n }, (_, i) => {
    const med1 = medicines[Math.floor(Math.random() * medicines.length)];
    const med2 = Math.random() > 0.5 ? medicines[Math.floor(Math.random() * medicines.length)] : null;
    const qty = Math.floor(Math.random() * 3) + 1;
    const price = (Math.random() * 2000 + 200) * qty;
    const hoursAgo = Math.floor(Math.random() * 8);
    const minsAgo = Math.floor(Math.random() * 59);
    const timeStr = hoursAgo === 0 ? `${minsAgo}m ago` : `${hoursAgo}h ${minsAgo}m ago`;

    return {
      id: `RX-${String(1000 + i).padStart(4, '0')}`,
      patient: patients[i % patients.length],
      medicines: med2 ? `${med1}, ${med2}` : med1,
      amount: Math.round(price),
      status: weightedRandom(statuses, statusWeights),
      time: timeStr,
    };
  });
}

export const orderService = {
  async getRecentOrders(limit = 10) {
    await delay(700);
    return generateOrders(limit);
  },
};

export default orderService;
