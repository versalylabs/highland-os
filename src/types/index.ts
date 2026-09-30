export type PhaseId = 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5';

export interface Product {
  id: string;
  name: string;
  category: 'Herbal Tea' | 'Gourmet Preserves' | 'Raw Honey' | 'Botanical Infusion';
  sku: string;
  retailPrice: number; // in KSh
  wholesalePrice: number; // in KSh
  costPrice: number; // in KSh
  unit: string; // e.g. "100g pouch", "350g jar", "250ml bottle"
  currentStock: number;
  minStockLevel: number;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export type OrderChannel = 'WhatsApp' | 'Website' | 'Direct Call' | 'Wholesale / Retailer';
export type OrderStatus = 'Pending Payment' | 'Confirmed' | 'In Production' | 'Dispatched' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid via M-PESA' | 'Paid via Cash' | 'Invoiced Net-30' | 'Overdue';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  channel: OrderChannel;
  items: OrderItem[];
  totalAmount: number; // KSh
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  mpesaRef?: string;
  createdAt: string;
  deliveryDate?: string;
  notes?: string;
  deliveryPerson?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  type: 'Individual' | 'Retailer' | 'Distributor' | 'Cafe/Hospitality';
  totalOrders: number;
  totalSpent: number; // KSh
  lastOrderDate: string;
  notes?: string;
}

// Phase 2: Inventory & Production
export interface RawMaterial {
  id: string;
  name: string;
  category: 'Ingredient' | 'Packaging' | 'Label';
  sku: string;
  unit: string; // kg, units, rolls, jars
  currentStock: number;
  minThreshold: number;
  unitCost: number; // KSh
  supplierId: string;
  supplierName: string;
  lastRestocked: string;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string; // e.g. HG-2026-HB04
  productId: string;
  productName: string;
  quantityPlanned: number;
  quantityActual: number;
  unit: string;
  startDate: string;
  completionDate?: string;
  bestBeforeDate: string;
  status: 'Scheduled' | 'In Progress' | 'Quality Review' | 'Approved' | 'Rejected';
  operatorName: string;
  rawMaterialsUsed: {
    materialId: string;
    materialName: string;
    quantityUsed: number;
    unit: string;
  }[];
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  itemsSupplied: string[];
  reliabilityRating: number; // 1-5
}

// Phase 3: Quality & Compliance
export interface QualityCheck {
  id: string;
  batchId: string;
  batchNumber: string;
  productName: string;
  checkedBy: string;
  date: string;
  tests: {
    testName: string;
    targetSpec: string;
    result: string;
    pass: boolean;
  }[];
  overallStatus: 'Passed' | 'Conditional Pass' | 'Failed';
  kebsStandardRef: string;
  notes?: string;
}

export interface ComplianceDoc {
  id: string;
  title: string;
  category: 'KEBS Operational' | 'Hygiene & HACCP' | 'Supplier COA' | 'Food Handler Certificate';
  referenceNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  fileUrl?: string;
}

export interface CustomerComplaint {
  id: string;
  date: string;
  customerName: string;
  batchNumber?: string;
  issueDescription: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Investigating' | 'CAPA Implemented' | 'Closed';
  correctiveAction?: string;
}

// Phase 4: Wholesale & Distribution
export interface RetailerAccount {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  tier: 'Tier 1 Key Account' | 'Tier 2 Independent Supermarket' | 'Health Store / Specialty';
  branchesCount: number;
  creditTerms: 'Cash on Delivery' | 'Net 14' | 'Net 30' | 'Net 60';
  creditLimit: number; // KSh
  currentBalance: number; // KSh
  assignedRep: string;
  deliveryRoute: string;
}

export interface WholesaleInvoice {
  id: string;
  invoiceNumber: string;
  retailerId: string;
  retailerName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';
  itemsCount: number;
}

// Business Settings & Integrations
export interface BusinessSettings {
  // WhatsApp Configuration
  whatsappNumber: string;
  whatsappBusinessName: string;
  whatsappApiKey?: string;
  whatsappWebhookUrl: string;
  whatsappAutoReply: boolean;
  whatsappAutoReplyTemplate: string;
  whatsappStatus: 'Connected' | 'Disconnected' | 'Syncing';
  
  // M-PESA Daraja Configuration
  mpesaType: 'Till Number' | 'Paybill' | 'Phone Number';
  mpesaNumber: string;
  mpesaBusinessName: string;
  mpesaPasskey?: string;
  mpesaConsumerKey?: string;
  mpesaStkEnabled: boolean;

  // Sync Preferences
  autoFetchIntervalSeconds: number;
  businessLocation: string;
  notificationEmail: string;
}

export interface WhatsAppClientMessage {
  id: string;
  sender: string;
  phone: string;
  time: string;
  text: string;
  recipientNumber: string; // The user's connected WhatsApp number
  status: 'New' | 'Parsed' | 'Archived';
  detectedItems?: { productId: string; quantity: number }[];
  detectedAddress?: string;
  estimatedTotal?: number;
}
