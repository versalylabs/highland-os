import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_RAW_MATERIALS,
  INITIAL_BATCHES,
  INITIAL_SUPPLIERS,
  INITIAL_QUALITY_CHECKS,
  INITIAL_COMPLIANCE_DOCS,
  INITIAL_COMPLAINTS,
  INITIAL_RETAILERS,
  INITIAL_INVOICES,
} from '../data/mockData';
import {
  Product,
  Order,
  Customer,
  RawMaterial,
  ProductionBatch,
  Supplier,
  QualityCheck,
  ComplianceDoc,
  CustomerComplaint,
  RetailerAccount,
  WholesaleInvoice,
  BusinessSettings,
  WhatsAppClientMessage,
} from '../types';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  avatarColor: string;
  createdAt: string;
}

export interface UserBusinessData {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  rawMaterials: RawMaterial[];
  batches: ProductionBatch[];
  suppliers: Supplier[];
  qualityChecks: QualityCheck[];
  complianceDocs: ComplianceDoc[];
  complaints: CustomerComplaint[];
  retailers: RetailerAccount[];
  invoices: WholesaleInvoice[];
  settings: BusinessSettings;
  incomingMessages: WhatsAppClientMessage[];
}

export const MASTER_CREDENTIALS = {
  email: 'versalylabs@gmail.com',
  password: 'labversaly-16',
  name: 'Versaly Labs Admin',
  role: 'Operations & Managing Director',
};

export const DEFAULT_MASTER_SETTINGS: BusinessSettings = {
  whatsappNumber: '+254 722 419 802',
  whatsappBusinessName: 'Highland Gardens Orders Desk',
  whatsappApiKey: 'hg_live_wa_sec_99342',
  whatsappWebhookUrl: 'https://api.highlandgardens.co.ke/v1/webhooks/whatsapp',
  whatsappAutoReply: true,
  whatsappAutoReplyTemplate: 'Jambo {customer_name}! Thank you for contacting Highland Gardens. We have received your order request and our dispatch team is preparing it. Total due: KSh {amount}. An M-PESA prompt will follow shortly.',
  whatsappStatus: 'Connected',
  mpesaType: 'Till Number',
  mpesaNumber: '849201',
  mpesaBusinessName: 'Highland Gardens Ltd',
  mpesaPasskey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  mpesaConsumerKey: 'K9j1nLkQx9812MopqZ8',
  mpesaStkEnabled: true,
  autoFetchIntervalSeconds: 30,
  businessLocation: 'Limuru Highlands & Nairobi Office',
  notificationEmail: 'orders@highlandgardens.co.ke',
};

export const INITIAL_WHATSAPP_MESSAGES: WhatsAppClientMessage[] = [
  {
    id: 'wa-msg-1',
    sender: 'Wanjiku Mwangi',
    phone: '+254 722 419 802',
    time: '10:14 AM Today',
    text: 'Habari Highland Gardens! Kindly send me 3 packs of Hibiscus Tea and 1 jar of the Wild Acacia Honey to Lavington (Lavender Court Apt 4B). Can I pay via M-PESA as usual?',
    recipientNumber: '+254 722 419 802',
    status: 'New',
    detectedAddress: 'Lavender Court Apt 4B, Lavington, Nairobi',
    detectedItems: [
      { productId: 'prod-1', quantity: 3 },
      { productId: 'prod-3', quantity: 1 },
    ],
    estimatedTotal: 2550,
  },
  {
    id: 'wa-msg-2',
    sender: 'Grace Nyambura',
    phone: '+254 712 908 554',
    time: '09:42 AM Today',
    text: 'Hello, I saw your herbal teas at the Farmers Market. Please deliver 2 Highland Pure Green Tea tins and 2 Mount Kenya Spiced Chai to Riverside Drive, House 14. Delivery before 3pm please.',
    recipientNumber: '+254 722 419 802',
    status: 'New',
    detectedAddress: 'House 14, Riverside Drive, Westlands, Nairobi',
    detectedItems: [
      { productId: 'prod-2', quantity: 2 },
      { productId: 'prod-6', quantity: 2 },
    ],
    estimatedTotal: 2600,
  },
  {
    id: 'wa-msg-3',
    sender: 'Dennis Mutiso',
    phone: '+254 733 118 760',
    time: '08:50 AM Today',
    text: 'Hi there, I want 4 jars of Strawberry Passion Preserve and 2 packs of Lemongrass Ginger Infusion to Karen, near Karen Country Club. Send M-PESA prompt to this number.',
    recipientNumber: '+254 722 419 802',
    status: 'New',
    detectedAddress: 'Near Karen Country Club, Karen, Nairobi',
    detectedItems: [
      { productId: 'prod-4', quantity: 4 },
      { productId: 'prod-5', quantity: 2 },
    ],
    estimatedTotal: 3400,
  },
  {
    id: 'wa-msg-4',
    sender: 'Dr. Evans Kiprono',
    phone: '+254 705 678 123',
    time: 'Yesterday 4:15 PM',
    text: 'Jambo, I would like to order 5 packs of Pure Green Tea and 2 jars of Raw Acacia Honey for our wellness clinic in Kilimani, Argwings Kodhek Rd.',
    recipientNumber: '+254 722 419 802',
    status: 'New',
    detectedAddress: 'Wellness Clinic, Argwings Kodhek Rd, Kilimani, Nairobi',
    detectedItems: [
      { productId: 'prod-2', quantity: 5 },
      { productId: 'prod-3', quantity: 2 },
    ],
    estimatedTotal: 4600,
  },
];

