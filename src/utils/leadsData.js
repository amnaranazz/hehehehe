// src/utils/leadsData.js

const mockChatbots = [
  { date: "2026-04-28T14:30:00", text: "Asked about availability of Panadol", outcome: "No action" },
  { date: "2026-04-26T09:15:00", text: "Placed order via quick reorder", outcome: "Placed order" },
  { date: "2026-04-20T11:45:00", text: "Inquired about delivery times", outcome: "Resolved" },
  { date: "2026-04-10T16:20:00", text: "Checked price for Insulatard", outcome: "No action" },
  { date: "2026-04-05T10:10:00", text: "Reported missing item in previous order", outcome: "Refunded" },
];

const generateHistory = (count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `ORD-9${Math.floor(Math.random() * 1000)}`,
    date: new Date(Date.now() - (i * 86400000 * Math.random() * 5)).toISOString(),
    items: Math.floor(Math.random() * 5) + 1,
    total: Math.floor(Math.random() * 5000) + 500,
    status: ["Delivered", "Delivered", "Delivered", "Cancelled"][Math.floor(Math.random() * 4)]
  }));
};

const generateMedicines = () => {
  const allMeds = ["Panadol", "Brufen", "ORS", "Augmentin", "Arinac", "Surbex Z", "Thyroxine", "Insulin", "Centrum", "Nexum"];
  const selected = [];
  const count = Math.floor(Math.random() * 5) + 2;
  for(let i=0; i<count; i++) {
    const med = allMeds[Math.floor(Math.random() * allMeds.length)];
    if(!selected.find(m => m.name === med)) {
      selected.push({ name: med, count: Math.floor(Math.random() * 8) + 1 });
    }
  }
  return selected.sort((a,b) => b.count - a.count);
};

