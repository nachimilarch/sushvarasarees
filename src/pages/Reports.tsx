import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  IndianRupee,
  Users,
  Package,
  Factory,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const salesData = [
  { name: "Mon", sales: 24500, credit: 8200 },
  { name: "Tue", sales: 32000, credit: 5500 },
  { name: "Wed", sales: 28000, credit: 12000 },
  { name: "Thu", sales: 41000, credit: 3200 },
  { name: "Fri", sales: 35500, credit: 9800 },
  { name: "Sat", sales: 52000, credit: 15000 },
  { name: "Sun", sales: 18000, credit: 2500 },
];

const productionData = [
  { name: "Week 1", sarees: 145, dresses: 62 },
  { name: "Week 2", sarees: 168, dresses: 78 },
  { name: "Week 3", sarees: 156, dresses: 65 },
  { name: "Week 4", sarees: 189, dresses: 82 },
];

const Reports = () => {
  const [period, setPeriod] = useState("week");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive business insights
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-accent mb-2">
            <IndianRupee size={20} />
            <span className="text-sm font-medium">Total Sales</span>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-foreground">₹2,31,000</p>
          <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
            <TrendingUp size={14} />
            <span>+12% from last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">Credit Outstanding</span>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-foreground">₹56,200</p>
          <p className="text-sm text-muted-foreground mt-2">18 customers</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-peacock mb-2">
            <Package size={20} />
            <span className="text-sm font-medium">Items Sold</span>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-foreground">324</p>
          <p className="text-sm text-muted-foreground mt-2">Across all categories</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Factory size={20} />
            <span className="text-sm font-medium">Production</span>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-foreground">658</p>
          <p className="text-sm text-muted-foreground mt-2">Sarees & Dresses</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg">Sales Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Credit</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(350, 65%, 25%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(350, 65%, 25%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 88%)" />
                <XAxis dataKey="name" stroke="hsl(0, 15%, 45%)" fontSize={12} />
                <YAxis stroke="hsl(0, 15%, 45%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(30, 20%, 99%)",
                    border: "1px solid hsl(30, 20%, 88%)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="sales" stroke="hsl(350, 65%, 25%)" fill="url(#salesGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="credit" stroke="hsl(0, 72%, 51%)" fill="url(#creditGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production Chart */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg">Production Report</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Sarees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-peacock" />
                <span className="text-muted-foreground">Dresses</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 88%)" />
                <XAxis dataKey="name" stroke="hsl(0, 15%, 45%)" fontSize={12} />
                <YAxis stroke="hsl(0, 15%, 45%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(30, 20%, 99%)",
                    border: "1px solid hsl(30, 20%, 88%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sarees" fill="hsl(43, 85%, 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dresses" fill="hsl(175, 55%, 35%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-4">Top Customers</h3>
          <div className="space-y-4">
            {[
              { name: "Meera Nair", purchases: "₹2,30,000", orders: 45 },
              { name: "Anjali Reddy", purchases: "₹1,25,000", orders: 32 },
              { name: "Kavitha Pillai", purchases: "₹89,000", orders: 28 },
              { name: "Priya Sharma", purchases: "₹78,000", orders: 24 },
              { name: "Sunita Rao", purchases: "₹56,000", orders: 18 },
            ].map((customer, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                  </div>
                </div>
                <p className="font-semibold text-accent">{customer.purchases}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-4">Best Selling Products</h3>
          <div className="space-y-4">
            {[
              { name: "Kanjeevaram Silk Saree", sold: 145, revenue: "₹7,97,500" },
              { name: "Banarasi Silk Saree", sold: 98, revenue: "₹4,41,000" },
              { name: "Churidar Suit Set", sold: 156, revenue: "₹2,34,000" },
              { name: "Cotton Kurti", sold: 210, revenue: "₹1,78,500" },
              { name: "Designer Anarkali", sold: 52, revenue: "₹1,14,400" },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sold} sold</p>
                  </div>
                </div>
                <p className="font-semibold text-foreground">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
