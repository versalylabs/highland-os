import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavigationPage } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LoginPage } from './components/Auth/LoginPage';

// Sales & Order Management
import { SalesDashboard } from './components/Phase1Sales/SalesDashboard';
import { OrderList } from './components/Phase1Sales/OrderList';
import { ProductCatalog } from './components/Phase1Sales/ProductCatalog';
import { CustomerList } from './components/Phase1Sales/CustomerList';
import { WhatsAppOrderCaptureModal } from './components/Phase1Sales/WhatsAppOrderCaptureModal';
import { MpesaPaymentModal } from './components/Phase1Sales/MpesaPaymentModal';
import { NewOrderModal } from './components/Phase1Sales/NewOrderModal';
import { OrderDetailsModal } from './components/Phase1Sales/OrderDetailsModal';

// Inventory & Production
import { InventoryOverview } from './components/Phase2Inventory/InventoryOverview';
import { ProductionBatches } from './components/Phase2Inventory/ProductionBatches';
import { SuppliersList } from './components/Phase2Inventory/SuppliersList';

// Quality & Compliance
import { QualityDashboard } from './components/Phase3Quality/QualityDashboard';

// Wholesale & Distribution
import { WholesaleDashboard } from './components/Phase4Wholesale/WholesaleDashboard';

// Executive Business Intelligence
import { ExecutiveDashboard } from './components/Phase5BI/ExecutiveDashboard';

// Settings & Omnichannel Integrations
import { SettingsPage } from './components/Settings/SettingsPage';

