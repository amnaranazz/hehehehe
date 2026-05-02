// src/utils/ordersData.js

export const mockOrders = [
  {
    id: "ORD-00412",
    patient: { name: "Ayesha Khan", phone: "0300-1234567", email: "ayesha.k@example.com", initials: "AK" },
    address: "House 4, Street 9, Bahria Town, Rawalpindi",
    date: "2026-04-29T10:30:00",
    items: [
      { name: "Panadol 500mg", qty: 2, unitPrice: 45 },
      { name: "ORS Sachet", qty: 5, unitPrice: 20 }
    ],
    deliveryFee: 50,
    discount: 0,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    deliveryStatus: "New"
  },
  {
    id: "ORD-00411",
    patient: { name: "Bilal Ahmed", phone: "0321-7654321", email: "bilal.ahmed@example.com", initials: "BA" },
    address: "Apt 12B, Creek Vistas, Phase 8 DHA, Karachi",
    date: "2026-04-29T09:15:00",
    items: [
      { name: "Augmentin 625mg", qty: 1, unitPrice: 250 },
      { name: "Brufen 400mg", qty: 2, unitPrice: 80 }
    ],
    deliveryFee: 100,
    discount: 20,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    deliveryStatus: "Processing"
  },
  {
    id: "ORD-00410",
    patient: { name: "Zainab Ali", phone: "0333-1122334", email: "zainab.a@example.com", initials: "ZA" },
    address: "House 55, Block D, Model Town, Lahore",
    date: "2026-04-28T18:45:00",
    items: [
      { name: "Insulin Glargine 300U", qty: 3, unitPrice: 1200 },
      { name: "Alcohol Swabs Box", qty: 1, unitPrice: 150 }
    ],
    deliveryFee: 150,
    discount: 0,
    paymentMethod: "Wallet",
    paymentStatus: "Paid",
    deliveryStatus: "Ready"
  },
  {
    id: "ORD-00409",
    patient: { name: "Omer Farooq", phone: "0345-9988776", email: "omer.farooq@example.com", initials: "OF" },
    address: "House 10, Sector F-8/4, Islamabad",
    date: "2026-04-28T15:20:00",
    items: [
      { name: "Arinac Forte", qty: 1, unitPrice: 90 },
      { name: "Surbex Z", qty: 1, unitPrice: 320 }
    ],
    deliveryFee: 50,
    discount: 0,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    deliveryStatus: "Dispatched"
  },
  {
    id: "ORD-00408",
    patient: { name: "Sara Malik", phone: "0311-2233445", email: "sara.malik@example.com", initials: "SM" },
    address: "Flat 402, Askari 11, Lahore",
    date: "2026-04-28T11:10:00",
    items: [
      { name: "Thyroxine 50mcg", qty: 2, unitPrice: 150 }
    ],
    deliveryFee: 100,
    discount: 10,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  },
  {
    id: "ORD-00407",
    patient: { name: "Kamran Qureshi", phone: "0301-5566778", email: "kq@example.com", initials: "KQ" },
    address: "Bungalow 2, Block 4, Clifton, Karachi",
    date: "2026-04-27T20:30:00",
    items: [
      { name: "Atorvastatin 20mg", qty: 3, unitPrice: 400 },
      { name: "Aspirin 75mg", qty: 1, unitPrice: 60 }
    ],
    deliveryFee: 0,
    discount: 50,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  },
  {
    id: "ORD-00406",
    patient: { name: "Hassan Raza", phone: "0322-8877665", email: "hassan.r@example.com", initials: "HR" },
    address: "House 31, Street 5, G-11/2, Islamabad",
    date: "2026-04-27T14:15:00",
    items: [
      { name: "Cough Syrup (GPL)", qty: 2, unitPrice: 110 }
    ],
    deliveryFee: 50,
    discount: 0,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Failed",
    deliveryStatus: "Cancelled"
  },
  {
    id: "ORD-00405",
    patient: { name: "Madiha Tariq", phone: "0334-4455667", email: "madiha.t@example.com", initials: "MT" },
    address: "House 18, Block A, Gulshan-e-Iqbal, Karachi",
    date: "2026-04-27T09:05:00",
    items: [
      { name: "Centrum Silver Women", qty: 1, unitPrice: 1500 }
    ],
    deliveryFee: 100,
    discount: 0,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  },
  {
    id: "ORD-00404",
    patient: { name: "Fahad Mustafa", phone: "0300-9911223", email: "fahad.m@example.com", initials: "FM" },
    address: "Apt 2A, Heights Tower, Bahria Enclave, Islamabad",
    date: "2026-04-26T18:45:00",
    items: [
      { name: "Nexum 40mg", qty: 2, unitPrice: 350 },
      { name: "Gaviscon Liquid", qty: 1, unitPrice: 180 }
    ],
    deliveryFee: 50,
    discount: 0,
    paymentMethod: "Wallet",
    paymentStatus: "Paid",
    deliveryStatus: "Dispatched"
  },
  {
    id: "ORD-00403",
    patient: { name: "Sana Sheikh", phone: "0312-3344556", email: "sana.s@example.com", initials: "SS" },
    address: "House 9, Street 2, DHA Phase 5, Lahore",
    date: "2026-04-26T15:20:00",
    items: [
      { name: "Calcium Sandoz", qty: 3, unitPrice: 220 }
    ],
    deliveryFee: 100,
    discount: 0,
    paymentMethod: "Credit Card",
    paymentStatus: "Refunded",
    deliveryStatus: "Cancelled"
  },
  {
    id: "ORD-00402",
    patient: { name: "Usman Ghani", phone: "0345-1122334", email: "usman.g@example.com", initials: "UG" },
    address: "House 100, Block N, Johar Town, Lahore",
    date: "2026-04-26T10:10:00",
    items: [
      { name: "Ventolin Inhaler", qty: 1, unitPrice: 450 },
      { name: "Montelukast 10mg", qty: 2, unitPrice: 300 }
    ],
    deliveryFee: 50,
    discount: 0,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    deliveryStatus: "Processing"
  },
  {
    id: "ORD-00401",
    patient: { name: "Nadia Hussain", phone: "0333-5566778", email: "nadia.h@example.com", initials: "NH" },
    address: "House 12, Street 7, F-10/2, Islamabad",
    date: "2026-04-25T16:30:00",
    items: [
      { name: "Vidaylin Drops", qty: 1, unitPrice: 120 },
      { name: "Thermometer (Digital)", qty: 1, unitPrice: 850 }
    ],
    deliveryFee: 0,
    discount: 100,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  },
  {
    id: "ORD-00400",
    patient: { name: "Ali Zafar", phone: "0301-9988776", email: "ali.z@example.com", initials: "AZ" },
    address: "House 5, Block B, SMCHS, Karachi",
    date: "2026-04-25T11:45:00",
    items: [
      { name: "Flagyl 400mg", qty: 1, unitPrice: 90 },
      { name: "Lomotil", qty: 2, unitPrice: 40 }
    ],
    deliveryFee: 50,
    discount: 0,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    deliveryStatus: "New"
  },
  {
    id: "ORD-00399",
    patient: { name: "Imran Khan", phone: "0321-1122334", email: "imran.k@example.com", initials: "IK" },
    address: "Bani Gala Road, Islamabad",
    date: "2026-04-24T14:20:00",
    items: [
      { name: "Neurobion Forte", qty: 5, unitPrice: 150 }
    ],
    deliveryFee: 150,
    discount: 0,
    paymentMethod: "Wallet",
    paymentStatus: "Paid",
    deliveryStatus: "Ready"
  },
  {
    id: "ORD-00398",
    patient: { name: "Fatima Jinnah", phone: "0300-5566778", email: "fatima.j@example.com", initials: "FJ" },
    address: "House 1, Mohatta Palace Road, Karachi",
    date: "2026-04-24T09:10:00",
    items: [
      { name: "Dental Floss", qty: 2, unitPrice: 200 },
      { name: "Listerine Mouthwash", qty: 1, unitPrice: 550 }
    ],
    deliveryFee: 100,
    discount: 0,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  }
];