const ACCOUNTS_STORAGE_KEY = 'hg_registered_accounts_v1';
const CURRENT_USER_KEY = 'hg_active_session_user_v1';

// Seed default accounts
export function getRegisteredAccounts(): { user: AppUser; passwordHash: string }[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load accounts', e);
  }

  // Initial master account
  const defaultAccounts = [
    {
      user: {
        id: 'usr-master-001',
        name: MASTER_CREDENTIALS.name,
        email: MASTER_CREDENTIALS.email,
        role: MASTER_CREDENTIALS.role,
        avatarInitials: 'VL',
        avatarColor: '#006D77',
        createdAt: '2026-01-15',
      },
      passwordHash: MASTER_CREDENTIALS.password,
    },
  ];

  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(defaultAccounts));
  } catch (e) {
    // Ignore storage quota
  }

  return defaultAccounts;
}

export function getCurrentUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read session', e);
  }
  return null;
}

export function setCurrentUser(user: AppUser | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to update session', e);
  }
}

// User-specific data persistence
export function getUserDataStorageKey(email: string): string {
  return `hg_data_${email.trim().toLowerCase()}`;
}

export function loadUserData(user: AppUser): UserBusinessData {
  const key = getUserDataStorageKey(user.email);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.orders)) {
        // Ensure settings & incomingMessages exist even if older session was stored
        if (!parsed.settings) {
          parsed.settings = user.email.toLowerCase() === MASTER_CREDENTIALS.email.toLowerCase()
            ? DEFAULT_MASTER_SETTINGS
            : {
                whatsappNumber: '+254 712 345 678',
                whatsappBusinessName: `${user.name} Botanicals`,
                whatsappWebhookUrl: `https://api.highlandgardens.co.ke/v1/webhooks/${user.id}`,
                whatsappAutoReply: true,
                whatsappAutoReplyTemplate: `Jambo {customer_name}! Thank you for ordering from ${user.name} Botanicals. We received your order for KSh {amount}.`,
                whatsappStatus: 'Connected',
                mpesaType: 'Till Number',
                mpesaNumber: '782390',
                mpesaBusinessName: `${user.name} Operations`,
                mpesaPasskey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
                mpesaConsumerKey: 'K9j1nLkQx9812MopqZ8',
                mpesaStkEnabled: true,
                autoFetchIntervalSeconds: 30,
                businessLocation: 'Nairobi Hub',
                notificationEmail: user.email,
              };
        }
        if (!Array.isArray(parsed.incomingMessages)) {
          parsed.incomingMessages = INITIAL_WHATSAPP_MESSAGES.map(m => ({
            ...m,
            recipientNumber: parsed.settings?.whatsappNumber || '+254 712 345 678',
          }));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load user business data', e);
  }

  // If this is the master demo account, seed with full initial data
  if (user.email.toLowerCase() === MASTER_CREDENTIALS.email.toLowerCase()) {
    const masterData: UserBusinessData = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      rawMaterials: INITIAL_RAW_MATERIALS,
      batches: INITIAL_BATCHES,
      suppliers: INITIAL_SUPPLIERS,
      qualityChecks: INITIAL_QUALITY_CHECKS,
      complianceDocs: INITIAL_COMPLIANCE_DOCS,
      complaints: INITIAL_COMPLAINTS,
      retailers: INITIAL_RETAILERS,
      invoices: INITIAL_INVOICES,
      settings: DEFAULT_MASTER_SETTINGS,
      incomingMessages: INITIAL_WHATSAPP_MESSAGES,
    };
    saveUserData(user.email, masterData);
    return masterData;
  }

  // For a new distinct user, provide a fresh baseline template so they can start immediately without interfering with master account
  const newAccountSettings: BusinessSettings = {
    whatsappNumber: '+254 712 345 678',
    whatsappBusinessName: `${user.name} Botanicals`,
    whatsappWebhookUrl: `https://api.highlandgardens.co.ke/v1/webhooks/${user.id}`,
    whatsappAutoReply: true,
    whatsappAutoReplyTemplate: `Jambo {customer_name}! Thank you for ordering from ${user.name} Botanicals. We have received your order request for KSh {amount}.`,
    whatsappStatus: 'Connected',
    mpesaType: 'Till Number',
    mpesaNumber: '782390',
    mpesaBusinessName: `${user.name} Operations`,
    mpesaPasskey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    mpesaConsumerKey: 'K9j1nLkQx9812MopqZ8',
    mpesaStkEnabled: true,
    autoFetchIntervalSeconds: 30,
    businessLocation: 'Nairobi Hub',
    notificationEmail: user.email,
  };

  const newAccountMessages: WhatsAppClientMessage[] = [
    {
      id: `wa-starter-${Date.now()}-1`,
      sender: 'Mercy Achieng',
      phone: '+254 721 889 001',
      time: 'Just now',
      text: 'Hello! I would like to order 2 packs of Hibiscus Tea and 1 jar of Honey. Can I have them delivered to Kilimani, Wood Avenue by 4pm?',
      recipientNumber: newAccountSettings.whatsappNumber,
      status: 'New',
      detectedAddress: 'Wood Avenue, Kilimani, Nairobi',
      detectedItems: [
        { productId: INITIAL_PRODUCTS[0]?.id || 'prod-1', quantity: 2 },
        { productId: INITIAL_PRODUCTS[2]?.id || 'prod-3', quantity: 1 },
      ],
      estimatedTotal: 2100,
    },
    {
      id: `wa-starter-${Date.now()}-2`,
      sender: 'Brian Ombati',
      phone: '+254 734 551 223',
      time: '15 mins ago',
      text: 'Jambo, please deliver 3 tins of Pure Green Tea to Parklands 4th Avenue. I will pay using your M-PESA Till number.',
      recipientNumber: newAccountSettings.whatsappNumber,
      status: 'New',
      detectedAddress: '4th Avenue, Parklands, Nairobi',
      detectedItems: [
        { productId: INITIAL_PRODUCTS[1]?.id || 'prod-2', quantity: 3 },
      ],
      estimatedTotal: 2100,
    },
  ];

  const newAccountData: UserBusinessData = {
    products: INITIAL_PRODUCTS.map(p => ({ ...p, currentStock: p.minStockLevel + 20 })),
    orders: [], // Clean fresh orders queue
    customers: [
      {
        id: `cust-starter-${Date.now()}`,
        name: 'Sample First Customer',
        phone: '+254 700 123 456',
        address: 'Nairobi CBD',
        city: 'Nairobi',
        type: 'Individual',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: '2026-09-30',
        notes: 'Starter customer profile',
      },
    ],
    rawMaterials: INITIAL_RAW_MATERIALS.map(r => ({ ...r, currentStock: r.minThreshold + 50 })),
    batches: [],
    suppliers: INITIAL_SUPPLIERS,
    qualityChecks: [],
    complianceDocs: INITIAL_COMPLIANCE_DOCS.slice(0, 2),
    complaints: [],
    retailers: INITIAL_RETAILERS.slice(0, 2).map(r => ({ ...r, currentBalance: 0 })),
    invoices: [],
    settings: newAccountSettings,
    incomingMessages: newAccountMessages,
  };

  saveUserData(user.email, newAccountData);
  return newAccountData;
}