// Data, Auth & Types
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
  INITIAL_INVOICES 
} from './data/mockData';
import { 
  Order, 
  Product, 
  Customer, 
  RawMaterial, 
  ProductionBatch, 
  Supplier,
  QualityCheck,
  ComplianceDoc,
  CustomerComplaint,
  RetailerAccount,
  WholesaleInvoice,
  OrderStatus,
  BusinessSettings,
  WhatsAppClientMessage
} from './types';
import { 
  getCurrentUser, 
  loadUserData, 
  saveUserData, 
  logoutUser, 
  AppUser, 
  UserBusinessData,
  DEFAULT_MASTER_SETTINGS,
  INITIAL_WHATSAPP_MESSAGES,
  generateSimulatedWhatsAppInquiry
} from './services/authService';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getCurrentUser());

  // Navigation State
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Business Operational State (Per-user isolated database)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [batches, setBatches] = useState<ProductionBatch[]>(INITIAL_BATCHES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(INITIAL_QUALITY_CHECKS);
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDoc[]>(INITIAL_COMPLIANCE_DOCS);
  const [complaints, setComplaints] = useState<CustomerComplaint[]>(INITIAL_COMPLAINTS);
  const [retailers, setRetailers] = useState<RetailerAccount[]>(INITIAL_RETAILERS);
  const [invoices, setInvoices] = useState<WholesaleInvoice[]>(INITIAL_INVOICES);
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_MASTER_SETTINGS);
  const [incomingMessages, setIncomingMessages] = useState<WhatsAppClientMessage[]>(INITIAL_WHATSAPP_MESSAGES);
  const [activeMessageForIntake, setActiveMessageForIntake] = useState<WhatsAppClientMessage | null>(null);

  // Modal Controllers
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [selectedOrderForMpesa, setSelectedOrderForMpesa] = useState<Order | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Load active user's workspace on login or switch
  const loadUserWorkspace = useCallback((user: AppUser) => {
    const data = loadUserData(user);
    setProducts(data.products);
    setOrders(data.orders);
    setCustomers(data.customers);
    setRawMaterials(data.rawMaterials);
    setBatches(data.batches);
    setSuppliers(data.suppliers);
    setQualityChecks(data.qualityChecks);
    setComplianceDocs(data.complianceDocs);
    setComplaints(data.complaints);
    setRetailers(data.retailers);
    setInvoices(data.invoices);
    if (data.settings) setSettings(data.settings);
    if (data.incomingMessages) setIncomingMessages(data.incomingMessages);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserWorkspace(currentUser);
    }
  }, [currentUser, loadUserWorkspace]);

  // Save isolated user changes
  const persistChanges = (override: Partial<UserBusinessData>) => {
    if (!currentUser) return;
    const fullData: UserBusinessData = {
      products: override.products !== undefined ? override.products : products,
      orders: override.orders !== undefined ? override.orders : orders,
      customers: override.customers !== undefined ? override.customers : customers,
      rawMaterials: override.rawMaterials !== undefined ? override.rawMaterials : rawMaterials,
      batches: override.batches !== undefined ? override.batches : batches,
      suppliers: override.suppliers !== undefined ? override.suppliers : suppliers,
      qualityChecks: override.qualityChecks !== undefined ? override.qualityChecks : qualityChecks,
      complianceDocs: override.complianceDocs !== undefined ? override.complianceDocs : complianceDocs,
      complaints: override.complaints !== undefined ? override.complaints : complaints,
      retailers: override.retailers !== undefined ? override.retailers : retailers,
      invoices: override.invoices !== undefined ? override.invoices : invoices,
      settings: override.settings !== undefined ? override.settings : settings,
      incomingMessages: override.incomingMessages !== undefined ? override.incomingMessages : incomingMessages,
    };
    saveUserData(currentUser.email, fullData);
  };

  // Settings & Inbound Message Handlers
  const handleSaveSettings = (newSettings: BusinessSettings) => {
    setSettings(newSettings);
    persistChanges({ settings: newSettings });
  };

  const handleUpdateMessages = (msgs: WhatsAppClientMessage[]) => {
    setIncomingMessages(msgs);
    persistChanges({ incomingMessages: msgs });
  };

  const handleOpenWhatsAppCaptureWithMessage = (msg: WhatsAppClientMessage) => {
    setActiveMessageForIntake(msg);
    setIsWhatsAppModalOpen(true);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    loadUserWorkspace(user);
    showToast(`Welcome back, ${user.name}`);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    showToast('Signed out of session');
  };

  // Order Handlers
  const handleSaveOrder = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);

    // Reconcile or create customer profile
    let updatedCustomers = [...customers];
    const existing = updatedCustomers.find(
      c => c.phone === newOrder.customerPhone || 
      c.name.toLowerCase() === newOrder.customerName.toLowerCase()
    );

    if (existing) {
      updatedCustomers = updatedCustomers.map(c => c.id === existing.id ? {
        ...c,
        totalOrders: c.totalOrders + 1,
        totalSpent: c.totalSpent + newOrder.totalAmount,
        lastOrderDate: new Date().toISOString().split('T')[0]
      } : c);
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: newOrder.customerName,
        phone: newOrder.customerPhone,
        address: newOrder.customerAddress,
        city: 'Nairobi',
        type: 'Individual',
        totalOrders: 1,
        totalSpent: newOrder.totalAmount,
        lastOrderDate: new Date().toISOString().split('T')[0],
        notes: `Created via ${newOrder.channel}`,
      };
      updatedCustomers = [newCust, ...updatedCustomers];
    }
    setCustomers(updatedCustomers);

    persistChanges({ orders: updatedOrders, customers: updatedCustomers });
    showToast(`Order ${newOrder.orderNumber} logged successfully`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);

    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(prev => prev ? { ...prev, status: newStatus } : null);
    }

    persistChanges({ orders: updatedOrders });
    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const handleMpesaReconciled = (orderId: string, mpesaRef: string) => {
    const updatedOrders = orders.map(o => o.id === orderId ? {
      ...o,
      paymentStatus: 'Paid via M-PESA' as const,
      status: o.status === 'Pending Payment' ? 'Confirmed' as const : o.status,
      mpesaRef: mpesaRef
    } : o);
    setOrders(updatedOrders);

    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(prev => prev ? {
        ...prev,
        paymentStatus: 'Paid via M-PESA',
        status: prev.status === 'Pending Payment' ? 'Confirmed' : prev.status,
        mpesaRef: mpesaRef
      } : null);
    }

    persistChanges({ orders: updatedOrders });
    showToast(`M-PESA receipt ${mpesaRef} successfully reconciled!`);
  };

  const handleOpenMpesaModal = (order: Order) => {
    setSelectedOrderForMpesa(order);
    setIsMpesaModalOpen(true);
  };

  // Production Batch Handlers
  const handleCreateBatch = (batchData: Partial<ProductionBatch>) => {
    const newBatch: ProductionBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: batchData.batchNumber || `HG-2026-B${batches.length + 1}`,
      productId: batchData.productId || products[0].id,
      productName: batchData.productName || products[0].name,
      quantityPlanned: batchData.quantityPlanned || 200,
      quantityActual: batchData.quantityActual || 200,
      unit: batchData.unit || 'units',
      startDate: batchData.startDate || new Date().toISOString().split('T')[0],
      bestBeforeDate: batchData.bestBeforeDate || '2027-12-31',
      status: batchData.status || 'In Progress',
      operatorName: batchData.operatorName || 'Samuel Kariuki',
      rawMaterialsUsed: batchData.rawMaterialsUsed || [],
      notes: batchData.notes,
    };

    const updatedBatches = [newBatch, ...batches];
    setBatches(updatedBatches);

    // Automatically deduct BOM materials
    const updatedMaterials = rawMaterials.map(rm => {
      const match = newBatch.rawMaterialsUsed.find(u => u.materialId === rm.id);
      if (match) {
        return { ...rm, currentStock: Math.max(0, rm.currentStock - match.quantityUsed) };
      }
      return rm;
    });
    setRawMaterials(updatedMaterials);

    persistChanges({ batches: updatedBatches, rawMaterials: updatedMaterials });
    showToast(`Production Batch ${newBatch.batchNumber} launched!`);
  };

  const handleUpdateBatchStatus = (batchId: string, status: ProductionBatch['status']) => {
    let updatedProducts = [...products];

    const updatedBatches = batches.map(b => {
      if (b.id === batchId) {
        if (status === 'Approved' && b.status !== 'Approved') {
          updatedProducts = updatedProducts.map(p => 
            p.id === b.productId ? { ...p, currentStock: p.currentStock + b.quantityActual } : p
          );
        }
        return { ...b, status };
      }
      return b;
    });

    setBatches(updatedBatches);
    setProducts(updatedProducts);

    persistChanges({ batches: updatedBatches, products: updatedProducts });
    showToast(`Batch status updated to ${status}`);
  };

  // Product CRUD Handlers
  const handleCreateProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    persistChanges({ products: updated });
    showToast(`Product "${newProduct.name}" added to catalogue!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updated);
    persistChanges({ products: updated });
    showToast(`Product "${updatedProduct.name}" updated successfully!`);
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    persistChanges({ products: updated });
    showToast(`Product "${prod?.name || productId}" deleted`);
  };

  // Order CRUD Handlers
  const handleUpdateOrder = (updatedOrder: Order) => {
    const updated = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
    setOrders(updated);
    if (selectedOrderDetails && selectedOrderDetails.id === updatedOrder.id) {
      setSelectedOrderDetails(updatedOrder);
    }
    persistChanges({ orders: updated });
    showToast(`Order ${updatedOrder.orderNumber} updated!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(null);
    }
    persistChanges({ orders: updated });
    showToast(`Order ${ord?.orderNumber || orderId} deleted`);
  };

  // Customer CRUD Handlers
  const handleCreateCustomer = (newCustomer: Customer) => {
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    persistChanges({ customers: updated });
    showToast(`Customer "${newCustomer.name}" added!`);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    const updated = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
    setCustomers(updated);
    persistChanges({ customers: updated });
    showToast(`Customer "${updatedCustomer.name}" updated!`);
  };

  const handleDeleteCustomer = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    const updated = customers.filter(c => c.id !== customerId);
    setCustomers(updated);
    persistChanges({ customers: updated });
    showToast(`Customer "${cust?.name || customerId}" removed`);
  };

  // Raw Material CRUD Handlers
  const handleCreateRawMaterial = (newMat: RawMaterial) => {
    const updated = [newMat, ...rawMaterials];
    setRawMaterials(updated);
    persistChanges({ rawMaterials: updated });
    showToast(`Material "${newMat.name}" added to inventory!`);
  };

  const handleUpdateRawMaterial = (updatedMat: RawMaterial) => {
    const updated = rawMaterials.map(m => m.id === updatedMat.id ? updatedMat : m);
    setRawMaterials(updated);
    persistChanges({ rawMaterials: updated });
    showToast(`Material "${updatedMat.name}" updated!`);
  };

  const handleDeleteRawMaterial = (materialId: string) => {
    const mat = rawMaterials.find(m => m.id === materialId);
    const updated = rawMaterials.filter(m => m.id !== materialId);
    setRawMaterials(updated);
    persistChanges({ rawMaterials: updated });
    showToast(`Material "${mat?.name || materialId}" removed`);
  };

  // Production Batch Update/Delete Handlers
  const handleUpdateBatch = (updatedBatch: ProductionBatch) => {
    const updated = batches.map(b => b.id === updatedBatch.id ? updatedBatch : b);
    setBatches(updated);
    persistChanges({ batches: updated });
    showToast(`Batch ${updatedBatch.batchNumber} updated!`);
  };

  const handleDeleteBatch = (batchId: string) => {
    const b = batches.find(x => x.id === batchId);
    const updated = batches.filter(x => x.id !== batchId);
    setBatches(updated);
    persistChanges({ batches: updated });
    showToast(`Batch ${b?.batchNumber || batchId} deleted`);
  };

  // Supplier CRUD Handlers
  const handleCreateSupplier = (newSup: Supplier) => {
    const updated = [newSup, ...suppliers];
    setSuppliers(updated);
    persistChanges({ suppliers: updated });
    showToast(`Supplier "${newSup.name}" added!`);
  };

  const handleUpdateSupplier = (updatedSup: Supplier) => {
    const updated = suppliers.map(s => s.id === updatedSup.id ? updatedSup : s);
    setSuppliers(updated);
    persistChanges({ suppliers: updated });
    showToast(`Supplier "${updatedSup.name}" updated!`);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    const sup = suppliers.find(s => s.id === supplierId);
    const updated = suppliers.filter(s => s.id !== supplierId);
    setSuppliers(updated);
    persistChanges({ suppliers: updated });
    showToast(`Supplier "${sup?.name || supplierId}" removed`);
  };

  // Quality Check CRUD Handlers
  const handleCreateQualityCheck = (newCheck: QualityCheck) => {
    const updated = [newCheck, ...qualityChecks];
    setQualityChecks(updated);
    persistChanges({ qualityChecks: updated });
    showToast(`Quality check for batch ${newCheck.batchNumber} added!`);
  };

  const handleUpdateQualityCheck = (updatedCheck: QualityCheck) => {
    const updated = qualityChecks.map(c => c.id === updatedCheck.id ? updatedCheck : c);
    setQualityChecks(updated);
    persistChanges({ qualityChecks: updated });
    showToast(`Quality check updated!`);
  };

  const handleDeleteQualityCheck = (checkId: string) => {
    const updated = qualityChecks.filter(c => c.id !== checkId);
    setQualityChecks(updated);
    persistChanges({ qualityChecks: updated });
    showToast('Quality check removed');
  };

  // Compliance Document CRUD Handlers
  const handleCreateComplianceDoc = (newDoc: ComplianceDoc) => {
    const updated = [newDoc, ...complianceDocs];
    setComplianceDocs(updated);
    persistChanges({ complianceDocs: updated });
    showToast(`Document "${newDoc.title}" added!`);
  };

  const handleUpdateComplianceDoc = (updatedDoc: ComplianceDoc) => {
    const updated = complianceDocs.map(d => d.id === updatedDoc.id ? updatedDoc : d);
    setComplianceDocs(updated);
    persistChanges({ complianceDocs: updated });
    showToast(`Document "${updatedDoc.title}" updated!`);
  };

  const handleDeleteComplianceDoc = (docId: string) => {
    const doc = complianceDocs.find(d => d.id === docId);
    const updated = complianceDocs.filter(d => d.id !== docId);
    setComplianceDocs(updated);
    persistChanges({ complianceDocs: updated });
    showToast(`Document "${doc?.title || docId}" removed`);
  };

  // Customer Complaint CRUD Handlers
  const handleCreateComplaint = (newComplaint: CustomerComplaint) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    persistChanges({ complaints: updated });
    showToast('Customer complaint logged');
  };

  const handleUpdateComplaint = (updatedComplaint: CustomerComplaint) => {
    const updated = complaints.map(c => c.id === updatedComplaint.id ? updatedComplaint : c);
    setComplaints(updated);
    persistChanges({ complaints: updated });
    showToast('Complaint updated!');
  };

  const handleDeleteComplaint = (complaintId: string) => {
    const updated = complaints.filter(c => c.id !== complaintId);
    setComplaints(updated);
    persistChanges({ complaints: updated });
    showToast('Complaint removed');
  };

  // Retailer Account CRUD Handlers
  const handleCreateRetailer = (newRetailer: RetailerAccount) => {
    const updated = [newRetailer, ...retailers];
    setRetailers(updated);
    persistChanges({ retailers: updated });
    showToast(`Retailer "${newRetailer.businessName}" added!`);
  };

  const handleUpdateRetailer = (updatedRetailer: RetailerAccount) => {
    const updated = retailers.map(r => r.id === updatedRetailer.id ? updatedRetailer : r);
    setRetailers(updated);
    persistChanges({ retailers: updated });
    showToast(`Retailer "${updatedRetailer.businessName}" updated!`);
  };

  const handleDeleteRetailer = (retailerId: string) => {
    const ret = retailers.find(r => r.id === retailerId);
    const updated = retailers.filter(r => r.id !== retailerId);
    setRetailers(updated);
    persistChanges({ retailers: updated });
    showToast(`Retailer "${ret?.businessName || retailerId}" removed`);
  };

  // Wholesale Invoice CRUD Handlers
  const handleCreateInvoice = (newInvoice: WholesaleInvoice) => {
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    persistChanges({ invoices: updated });
    showToast(`Invoice ${newInvoice.invoiceNumber} created!`);
  };

  const handleUpdateInvoice = (updatedInvoice: WholesaleInvoice) => {
    const updated = invoices.map(i => i.id === updatedInvoice.id ? updatedInvoice : i);
    setInvoices(updated);
    persistChanges({ invoices: updated });
    showToast(`Invoice ${updatedInvoice.invoiceNumber} updated!`);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    const updated = invoices.filter(i => i.id !== invoiceId);
    setInvoices(updated);
    persistChanges({ invoices: updated });
    showToast(`Invoice ${inv?.invoiceNumber || invoiceId} deleted`);
  };

  const handleRecordPayment = (invoiceId: string, amount: number) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    const updatedInvoices = invoices.map(i => {
      if (i.id === invoiceId) {
        const newPaid = i.paidAmount + amount;
        const newBalance = i.totalAmount - newPaid;
        return {
          ...i,
          paidAmount: newPaid,
          balance: Math.max(0, newBalance),
          status: newBalance <= 0 ? 'Paid' as const : 'Partially Paid' as const,
        };
      }
      return i;
    });
    setInvoices(updatedInvoices);

    if (invoice) {
      const updatedRetailers = retailers.map(r => {
        if (r.id === invoice.retailerId) {
          return { ...r, currentBalance: Math.max(0, r.currentBalance - amount) };
        }
        return r;
      });
      setRetailers(updatedRetailers);
      persistChanges({ invoices: updatedInvoices, retailers: updatedRetailers });
    } else {
      persistChanges({ invoices: updatedInvoices });
    }
    showToast(`Payment of KSh ${amount.toLocaleString()} recorded!`);
  };

  // If user is not logged in, render the isolated Login / Registration screen
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Badges & Counters
  const lowStockCount = rawMaterials.filter(r => r.currentStock <= r.minThreshold).length + 
                        products.filter(p => p.currentStock <= p.minStockLevel).length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FBF8F6] text-stone-800 flex font-sans selection:bg-[#006D77] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        onOpenWhatsAppCapture={() => setIsWhatsAppModalOpen(true)}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
        ordersCount={orders.length}
        lowStockCount={lowStockCount}
        unreadWhatsAppCount={2}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <TopBar
          currentPage={currentPage}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenWhatsAppCapture={() => setIsWhatsAppModalOpen(true)}
          onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
          onOpenSettings={() => setCurrentPage('settings')}
          ordersCount={orders.length}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Scrollable Page Content Container with overscroll-contain */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <main className="p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* Executive Overview Dashboard */}
            {currentPage === 'dashboard' && (
              <ExecutiveDashboard
                products={products}
                orders={orders}
                retailers={retailers}
                batches={batches}
              />
            )}

            {/* Sales Performance Overview */}
            {currentPage === 'sales-overview' && (
              <SalesDashboard
                orders={orders}
                products={products}
                customers={customers}
                onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
                onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
                onNavigateToTab={(tab) => {
                  if (tab === 'catalog') setCurrentPage('catalog');
                  else if (tab === 'orders') setCurrentPage('orders');
                }}
                onSelectOrder={(ord) => setSelectedOrderDetails(ord)}
              />
            )}

            {/* Orders Fulfillment Queue */}
            {currentPage === 'orders' && (
              <OrderList
                orders={orders}
                onViewOrderDetails={(order: Order) => setSelectedOrderDetails(order)}
                onOpenMpesaModal={(order: Order) => handleOpenMpesaModal(order)}
                onStatusChange={(orderId: string, status: OrderStatus) => handleUpdateOrderStatus(orderId, status)}
                onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
                onDeleteOrder={handleDeleteOrder}
                onUpdateOrder={handleUpdateOrder}
              />
            )}

            {/* Product Catalogue */}
            {currentPage === 'catalog' && (
              <ProductCatalog
                products={products}
                onQuickOrder={() => setIsNewOrderModalOpen(true)}
                onAddProduct={handleCreateProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            )}

            {/* Customer Master Directory */}
            {currentPage === 'customers' && (
              <CustomerList
                customers={customers}
                orders={orders}
                onOpenWhatsApp={(phone) => window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank')}
                onAddCustomer={handleCreateCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
              />
            )}

            {/* Inventory & Materials */}
            {currentPage === 'inventory' && (
              <InventoryOverview
                rawMaterials={rawMaterials}
                products={products}
                onNavigateToBatches={() => setCurrentPage('batches')}
                onAddRawMaterial={handleCreateRawMaterial}
                onUpdateRawMaterial={handleUpdateRawMaterial}
                onDeleteRawMaterial={handleDeleteRawMaterial}
              />
            )}

            {/* Production Batches & BOM */}
            {currentPage === 'batches' && (
              <ProductionBatches
                batches={batches}
                products={products}
                rawMaterials={rawMaterials}
                onCreateBatch={handleCreateBatch}
                onUpdateBatchStatus={handleUpdateBatchStatus}
                onUpdateBatch={handleUpdateBatch}
                onDeleteBatch={handleDeleteBatch}
              />
            )}

            {/* Supplier Master Records */}
            {currentPage === 'suppliers' && (
              <SuppliersList
                suppliers={suppliers}
                rawMaterials={rawMaterials}
                onAddSupplier={handleCreateSupplier}
                onUpdateSupplier={handleUpdateSupplier}
                onDeleteSupplier={handleDeleteSupplier}
              />
            )}

            {/* Quality & Compliance */}
            {currentPage === 'quality' && (
              <QualityDashboard
                qualityChecks={qualityChecks}
                complianceDocs={complianceDocs}
                complaints={complaints}
                onAddQualityCheck={handleCreateQualityCheck}
                onUpdateQualityCheck={handleUpdateQualityCheck}
                onDeleteQualityCheck={handleDeleteQualityCheck}
                onAddComplianceDoc={handleCreateComplianceDoc}
                onUpdateComplianceDoc={handleUpdateComplianceDoc}
                onDeleteComplianceDoc={handleDeleteComplianceDoc}
                onAddComplaint={handleCreateComplaint}
                onUpdateComplaint={handleUpdateComplaint}
                onDeleteComplaint={handleDeleteComplaint}
              />
            )}

            {/* Wholesale & Retailers Distribution */}
            {currentPage === 'wholesale' && (
              <WholesaleDashboard
                retailers={retailers}
                invoices={invoices}
                products={products}
                onAddRetailer={handleCreateRetailer}
                onUpdateRetailer={handleUpdateRetailer}
                onDeleteRetailer={handleDeleteRetailer}
                onCreateInvoice={handleCreateInvoice}
                onUpdateInvoice={handleUpdateInvoice}
                onDeleteInvoice={handleDeleteInvoice}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {/* Settings & Omnichannel Integrations */}
            {currentPage === 'settings' && (
              <SettingsPage
                settings={settings}
                incomingMessages={incomingMessages}
                products={products}
                currentUser={currentUser}
                onSaveSettings={handleSaveSettings}
                onUpdateMessages={handleUpdateMessages}
                onOpenWhatsAppCaptureWithMessage={handleOpenWhatsAppCaptureWithMessage}
                onShowToast={showToast}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <WhatsAppOrderCaptureModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setActiveMessageForIntake(null);
        }}
        products={products}
        onOrderCreated={(newOrder: Order) => handleSaveOrder(newOrder)}
        settings={settings}
        incomingMessages={incomingMessages}
        initialMessage={activeMessageForIntake}
        onNavigateToSettings={() => setCurrentPage('settings')}
        onFetchLatestMessages={() => {
          const newInbound = generateSimulatedWhatsAppInquiry(settings.whatsappNumber, products);
          const updated = [newInbound, ...incomingMessages];
          handleUpdateMessages(updated);
          showToast(`Fetched 1 new message sent to ${settings.whatsappNumber}!`);
        }}
      />

      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        products={products}
        onOrderCreated={(newOrder: Order) => handleSaveOrder(newOrder)}
      />

      <MpesaPaymentModal
        isOpen={isMpesaModalOpen}
        onClose={() => {
          setIsMpesaModalOpen(false);
          setSelectedOrderForMpesa(null);
        }}
        order={selectedOrderForMpesa}
        onPaymentConfirmed={(orderId: string, mpesaRef: string) => handleMpesaReconciled(orderId, mpesaRef)}
        settings={settings}
      />

      <OrderDetailsModal
        isOpen={!!selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
        order={selectedOrderDetails}
        onUpdateStatus={handleUpdateOrderStatus}
        onTriggerMpesa={(ord) => {
          setSelectedOrderDetails(null);
          handleOpenMpesaModal(ord);
        }}
      />
    </div>
  );
}
