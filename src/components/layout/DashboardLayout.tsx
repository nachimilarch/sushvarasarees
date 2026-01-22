import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  Truck,
  Factory,
  BarChart3,
  LogOut,
  Menu,
  X,
  Paintbrush,
  Stamp,
  Wallet,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.jpg";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Inventory", icon: Package, path: "/dashboard/inventory" },
  { label: "Customers", icon: Users, path: "/dashboard/customers" },
  { label: "Retail Billing", icon: Receipt, path: "/dashboard/billing" },
  { label: "WhatsApp Orders", icon: MessageCircle, path: "/dashboard/whatsapp-orders" },
  { label: "DTDC Billing", icon: Truck, path: "/dashboard/dtdc" },
  { label: "Vendors", icon: Truck, path: "/dashboard/vendors" },
  { label: "Production", icon: Factory, path: "/dashboard/production" },
];

const serviceItems: NavItem[] = [
  { label: "Saree Dyeing", icon: Paintbrush, path: "/dashboard/saree-dyeing" },
  { label: "Saree Printing", icon: Stamp, path: "/dashboard/saree-printing" },
];

const managementItems: NavItem[] = [
  { label: "Staff Salaries", icon: Wallet, path: "/dashboard/salaries" },
  { label: "Returns / Exchange", icon: RotateCcw, path: "/dashboard/returns" },
  { label: "Reports", icon: BarChart3, path: "/dashboard/reports" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const NavButton = ({ item }: { item: NavItem }) => (
    <button
      onClick={() => {
        navigate(item.path);
        setSidebarOpen(false);
      }}
      className={cn(
        "nav-link w-full",
        isActive(item.path) && "nav-link-active"
      )}
    >
      <item.icon size={20} />
      <span>{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ================= MOBILE HEADER ================= */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-primary shadow-elevated flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Sarees By Srii"
            className="w-10 h-10 rounded-full bg-white p-1 object-contain"
          />
          <div>
            <p className="font-display font-semibold text-primary-foreground">
              Sarees By Srii
            </p>
            <p className="text-xs text-primary-foreground/70">
              Indian Ethnic Wear
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-primary-foreground hover:bg-sidebar-accent"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-72 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Sarees By Srii"
              className="w-12 h-12 rounded-full bg-white p-1 object-contain"
            />
            <div>
              <h1 className="font-display font-bold text-primary-foreground text-lg">
                Sarees By Srii
              </h1>
              <p className="text-xs text-primary-foreground/70">
                Indian Ethnic Wear
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider">
              Services
            </p>
          </div>
          {serviceItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider">
              Management
            </p>
          </div>
          {managementItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-sidebar-accent"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