// Generate realistic simulated incoming customer WhatsApp message
export function generateSimulatedWhatsAppInquiry(
  recipientNumber: string,
  products: Product[]
): WhatsAppClientMessage {
  const SAMPLES = [
    {
      sender: 'Fatuma Hassan',
      phone: '+254 798 ' + Math.floor(100000 + Math.random() * 900000),
      location: 'South C, Plainsview Estate House 12',
      items: [
        { pIndex: 0, qty: 2 },
        { pIndex: 4, qty: 1 },
      ],
      comment: 'Please send to South C before 5pm. Will pay via M-PESA STK prompt.',
    },
    {
      sender: 'Kipchumba Bett',
      phone: '+254 726 ' + Math.floor(100000 + Math.random() * 900000),
      location: 'Kilimani, Denis Pritt Rd Court 3',
      items: [
        { pIndex: 1, qty: 3 },
        { pIndex: 2, qty: 2 },
      ],
      comment: 'Hello, repeat order for Denis Pritt Rd. Confirm when rider is dispatched.',
    },
    {
      sender: 'Zipporah Ndwiga',
      phone: '+254 711 ' + Math.floor(100000 + Math.random() * 900000),
      location: 'Westlands, Sarit Centre Office Suites',
      items: [
        { pIndex: 3, qty: 4 },
        { pIndex: 5, qty: 2 },
      ],
      comment: 'Need 4 jars of fruit preserves and 2 chai packs for our staff pantry.',
    },
    {
      sender: 'Gideon Wamalwa',
      phone: '+254 735 ' + Math.floor(100000 + Math.random() * 900000),
      location: 'Runda Estate, Mimosa Drive Gate 8',
      items: [
        { pIndex: 2, qty: 3 },
        { pIndex: 0, qty: 2 },
      ],
      comment: 'Kindly deliver to Runda gate 8. Send M-PESA request immediately.',
    },
  ];

  const pick = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
  const detectedItems = pick.items.map(it => {
    const prod = products[it.pIndex] || products[0];
    return {
      productId: prod.id,
      quantity: it.qty,
    };
  });

  const estimatedTotal = detectedItems.reduce((acc, curr) => {
    const prod = products.find(p => p.id === curr.productId);
    return acc + (prod?.retailPrice || 500) * curr.quantity;
  }, 0);

  const productNamesStr = detectedItems
    .map(it => {
      const prod = products.find(p => p.id === it.productId);
      return `${it.quantity}x ${prod?.name || 'Item'}`;
    })
    .join(' and ');

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    id: `wa-inbound-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: pick.sender,
    phone: pick.phone,
    time: `${timeStr} Today`,
    text: `Jambo! I would like to order ${productNamesStr}. Please deliver to ${pick.location}. ${pick.comment}`,
    recipientNumber: recipientNumber || '+254 722 419 802',
    status: 'New',
    detectedAddress: pick.location,
    detectedItems,
    estimatedTotal,
  };
}

export function saveUserData(email: string, data: UserBusinessData): void {
  const key = getUserDataStorageKey(email);
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed (possibly quota)', e);
  }
}

// Authentication operations
export function authenticateUser(email: string, password: string): { success: boolean; user?: AppUser; error?: string } {
  const accounts = getRegisteredAccounts();
  const cleanEmail = email.trim().toLowerCase();

  const found = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);
  if (!found) {
    return { success: false, error: 'Account not found. Please register or check your email.' };
  }

  if (found.passwordHash !== password) {
    return { success: false, error: 'Incorrect password. Please verify and try again.' };
  }

  setCurrentUser(found.user);
  return { success: true, user: found.user };
}

export function registerNewUser(
  name: string,
  email: string,
  password: string,
  role: string = 'Production & Sales Staff'
): { success: boolean; user?: AppUser; error?: string } {
  const accounts = getRegisteredAccounts();
  const cleanEmail = email.trim().toLowerCase();

  if (accounts.some(a => a.user.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || 'HG';

  const palette = ['#006D77', '#004D54', '#D4A373', '#2A9D8F', '#264653', '#E76F51'];
  const avatarColor = palette[Math.floor(Math.random() * palette.length)];

  const newUser: AppUser = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: cleanEmail,
    role: role.trim() || 'Food Production Manager',
    avatarInitials: initials,
    avatarColor,
    createdAt: new Date().toISOString().substring(0, 10),
  };

  accounts.push({
    user: newUser,
    passwordHash: password,
  });

  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save registered account', e);
  }

  // Pre-seed fresh user data
  loadUserData(newUser);

  // Set active session
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function logoutUser(): void {
  setCurrentUser(null);
}