export const mockLeads = [
  {
    id: "CUS-1001",
    name: "Ayesha Khan", phone: "0300-1234567", email: "ayesha.k@example.com", initials: "AK", color: "#3b82f6",
    score: 95, trend: "up", delta: 4,
    frequency: "4 orders/month", recency: "2 days ago", spend: 45200, lifetimeOrders: 32, lastOrderDate: new Date(Date.now() - 2*86400000).toISOString(),
    factors: { frequency: 28, recency: 24, value: 24, engagement: 19 },
    history: generateHistory(10),
    medicines: generateMedicines(),
    chats: [mockChatbots[1], mockChatbots[0]]
  },
  {
    id: "CUS-1002",
    name: "Bilal Ahmed", phone: "0321-7654321", email: "bilal.a@example.com", initials: "BA", color: "#8b5cf6",
    score: 88, trend: "up", delta: 2,
    frequency: "3 orders/month", recency: "5 days ago", spend: 28400, lifetimeOrders: 18, lastOrderDate: new Date(Date.now() - 5*86400000).toISOString(),
    factors: { frequency: 26, recency: 21, value: 22, engagement: 19 },
    history: generateHistory(8),
    medicines: generateMedicines(),
    chats: [mockChatbots[2]]
  },
  {
    id: "CUS-1003",
    name: "Zainab Ali", phone: "0333-1122334", email: "zainab.ali@example.com", initials: "ZA", color: "#ec4899",
    score: 82, trend: "down", delta: 1,
    frequency: "3 orders/month", recency: "1 week ago", spend: 115000, lifetimeOrders: 42, lastOrderDate: new Date(Date.now() - 7*86400000).toISOString(),
    factors: { frequency: 25, recency: 18, value: 25, engagement: 14 },
    history: generateHistory(10),
    medicines: generateMedicines(),
    chats: []
  },
  {
    id: "CUS-1004",
    name: "Omer Farooq", phone: "0345-9988776", email: "omer.f@example.com", initials: "OF", color: "#10b981",
    score: 75, trend: "neutral", delta: 0,
    frequency: "2 orders/month", recency: "2 weeks ago", spend: 15600, lifetimeOrders: 12, lastOrderDate: new Date(Date.now() - 14*86400000).toISOString(),
    factors: { frequency: 20, recency: 15, value: 22, engagement: 18 },
    history: generateHistory(6),
    medicines: generateMedicines(),
    chats: [mockChatbots[3], mockChatbots[2]]
  },
  {
    id: "CUS-1005",
    name: "Sara Malik", phone: "0311-2233445", email: "sara.malik@example.com", initials: "SM", color: "#f59e0b",
    score: 68, trend: "up", delta: 5,
    frequency: "1 order/month", recency: "3 weeks ago", spend: 8900, lifetimeOrders: 5, lastOrderDate: new Date(Date.now() - 21*86400000).toISOString(),
    factors: { frequency: 15, recency: 12, value: 18, engagement: 23 },
    history: generateHistory(5),
    medicines: generateMedicines(),
    chats: [mockChatbots[4]]
  },
  {
    id: "CUS-1006",
    name: "Kamran Qureshi", phone: "0301-5566778", email: "kq@example.com", initials: "KQ", color: "#64748b",
    score: 62, trend: "down", delta: 3,
    frequency: "1 order/month", recency: "1 month ago", spend: 32000, lifetimeOrders: 14, lastOrderDate: new Date(Date.now() - 30*86400000).toISOString(),
    factors: { frequency: 12, recency: 10, value: 24, engagement: 16 },
    history: generateHistory(8),
    medicines: generateMedicines(),
    chats: []
  },
  {
    id: "CUS-1007",
    name: "Hassan Raza", phone: "0322-8877665", email: "hassan.r@example.com", initials: "HR", color: "#3b82f6",
    score: 55, trend: "neutral", delta: 0,
    frequency: "0.5 orders/month", recency: "2 months ago", spend: 4500, lifetimeOrders: 3, lastOrderDate: new Date(Date.now() - 60*86400000).toISOString(),
    factors: { frequency: 10, recency: 8, value: 15, engagement: 22 },
    history: generateHistory(3),
    medicines: generateMedicines(),
    chats: [mockChatbots[0]]
  },
  {
    id: "CUS-1008",
    name: "Madiha Tariq", phone: "0334-4455667", email: "madiha.t@example.com", initials: "MT", color: "#ec4899",
    score: 48, trend: "down", delta: 8,
    frequency: "0.2 orders/month", recency: "3 months ago", spend: 12000, lifetimeOrders: 4, lastOrderDate: new Date(Date.now() - 90*86400000).toISOString(),
    factors: { frequency: 8, recency: 5, value: 20, engagement: 15 },
    history: generateHistory(4),
    medicines: generateMedicines(),
    chats: []
  },
  {
    id: "CUS-1009",
    name: "Fahad Mustafa", phone: "0300-9911223", email: "fahad.m@example.com", initials: "FM", color: "#10b981",
    score: 42, trend: "neutral", delta: 0,
    frequency: "0.2 orders/month", recency: "4 months ago", spend: 3500, lifetimeOrders: 2, lastOrderDate: new Date(Date.now() - 120*86400000).toISOString(),
    factors: { frequency: 5, recency: 4, value: 15, engagement: 18 },
    history: generateHistory(2),
    medicines: generateMedicines(),
    chats: [mockChatbots[3]]
  },
  {
    id: "CUS-1010",
    name: "Sana Sheikh", phone: "0312-3344556", email: "sana.s@example.com", initials: "SS", color: "#f59e0b",
    score: 35, trend: "down", delta: 2,
    frequency: "0.1 orders/month", recency: "6 months ago", spend: 1500, lifetimeOrders: 1, lastOrderDate: new Date(Date.now() - 180*86400000).toISOString(),
    factors: { frequency: 3, recency: 2, value: 10, engagement: 20 },
    history: generateHistory(1),
    medicines: generateMedicines(),
    chats: []
  },
  {
    id: "CUS-1011",
    name: "Usman Ghani", phone: "0345-1122334", email: "usman.g@example.com", initials: "UG", color: "#8b5cf6",
    score: 28, trend: "neutral", delta: 0,
    frequency: "Rare", recency: "8 months ago", spend: 800, lifetimeOrders: 1, lastOrderDate: new Date(Date.now() - 240*86400000).toISOString(),
    factors: { frequency: 2, recency: 1, value: 5, engagement: 20 },
    history: generateHistory(1),
    medicines: generateMedicines(),
    chats: []
  },
  {
    id: "CUS-1012",
    name: "Nadia Hussain", phone: "0333-5566778", email: "nadia.h@example.com", initials: "NH", color: "#3b82f6",
    score: 92, trend: "up", delta: 6,
    frequency: "5 orders/month", recency: "1 day ago", spend: 68000, lifetimeOrders: 45, lastOrderDate: new Date(Date.now() - 86400000).toISOString(),
    factors: { frequency: 30, recency: 25, value: 20, engagement: 17 },
    history: generateHistory(10),
    medicines: generateMedicines(),
    chats: [mockChatbots[1], mockChatbots[2]]
  },
  {
    id: "CUS-1013",
    name: "Ali Zafar", phone: "0301-9988776", email: "ali.z@example.com", initials: "AZ", color: "#ec4899",
    score: 85, trend: "up", delta: 3,
    frequency: "3 orders/month", recency: "4 days ago", spend: 34000, lifetimeOrders: 22, lastOrderDate: new Date(Date.now() - 4*86400000).toISOString(),
    factors: { frequency: 24, recency: 22, value: 21, engagement: 18 },
    history: generateHistory(8),
    medicines: generateMedicines(),
    chats: []
  },
  {
    id: "CUS-1014",
    name: "Imran Khan", phone: "0321-1122334", email: "imran.k@example.com", initials: "IK", color: "#10b981",
    score: 78, trend: "down", delta: 2,
    frequency: "2 orders/month", recency: "10 days ago", spend: 45000, lifetimeOrders: 19, lastOrderDate: new Date(Date.now() - 10*86400000).toISOString(),
    factors: { frequency: 20, recency: 16, value: 24, engagement: 18 },
    history: generateHistory(6),
    medicines: generateMedicines(),
    chats: [mockChatbots[4]]
  },
  {
    id: "CUS-1015",
    name: "Fatima Jinnah", phone: "0300-5566778", email: "fatima.j@example.com", initials: "FJ", color: "#f59e0b",
    score: 72, trend: "up", delta: 1,
    frequency: "1.5 orders/month", recency: "2 weeks ago", spend: 18000, lifetimeOrders: 10, lastOrderDate: new Date(Date.now() - 14*86400000).toISOString(),
    factors: { frequency: 18, recency: 14, value: 18, engagement: 22 },
    history: generateHistory(5),
    medicines: generateMedicines(),
    chats: [mockChatbots[0]]
  },
  {
    id: "CUS-1016",
    name: "Junaid Jamshed", phone: "0333-1234567", email: "jj@example.com", initials: "JJ", color: "#64748b",
    score: 65, trend: "neutral", delta: 0,
    frequency: "1 order/month", recency: "3 weeks ago", spend: 22000, lifetimeOrders: 8, lastOrderDate: new Date(Date.now() - 21*86400000).toISOString(),
    factors: { frequency: 14, recency: 12, value: 20, engagement: 19 },
    history: generateHistory(4),
    medicines: generateMedicines(),
    chats: []
  },
  {
    id: "CUS-1017",
    name: "Mahira Khan", phone: "0321-9876543", email: "mahira.k@example.com", initials: "MK", color: "#3b82f6",
    score: 58, trend: "down", delta: 4,
    frequency: "0.5 orders/month", recency: "1.5 months ago", spend: 9500, lifetimeOrders: 5, lastOrderDate: new Date(Date.now() - 45*86400000).toISOString(),
    factors: { frequency: 10, recency: 9, value: 16, engagement: 23 },
    history: generateHistory(3),
    medicines: generateMedicines(),
    chats: [mockChatbots[3]]
  },
  {
    id: "CUS-1018",
    name: "Atif Aslam", phone: "0300-1112223", email: "atif.a@example.com", initials: "AA", color: "#ec4899",
    score: 45, trend: "neutral", delta: 0,
    frequency: "0.2 orders/month", recency: "3 months ago", spend: 14000, lifetimeOrders: 3, lastOrderDate: new Date(Date.now() - 90*86400000).toISOString(),
    factors: { frequency: 8, recency: 6, value: 20, engagement: 11 },
    history: generateHistory(2),
    medicines: generateMedicines(),
    chats: []
  },
  {
    id: "CUS-1019",
    name: "Saba Qamar", phone: "0345-4445556", email: "saba.q@example.com", initials: "SQ", color: "#10b981",
    score: 38, trend: "down", delta: 3,
    frequency: "Rare", recency: "5 months ago", spend: 4000, lifetimeOrders: 2, lastOrderDate: new Date(Date.now() - 150*86400000).toISOString(),
    factors: { frequency: 5, recency: 3, value: 15, engagement: 15 },
    history: generateHistory(1),
    medicines: generateMedicines(),
    chats: [mockChatbots[0]]
  },
  {
    id: "CUS-1020",
    name: "Fawad Khan", phone: "0333-9998887", email: "fawad.k@example.com", initials: "FK", color: "#f59e0b",
    score: 25, trend: "down", delta: 5,
    frequency: "Rare", recency: "9 months ago", spend: 1200, lifetimeOrders: 1, lastOrderDate: new Date(Date.now() - 270*86400000).toISOString(),
    factors: { frequency: 2, recency: 1, value: 10, engagement: 12 },
    history: generateHistory(1),
    medicines: generateMedicines(),
    chats: []
  }
];
