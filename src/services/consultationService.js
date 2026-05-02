// src/services/consultationService.js

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const pharmacyResponses = {
  'low stock': [
    'You currently have 5 items below minimum stock levels. Critical: Insulin Pen (2 units), Amoxicillin 500mg (3 units). I recommend placing orders immediately.',
    'Low stock alert: 5 medications are running critically low. Priority reorder needed for Insulin Pen and Amoxicillin 500mg.',
  ],
  'today sales': [
    "Today's sales total ₨5,32,921 — up 12% from yesterday. Peak hour was 11am–1pm. Top seller: Panadol 500mg (234 units).",
    "You've processed ₨5,32,921 in sales today across 47 orders. Revenue is tracking 12% above yesterday's performance.",
  ],
  'top meds': [
    'This month\'s top sellers: 1. Panadol (1,240u) 2. Amoxicillin (890u) 3. Metformin (720u) 4. Omeprazole (580u) 5. Atorvastatin (410u).',
    'Leading medications this month by volume: Panadol 500mg leads with 1,240 units sold, followed by Amoxicillin at 890 units.',
  ],
};

const defaultResponses = [
  'Based on your pharmacy data, I can help with inventory management, sales analysis, drug interaction checks, and prescription workflows. What would you like to know?',
  "I'm analyzing your pharmacy data. For detailed insights, try asking about 'low stock', 'today sales', or 'top meds'.",
  'I can help you optimize your pharmacy operations. Ask me about stock levels, revenue trends, or patient prescriptions.',
  'Your pharmacy is performing well today! Revenue is up 12%. Would you like a detailed breakdown of any metric?',
];

export const consultationService = {
  async askAI(message) {
    await delay(1200 + Math.random() * 800);

    const lower = message.toLowerCase();
    for (const [key, responses] of Object.entries(pharmacyResponses)) {
      if (lower.includes(key)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  },
};

export default consultationService;
