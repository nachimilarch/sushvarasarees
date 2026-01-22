import { useState } from "react";
import {
  Package,
  Search,
  Plus,
  Plane,
  Truck,
  MapPin,
  Scale,
  Calendar,
  Receipt,
  Printer,
  Download,
  Eye,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AddCustomerModal } from "@/components/AddCustomerModal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  creditBalance: number;
}

interface Shipment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  awbNumber: string;
  bookingDate: string;
  deliveryType: "surface" | "air";
  fromLocation: string;
  toLocation: string;
  weight: number;
  charges: number;
  gst: number;
  totalAmount: number;
  paymentMode: "cash" | "credit" | "online";
  paidAmount: number;
  pendingAmount: number;
  status: "booked" | "in_transit" | "delivered";
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Lakshmi Devi", mobile: "9876543210", address: "123 Main Street, Hyderabad", creditBalance: 0 },
  { id: "2", name: "Priya Sharma", mobile: "9876543211", address: "456 Park Avenue, Secunderabad", creditBalance: 8200 },
  { id: "3", name: "Anjali Reddy", mobile: "9876543212", address: "789 Lake View, Kukatpally", creditBalance: 0 },
];

const initialShipments: Shipment[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "Lakshmi Devi",
    customerPhone: "9876543210",
    awbNumber: "AWB123456789",
    bookingDate: "2024-01-15",
    deliveryType: "air",
    fromLocation: "Hyderabad",
    toLocation: "Mumbai",
    weight: 2.5,
    charges: 450,
    gst: 81,
    totalAmount: 531,
    paymentMode: "cash",
    paidAmount: 531,
    pendingAmount: 0,
    status: "delivered",
  },
  {
    id: "2",
    customerId: "2",
    customerName: "Priya Sharma",
    customerPhone: "9876543211",
    awbNumber: "AWB987654321",
    bookingDate: "2024-01-16",
    deliveryType: "surface",
    fromLocation: "Hyderabad",
    toLocation: "Delhi",
    weight: 5,
    charges: 380,
    gst: 68,
    totalAmount: 448,
    paymentMode: "credit",
    paidAmount: 200,
    pendingAmount: 248,
    status: "in_transit",
  },
];

