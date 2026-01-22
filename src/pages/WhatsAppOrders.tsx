import { useState } from "react";
import {
  MessageCircle,
  Search,
  Plus,
  Calendar,
  User,
  Package,
  IndianRupee,
  Eye,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface WhatsAppOrder {
  id: string;
  orderNo: string;
  dayNumber: number;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  advancePaid: number;
  pendingAmount: number;
  shippingAddress: string;
  status: "new" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  notes: string;
  createdAt: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Generate order number based on date and sequence
const generateOrderNo = (date: string, sequence: number) => {
  const d = new Date(date);
  const year = d.getFullYear().toString().slice(-2);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `WA${year}${month}${day}-${sequence.toString().padStart(4, "0")}`;
};

// Calculate day number from start date
const calculateDayNumber = (startDate: string, orderDate: string) => {
  const start = new Date(startDate);
  const order = new Date(orderDate);
  const diffTime = Math.abs(order.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

const START_DATE = "2024-01-01"; // Business start date

const initialOrders: WhatsAppOrder[] = [
  {
    id: "1",
    orderNo: "WA240115-0001",
    dayNumber: 15,
    customerName: "Lakshmi Devi",
    customerPhone: "9876543210",
    orderDate: "2024-01-15",
    items: [
      { id: "1", name: "Kanjeevaram Silk Saree", quantity: 1, price: 5500 },
      { id: "2", name: "Cotton Kurti", quantity: 2, price: 850 },
    ],
    totalAmount: 7200,
    advancePaid: 2000,
    pendingAmount: 5200,
    shippingAddress: "123 Main Street, Hyderabad, Telangana 500001",
    status: "shipped",
    notes: "Express delivery requested",
    createdAt: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    orderNo: "WA240116-0001",
    dayNumber: 16,
    customerName: "Priya Sharma",
    customerPhone: "9876543211",
    orderDate: "2024-01-16",
    items: [
      { id: "3", name: "Banarasi Silk Saree", quantity: 2, price: 4500 },
    ],
    totalAmount: 9000,
    advancePaid: 9000,
    pendingAmount: 0,
    shippingAddress: "456 Park Avenue, Mumbai, Maharashtra 400001",
    status: "delivered",
    notes: "Gift wrapping needed",
    createdAt: "2024-01-16T14:15:00",
  },
  {
    id: "3",
    orderNo: "WA240116-0002",
    dayNumber: 16,
    customerName: "Anjali Reddy",
    customerPhone: "9876543212",
    orderDate: "2024-01-16",
    items: [
      { id: "4", name: "Designer Anarkali", quantity: 1, price: 2200 },
      { id: "5", name: "Palazzo Suit Set", quantity: 1, price: 1800 },
    ],
    totalAmount: 4000,
    advancePaid: 1000,
    pendingAmount: 3000,
    shippingAddress: "789 Lake View, Bangalore, Karnataka 560001",
    status: "confirmed",
    notes: "",
    createdAt: "2024-01-16T16:45:00",
  },
];

const products = [
  { id: "1", name: "Kanjeevaram Silk Saree", price: 5500 },
  { id: "2", name: "Banarasi Silk Saree", price: 4500 },
  { id: "3", name: "Cotton Kurti", price: 850 },
  { id: "4", name: "Designer Anarkali", price: 2200 },
  { id: "5", name: "Churidar Suit Set", price: 1500 },
  { id: "6", name: "Palazzo Suit Set", price: 1800 },
  { id: "7", name: "Pure Cotton Fabric (per m)", price: 200 },
  { id: "8", name: "Silk Fabric (per m)", price: 550 },
];

const WhatsAppOrders = () => {
  const [orders, setOrders] = useState<WhatsAppOrder[]>(initialOrders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dayFilter, setDayFilter] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    notes: "",
    advancePaid: "",
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const addItemToOrder = (product: typeof products[0]) => {
    const existing = orderItems.find((item) => item.name === product.name);
    if (existing) {
      setOrderItems(orderItems.map((item) =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { 
        id: Date.now().toString(), 
        name: product.name, 
        quantity: 1, 
        price: product.price 
      }]);
    }
  };

  const removeItemFromOrder = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    setOrderItems(orderItems.map((item) => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const orderTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const advancePaid = parseFloat(formData.advancePaid) || 0;
  const pendingAmount = orderTotal - advancePaid;

  const handleCreateOrder = () => {
    if (!formData.customerName || !formData.customerPhone || orderItems.length === 0) {
      toast({ title: "Missing Details", description: "Please fill customer details and add items.", variant: "destructive" });
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((o) => o.orderDate === today);
    const sequence = todayOrders.length + 1;
    const dayNumber = calculateDayNumber(START_DATE, today);

    const newOrder: WhatsAppOrder = {
      id: Date.now().toString(),
      orderNo: generateOrderNo(today, sequence),
      dayNumber,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      orderDate: today,
      items: orderItems,
      totalAmount: orderTotal,
      advancePaid,
      pendingAmount,
      shippingAddress: formData.shippingAddress,
      status: "new",
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    setFormData({ customerName: "", customerPhone: "", shippingAddress: "", notes: "", advancePaid: "" });
    setOrderItems([]);
    setIsAddDialogOpen(false);
    toast({ title: "Order Created!", description: `Order ${newOrder.orderNo} (Day ${dayNumber}) created successfully.` });
  };

  const updateOrderStatus = (orderId: string, newStatus: WhatsAppOrder["status"]) => {
    setOrders(orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({ title: "Status Updated", description: `Order status changed to ${newStatus}.` });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      new: "bg-blue-500/10 text-blue-600",
      confirmed: "bg-purple-500/10 text-purple-600",
      packed: "bg-amber-500/10 text-amber-600",
      shipped: "bg-cyan-500/10 text-cyan-600",
      delivered: "bg-green-500/10 text-green-600",
      cancelled: "bg-destructive/10 text-destructive",
    };
    return <Badge className={statusStyles[status] || ""}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  // Get unique days for filtering
  const uniqueDays = [...new Set(orders.map((o) => o.dayNumber))].sort((a, b) => b - a);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDay = dayFilter === "all" || order.dayNumber.toString() === dayFilter;
    return matchesSearch && matchesStatus && matchesDay;
  });

  // Group orders by day
  const ordersByDay = filteredOrders.reduce((acc, order) => {
    const day = order.dayNumber;
    if (!acc[day]) acc[day] = [];
    acc[day].push(order);
    return acc;
  }, {} as Record<number, WhatsAppOrder[]>);

  const sortedDays = Object.keys(ordersByDay).map(Number).sort((a, b) => b - a);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPending = orders.reduce((sum, o) => sum + o.pendingAmount, 0);
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <MessageCircle className="text-green-600" />
            WhatsApp Online Orders
          </h1>
          <p className="text-muted-foreground mt-1">Track and manage all WhatsApp orders day by day</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold">
              <Plus size={18} className="mr-2" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Create WhatsApp Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Shipping Address</Label>
                <Textarea
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Enter complete shipping address..."
                  rows={2}
                />
              </div>

              {/* Product Selection */}
              <div className="space-y-2">
                <Label>Add Products *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-secondary/30 rounded-lg">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addItemToOrder(product)}
                      className="p-3 rounded-lg bg-background hover:bg-secondary border border-border transition-all text-left"
                    >
                      <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                      <p className="text-accent font-semibold text-sm">₹{product.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Items */}
              {orderItems.length > 0 && (
                <div className="space-y-2">
                  <Label>Order Items</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateItemQuantity(item.id, -1)}>
                            -
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateItemQuantity(item.id, 1)}>
                            +
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItemFromOrder(item.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Advance Paid (₹)</Label>
                  <Input
                    type="number"
                    value={formData.advancePaid}
                    onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                    placeholder="Enter advance amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Special instructions..."
                  />
                </div>
              </div>

              {/* Order Summary */}
              {orderItems.length > 0 && (
                <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium">{orderItems.reduce((sum, i) => sum + i.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold">₹{orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Advance Paid</span>
                    <span className="font-medium text-green-600">₹{advancePaid.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Pending</span>
                    <span className={`font-bold ${pendingAmount > 0 ? "text-destructive" : "text-green-600"}`}>
                      ₹{pendingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <Button onClick={handleCreateOrder} className="w-full h-12 btn-maroon">
                <MessageCircle size={18} className="mr-2" />
                Create Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Orders</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">{totalOrders}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Revenue</p>
          <p className="text-3xl font-display font-bold text-accent mt-2">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Pending Amount</p>
          <p className="text-3xl font-display font-bold text-destructive mt-2">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Delivered</p>
          <p className="text-3xl font-display font-bold text-green-600 mt-2">{deliveredCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search by name, phone, or order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <Calendar size={16} className="mr-2" />
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            {uniqueDays.map((day) => (
              <SelectItem key={day} value={day.toString()}>Day {day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="packed">Packed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      {/* Orders Grouped by Day */}
      <div className="space-y-6">
        {sortedDays.map((day) => (
          <div key={day} className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-base px-4 py-1 bg-primary/10 text-primary">
                Day {day}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {ordersByDay[day].length} order{ordersByDay[day].length > 1 ? "s" : ""}
              </span>
              <Separator className="flex-1" />
            </div>
            
            <div className="space-y-3">
              {ordersByDay[day].map((order) => (
                <div key={order.id} className="glass-card rounded-xl p-5 hover:shadow-elevated transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">{order.orderNo}</span>
                        {getStatusBadge(order.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg">{order.customerName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{order.customerPhone}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {order.items.map((item, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {item.name} ×{item.quantity}
                          </Badge>
                        ))}
                      </div>
                      {order.shippingAddress && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          📍 {order.shippingAddress}
                        </p>
                      )}
                      {order.notes && (
                        <p className="text-sm text-amber-600 mt-1">📝 {order.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-semibold text-lg">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Paid</p>
                        <p className="font-semibold text-green-600">₹{order.advancePaid.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className={`font-semibold ${order.pendingAmount > 0 ? "text-destructive" : "text-green-600"}`}>
                          ₹{order.pendingAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as WhatsAppOrder["status"])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="packed">Packed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <WhatsAppButton
                          phone={order.customerPhone}
                          customerName={order.customerName}
                          billAmount={order.totalAmount}
                          paidAmount={order.advancePaid}
                          pendingAmount={order.pendingAmount}
                          billType="retail"
                          size="icon"
                          variant="outline"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppOrders;
