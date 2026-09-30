import React, { useState } from 'react';
import { 
  Menu, 
  MessageSquare, 
  Plus, 
  LogOut, 
  User, 
  ChevronDown,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { NavigationPage } from './Sidebar';
import { AppUser } from '../services/authService';

interface TopBarProps {
  currentPage: NavigationPage;
  onOpenMobileSidebar: () => void;
  onOpenWhatsAppCapture: () => void;
  onOpenNewOrder: () => void;
  onOpenSettings?: () => void;
  ordersCount: number;
  currentUser: AppUser | null;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onOpenMobileSidebar,
  onOpenWhatsAppCapture,
  onOpenNewOrder,
  onOpenSettings,
  ordersCount,
  currentUser,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pageTitles: Record<NavigationPage, { title: string; subtitle: string }> = {
    'dashboard': {
      title: 'Executive Business Dashboard',
      subtitle: 'Real-time sales, order velocity, inventory health, and management reporting',
    },
    'sales-overview': {
      title: 'Sales & Intake Overview',
      subtitle: 'Daily order performance across WhatsApp, website, direct, and retail channels',
    },
    'orders': {
      title: 'Orders Fulfillment Queue',
      subtitle: 'Live order intake, M-PESA payment verification, and dispatch tracking',
    },
    'catalog': {
      title: 'Product Catalogue & Inventory Pricing',
      subtitle: 'Retail & wholesale pricing, gross margins, and finished goods stock levels',
    },
    'customers': {
      title: 'Customer Master Directory',
      subtitle: 'Consolidated customer accounts, lifetime spend, order history, and WhatsApp links',
    },
    'inventory': {
      title: 'Inventory & Materials Management',
      subtitle: 'Raw botanicals, packaging materials, finished stock, and automated reorder alerts',
    },
    'batches': {
      title: 'Production Batches & Traceability',
      subtitle: 'Batch lot tracking, bill-of-materials deductions, and expiry scheduling',
    },
    'suppliers': {
      title: 'Supplier Master Records',
      subtitle: 'Cooperative sourcing partners, packaging suppliers, and restocking logs',
    },
    'quality': {
      title: 'Quality Control & Operational Records',
      subtitle: 'Batch release tests (moisture, brix, seals), KEBS audit logs, and CAPA complaints',
    },
    'wholesale': {
      title: 'Wholesale & Retailer Distribution',
      subtitle: 'Supermarket chain accounts, Net credit terms, invoices, and territory routes',
    },
    'settings': {
      title: 'Settings & Integrations Hub',
      subtitle: 'Manage connected WhatsApp business number, Safaricom Daraja M-PESA Till, and inbound message streams',
    },
  };

  const currentInfo = pageTitles[currentPage] || { title: 'Highland Gardens', subtitle: '' };

  return (
    <header className="shrink-0 bg-white border-b border-stone-200/90 px-3 sm:px-6 py-3 shadow-2xs">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onOpenMobileSidebar}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 lg:hidden transition-colors shrink-0"
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h2 className="font-serif font-bold text-base sm:text-xl text-stone-900 leading-tight truncate">
                {currentInfo.title}
              </h2>
              <p className="text-xs text-stone-500 hidden md:block mt-0.5 truncate">
                {currentInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Quick Actions & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenWhatsAppCapture}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Capture WhatsApp order"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
            </button>

            <button
              onClick={onOpenNewOrder}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">New Order</span>
            </button>

            {/* User Profile Pill & Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all text-left"
                >
                  <div 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs"
                    style={{ backgroundColor: currentUser.avatarColor || '#006D77' }}
                  >
                    {currentUser.avatarInitials}
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-xs font-semibold text-stone-900 block leading-tight max-w-[120px] truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-stone-500 block leading-tight truncate">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono truncate">
                          {currentUser.email}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Isolated Account Store
                        </div>
                      </div>

                      {onOpenSettings && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenSettings();
                          }}
                          className="w-full flex items-center gap-2 p-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4 text-stone-500" />
                          <span>Settings & Gateways</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 p-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out / Switch User</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
  );
};