const DTDCBilling = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "credit" | "online">("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    awbNumber: "",
    bookingDate: new Date().toISOString().split("T")[0],
    deliveryType: "surface" as "surface" | "air",
    fromLocation: "Hyderabad",
    toLocation: "",
    weight: "",
    charges: "",
    gst: "",
  });

  const charges = parseFloat(formData.charges) || 0;
  const gst = parseFloat(formData.gst) || 0;
  const totalAmount = charges + gst;
  const paid = parseFloat(paidAmount) || 0;
  const pendingAmount = paymentMode === "cash" ? 0 : Math.max(0, totalAmount - paid);

  const handleCustomerAdded = (customer: Customer) => {
    setCustomers([...customers, customer]);
    setSelectedCustomer(customer.id);
  };

  const handleCreateShipment = () => {
    const customer = customers.find((c) => c.id === selectedCustomer);
    if (!customer) {
      toast({ title: "Select Customer", description: "Please select a customer.", variant: "destructive" });
      return;
    }
    if (!formData.awbNumber || !formData.toLocation || !formData.weight || !formData.charges) {
      toast({ title: "Missing Details", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const newShipment: Shipment = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.mobile,
      awbNumber: formData.awbNumber,
      bookingDate: formData.bookingDate,
      deliveryType: formData.deliveryType,
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      weight: parseFloat(formData.weight),
      charges,
      gst,
      totalAmount,
      paymentMode,
      paidAmount: paymentMode === "cash" ? totalAmount : paid,
      pendingAmount,
      status: "booked",
    };

    setShipments([newShipment, ...shipments]);
    toast({ title: "Shipment Created!", description: `AWB: ${formData.awbNumber}` });
    
    // Reset form
    setFormData({
      awbNumber: "",
      bookingDate: new Date().toISOString().split("T")[0],
      deliveryType: "surface",
      fromLocation: "Hyderabad",
      toLocation: "",
      weight: "",
      charges: "",
      gst: "",
    });
    setSelectedCustomer("");
    setPaidAmount("");
    setPaymentMode("cash");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge className="bg-blue-500/10 text-blue-600">Booked</Badge>;
      case "in_transit":
        return <Badge className="bg-amber-500/10 text-amber-600">In Transit</Badge>;
      case "delivered":
        return <Badge className="bg-green-500/10 text-green-600">Delivered</Badge>;
      default:
        return null;
    }
  };

  const customer = customers.find((c) => c.id === selectedCustomer);
  const filteredShipments = shipments.filter(
    (s) =>
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.awbNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPending = shipments.reduce((sum, s) => sum + s.pendingAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Package className="text-primary" />
          DTDC / Courier Billing
        </h1>
        <p className="text-muted-foreground mt-1">Manage courier shipments and charges</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Shipments</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">{shipments.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">In Transit</p>
          <p className="text-3xl font-display font-bold text-amber-600 mt-2">
            {shipments.filter((s) => s.status === "in_transit").length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Pending Amount</p>
          <p className="text-3xl font-display font-bold text-destructive mt-2">
            ₹{totalPending.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Shipment Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Selection */}
          <div className="glass-card rounded-xl p-5">
            <Label className="mb-3 block font-semibold">Select Customer</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger className="h-12">
                    <User size={18} className="mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} - {c.mobile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <AddCustomerModal
                onCustomerAdded={handleCustomerAdded}
                trigger={
                  <Button variant="outline" className="h-12 gap-2">
                    <Plus size={18} />
                    New
                  </Button>
                }
              />
            </div>
          </div>

          {/* Shipment Details */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <Label className="font-semibold text-lg">Shipment Details</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AWB / Consignment Number</Label>
                <Input
                  value={formData.awbNumber}
                  onChange={(e) => setFormData({ ...formData, awbNumber: e.target.value.toUpperCase() })}
                  placeholder="Enter AWB number"
                />
              </div>
              <div className="space-y-2">
                <Label>Booking Date</Label>
                <Input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Delivery Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.deliveryType === "surface" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, deliveryType: "surface" })}
                    className={`flex-1 ${formData.deliveryType === "surface" ? "btn-maroon" : ""}`}
                  >
                    <Truck size={18} className="mr-2" />
                    Surface
                  </Button>
                  <Button
                    type="button"
                    variant={formData.deliveryType === "air" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, deliveryType: "air" })}
                    className={`flex-1 ${formData.deliveryType === "air" ? "btn-maroon" : ""}`}
                  >
                    <Plane size={18} className="mr-2" />
                    Air
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="Enter weight"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin size={14} />
                  From Location
                </Label>
                <Input
                  value={formData.fromLocation}
                  onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                  placeholder="From city"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin size={14} />
                  To Location
                </Label>
                <Input
                  value={formData.toLocation}
                  onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                  placeholder="To city"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Courier Charges (₹)</Label>
                <Input
                  type="number"
                  value={formData.charges}
                  onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                  placeholder="Enter charges"
                />
              </div>
              <div className="space-y-2">
                <Label>GST (₹)</Label>
                <Input
                  type="number"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                  placeholder="Enter GST"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Actions */}
        <div className="glass-card rounded-xl p-5 h-fit sticky top-4">
          <h2 className="font-display font-semibold text-lg mb-4">Payment</h2>

          {/* Payment Mode */}
          <div className="space-y-3 mb-4">
            <Label className="font-semibold">Payment Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["cash", "credit", "online"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    paymentMode === mode
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {(paymentMode === "credit" || paymentMode === "online") && (
            <div className="space-y-2 mb-4">
              <Label>Paid Amount (₹)</Label>
              <Input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Enter amount paid"
                max={totalAmount}
              />
            </div>
          )}

          {/* Bill Summary */}
          <div className="space-y-2 py-4 border-t border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Charges</span>
              <span className="font-medium">₹{charges.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST</span>
              <span className="font-medium">₹{gst.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
            </div>
            {paymentMode !== "cash" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-medium text-green-600">₹{paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium text-destructive">₹{pendingAmount.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-4">
            <Button onClick={handleCreateShipment} className="w-full h-12 btn-maroon text-base">
              <Receipt size={18} className="mr-2" />
              Create Shipment
            </Button>
            {customer && (
              <WhatsAppButton
                phone={customer.mobile}
                customerName={customer.name}
                billAmount={totalAmount}
                paidAmount={paymentMode === "cash" ? totalAmount : paid}
                pendingAmount={pendingAmount}
                billType="dtdc"
                size="default"
                variant="outline"
              />
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-10">
                <Printer size={16} className="mr-2" />
                Print
              </Button>
              <Button variant="outline" className="h-10">
                <Download size={16} className="mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment History */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h3 className="font-display font-semibold text-lg">Shipment History</h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by AWB or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold">AWB Number</th>
                <th className="text-left p-3 font-semibold">Customer</th>
                <th className="text-left p-3 font-semibold">Route</th>
                <th className="text-left p-3 font-semibold">Type</th>
                <th className="text-right p-3 font-semibold">Amount</th>
                <th className="text-right p-3 font-semibold">Pending</th>
                <th className="text-center p-3 font-semibold">Status</th>
                <th className="text-center p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="p-3 font-mono">{shipment.awbNumber}</td>
                  <td className="p-3">{shipment.customerName}</td>
                  <td className="p-3">{shipment.fromLocation} → {shipment.toLocation}</td>
                  <td className="p-3">
                    {shipment.deliveryType === "air" ? (
                      <span className="flex items-center gap-1"><Plane size={14} /> Air</span>
                    ) : (
                      <span className="flex items-center gap-1"><Truck size={14} /> Surface</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-medium">₹{shipment.totalAmount.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className={shipment.pendingAmount > 0 ? "text-destructive font-medium" : "text-green-600"}>
                      ₹{shipment.pendingAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3 text-center">{getStatusBadge(shipment.status)}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye size={16} />
                      </Button>
                      <WhatsAppButton
                        phone={shipment.customerPhone}
                        customerName={shipment.customerName}
                        billAmount={shipment.totalAmount}
                        paidAmount={shipment.paidAmount}
                        pendingAmount={shipment.pendingAmount}
                        billType="dtdc"
                        size="icon"
                        variant="ghost"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DTDCBilling;
