import React from 'react';
import { 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Users, 
  Boxes, 
  Layers, 
  Building2, 
  ShieldCheck, 
  Truck, 
  MessageSquare, 
  Plus, 
  Leaf, 
  TrendingUp, 
  CheckCircle2, 
  Smartphone,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Settings
} from 'lucide-react';
import { AppUser } from '../services/authService';

export type NavigationPage = 
  | 'dashboard'
  | 'orders'
  | 'sales-overview'
  | 'catalog'
  | 'customers'
  | 'inventory'
  | 'batches'
  | 'suppliers'
  | 'quality'
  | 'wholesale'
  | 'settings';

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  count?: number;
  alert?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  currentPage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
  onOpenWhatsAppCapture: () => void;
  onOpenNewOrder: () => void;
  ordersCount: number;
  lowStockCount: number;
  unreadWhatsAppCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentUser?: AppUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  onOpenWhatsAppCapture,
  onOpenNewOrder,
  ordersCount,
  lowStockCount,
  unreadWhatsAppCount = 2,
  isOpenMobile,
  onCloseMobile,
  currentUser,
  onLogout,
}) => {
  const navSections: NavSection[] = [
    {
      title: 'Management & Overview',
      items: [
        {
          id: 'dashboard' as NavigationPage,
          label: 'Executive Dashboard',
          icon: BarChart3,
          badge: 'Owner Cockpit',
          badgeColor: 'bg-[#D4A373]/20 text-[#B58455]',
        },
        {
          id: 'sales-overview' as NavigationPage,
          label: 'Sales Performance',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'Sales & Commerce',
      items: [
        {
          id: 'orders' as NavigationPage,
          label: 'Orders Queue',
          icon: ShoppingCart,
          count: ordersCount,
        },
        {
          id: 'catalog' as NavigationPage,
          label: 'Product Catalogue',
          icon: Package,
        },
        {
          id: 'customers' as NavigationPage,
          label: 'Customer Directory',
          icon: Users,
        },
      ],
    },
    {
      title: 'Operations & Production',
      items: [
        {
          id: 'inventory' as NavigationPage,
          label: 'Inventory & Stock',
          icon: Layers,
          alert: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
        },
        {
          id: 'batches' as NavigationPage,
          label: 'Production Batches',
          icon: Boxes,
        },
        {
          id: 'suppliers' as NavigationPage,
          label: 'Supplier Records',
          icon: Building2,
        },
      ],
    },
    {
      title: 'Quality & Distribution',
      items: [
        {
          id: 'quality' as NavigationPage,
          label: 'Quality & Compliance',
          icon: ShieldCheck,
          badge: 'KEBS Logs',
          badgeColor: 'bg-emerald-50 text-emerald-800',
        },
        {
          id: 'wholesale' as NavigationPage,
          label: 'Wholesale & Retailers',
          icon: Truck,
          badge: 'B2B Chains',
          badgeColor: 'bg-[#006D77]/10 text-[#006D77]',
        },
      ],
    },
    {
      title: 'Integrations & System',
      items: [
        {
          id: 'settings' as NavigationPage,
          label: 'Settings & Integrations',
          icon: Settings,
          badge: 'WhatsApp • M-PESA',
          badgeColor: 'bg-[#25D366]/20 text-[#D4A373]',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#004D54] text-white flex flex-col justify-between
        transition-transform duration-300 ease-in-out border-r border-[#00383D] shadow-xl
        lg:static lg:h-full lg:shrink-0 lg:translate-x-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 bg-[#004349] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006D77] flex items-center justify-center text-[#F3E1DD] shadow-md ring-2 ring-[#D4A373]/30">
                <Leaf className="w-5 h-5 text-[#F3E1DD]" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-white leading-tight tracking-tight">
                  Highland Gardens
                </h1>
                <p className="text-[11px] text-[#D4A373] font-medium tracking-wide">
                  Food Production & Commerce
                </p>
              </div>
            </div>

            <button 
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-white/10 text-stone-300 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Intake Actions in Sidebar */}
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenWhatsAppCapture();
                onCloseMobile();
              }}
              className="py-2 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Parse incoming WhatsApp order"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
              {unreadWhatsAppCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {unreadWhatsAppCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onOpenNewOrder();
                onCloseMobile();
              }}
              className="py-2 px-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B58455] text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* Scrollable Navigation List with overscroll-contain */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400/90 px-3 block mb-1">
                {section.title}
              </span>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectPage(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-[#006D77] text-white shadow-sm ring-1 ring-white/20 font-semibold'
                        : 'text-stone-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#D4A373]' : 'text-stone-400 group-hover:text-stone-200'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.count !== undefined && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-stone-300'
                        }`}>
                          {item.count}
                        </span>
                      )}

                      {item.alert && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/25 text-amber-200 border border-amber-400/30 font-semibold">
                          {item.alert}
                        </span>
                      )}

                      {item.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${item.badgeColor || 'bg-white/10 text-stone-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info: User Account, Location & Connectivity */}
        <div className="p-3.5 border-t border-white/10 bg-[#004349] text-xs space-y-2.5 shrink-0">
          {currentUser && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-xs"
                  style={{ backgroundColor: currentUser.avatarColor || '#006D77' }}
                >
                  {currentUser.avatarInitials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-[11px] leading-tight truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono leading-tight truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-stone-300">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              M-PESA Daraja Online
            </span>
            <span className="text-[10px] font-mono text-[#D4A373]">
              Nairobi, KE
            </span>
          </div>

          <div className="text-[10px] text-stone-400 leading-tight">
            Highland Gardens System • Operations Engine
          </div>
        </div>
      </aside>
    </>
  );
};
