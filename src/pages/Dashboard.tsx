import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Package,
  Users,
  Factory,
  ArrowRight,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  accentColor?: "gold" | "maroon" | "peacock";
}

const StatCard = ({ title, value, subValue, icon: Icon, trend, trendValue, accentColor = "maroon" }: StatCardProps) => {
  const accentClasses = {
    gold: "bg-accent/10 text-accent",
    maroon: "bg-primary/10 text-primary",
    peacock: "bg-peacock/10 text-peacock",
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentClasses[accentColor]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-destructive"}`}>
            {trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{value}</p>
      {subValue && <p className="text-sm text-muted-foreground mt-1">{subValue}</p>}
    </div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}

const QuickAction = ({ title, description, icon: Icon, onClick }: QuickActionProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-200 text-left w-full group"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <ArrowRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
  </button>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Good Morning! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/dashboard/billing")} className="btn-gold">
            <ShoppingBag size={18} className="mr-2" />
            New Sale
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Today's Sales"
          value="₹24,500"
          subValue="12 transactions"
          icon={IndianRupee}
          trend="up"
          trendValue="12%"
          accentColor="gold"
        />
        <StatCard
          title="Credit Outstanding"
          value="₹1,45,000"
          subValue="18 customers"
          icon={CreditCard}
          accentColor="maroon"
        />
        <StatCard
          title="Stock Items"
          value="1,248"
          subValue="Low stock: 15"
          icon={Package}
          accentColor="peacock"
        />
        <StatCard
          title="Today's Production"
          value="45"
          subValue="Sarees: 30, Dresses: 15"
          icon={Factory}
          trend="up"
          trendValue="8%"
          accentColor="gold"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <QuickAction
              title="New Retail Bill"
              description="Create a new customer bill"
              icon={ShoppingBag}
              onClick={() => navigate("/dashboard/billing")}
            />
            <QuickAction
              title="Add Customer"
              description="Register a new customer"
              icon={Users}
              onClick={() => navigate("/dashboard/customers")}
            />
            <QuickAction
              title="Add Stock"
              description="Update inventory items"
              icon={Package}
              onClick={() => navigate("/dashboard/inventory")}
            />
            <QuickAction
              title="Production Entry"
              description="Log today's production"
              icon={Factory}
              onClick={() => navigate("/dashboard/production")}
            />
          </div>
        </div>

        {/* Recent Sales */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-foreground">
              Recent Sales
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/billing")}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { customer: "Lakshmi Devi", amount: "₹3,500", items: "2 Sarees", time: "10 mins ago", status: "paid" },
              { customer: "Priya Sharma", amount: "₹8,200", items: "1 Suit Set, 3 Fabrics", time: "25 mins ago", status: "credit" },
              { customer: "Anjali Reddy", amount: "₹5,100", items: "1 Saree, 1 Dress", time: "1 hour ago", status: "paid" },
              { customer: "Meera Nair", amount: "₹12,000", items: "4 Sarees", time: "2 hours ago", status: "partial" },
            ].map((sale, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {sale.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{sale.customer}</p>
                    <p className="text-sm text-muted-foreground">{sale.items}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{sale.amount}</p>
                  <p className={`text-xs ${
                    sale.status === "paid" ? "text-green-600" : 
                    sale.status === "credit" ? "text-destructive" : "text-accent"
                  }`}>
                    {sale.status === "paid" ? "Paid" : sale.status === "credit" ? "Credit" : "Partial"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production Summary */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-foreground">
            Sarees by Srii Production Summary
          </h2>
          <Button variant="outline" onClick={() => navigate("/dashboard/production")}>
            View Details
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-display font-bold text-foreground">156</p>
            <p className="text-sm text-muted-foreground mt-1">Sarees Made (Week)</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-display font-bold text-foreground">42</p>
            <p className="text-sm text-muted-foreground mt-1">At Rolling</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-display font-bold text-foreground">89</p>
            <p className="text-sm text-muted-foreground mt-1">In Store</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-display font-bold text-foreground">65</p>
            <p className="text-sm text-muted-foreground mt-1">Dresses Made</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
