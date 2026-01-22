import { useState, useRef } from "react";
import {
  Plus,
  Search,
  Minus,
  Trash2,
  ShoppingBag,
  User,
  IndianRupee,
  Receipt,
  Printer,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AddCustomerModal } from "@/components/AddCustomerModal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BillPreview, BillItem } from "@/components/BillPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  mobile: string;
  creditBalance: number;
}

interface GeneratedBill {
  billNo: string;
  date: Date;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  subTotal: number;
  discount: number;
  total: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMode: string;
  dueDate?: Date;
}

const products = [
  { id: "1", name: "Kanjeevaram Silk Saree", price: 5500 },
  { id: "2", name: "Banarasi Silk Saree", price: 4500 },
  { id: "3", name: "Cotton Kurti", price: 850 },
  { id: "4", name: "Designer Anarkali", price: 2200 },
  { id: "5", name: "Pure Cotton Fabric (per m)", price: 200 },
  { id: "6", name: "Silk Fabric (per m)", price: 550 },
  { id: "7", name: "Churidar Suit Set", price: 1500 },
  { id: "8", name: "Palazzo Suit Set", price: 1800 },
];

const initialCustomers: Customer[] = [
  { id: "1", name: "Lakshmi Devi", mobile: "9876543210", creditBalance: 0 },
  { id: "2", name: "Priya Sharma", mobile: "9876543211", creditBalance: 8200 },
  { id: "3", name: "Anjali Reddy", mobile: "9876543212", creditBalance: 0 },
  { id: "4", name: "Meera Nair", mobile: "9876543213", creditBalance: 15000 },
  { id: "5", name: "Walk-in Customer", mobile: "", creditBalance: 0 },
];

// Bill number tracking - would be stored in database in real app
let billSequence = 1234;
const getBillNumber = () => {
  billSequence++;
  return billSequence.toString();
};

const Billing = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "credit" | "partial">("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBill, setGeneratedBill] = useState<GeneratedBill | null>(null);
  const billRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.mobile.includes(searchCustomer)
  );

  const addToCart = (product: typeof products[0]) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = parseFloat(discount) || 0;
  const total = subtotal - discountAmount;
  const paid = paymentMode === "cash" ? total : paymentMode === "credit" ? 0 : (parseFloat(paidAmount) || 0);
  const pending = total - paid;

  const handleCustomerAdded = (customer: Customer & { address?: string }) => {
    const newCustomer: Customer = {
      id: customer.id,
      name: customer.name,
      mobile: customer.mobile,
      creditBalance: 0,
    };
    setCustomers([...customers, newCustomer]);
    setSelectedCustomer(newCustomer.id);
  };

  const handleCheckout = () => {
    if (!selectedCustomer) {
      toast({ title: "Select Customer", description: "Please select a customer to proceed.", variant: "destructive" });
      return;
    }
    if (cart.length === 0) {
      toast({ title: "Empty Cart", description: "Please add items to cart.", variant: "destructive" });
      return;
    }
    if (paymentMode === "partial" && paid > total) {
      toast({ title: "Invalid Amount", description: "Paid amount cannot exceed total.", variant: "destructive" });
      return;
    }

    const customer = customers.find((c) => c.id === selectedCustomer);
    if (!customer) return;

    // Generate bill
    const billNo = getBillNumber();
    const billItems: BillItem[] = cart.map((item) => ({
      name: item.name.length > 12 ? item.name.substring(0, 12) : item.name,
      quantity: item.quantity,
      rate: item.price,
      amount: item.price * item.quantity,
    }));

    const dueDate = pending > 0 ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) : undefined;

    const bill: GeneratedBill = {
      billNo,
      date: new Date(),
      customerName: customer.name,
      customerPhone: customer.mobile || "N/A",
      items: billItems,
      subTotal: subtotal,
      discount: discountAmount,
      total,
      paidAmount: paid,
      balanceAmount: pending,
      paymentMode: paymentMode === "cash" ? "Cash" : paymentMode === "credit" ? "Credit" : "Cash / UPI / Credit",
      dueDate,
    };

    setGeneratedBill(bill);
    setShowBillPreview(true);

    toast({
      title: "Bill Generated!",
      description: `Bill #${billNo} of ₹${total.toLocaleString()} created successfully.`,
    });
  };

  const handleCloseBill = () => {
    setShowBillPreview(false);
    setGeneratedBill(null);
    setCart([]);
    setSelectedCustomer("");
    setPaidAmount("");
    setDiscount("");
    setPaymentMode("cash");
  };

  const handlePrint = () => {
    if (billRef.current) {
      const printContents = billRef.current.innerHTML;
      const printWindow = window.open("", "", "width=400,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Bill - ${generatedBill?.billNo}</title>
              <style>
                body { font-family: 'Courier New', monospace; padding: 10px; }
                * { box-sizing: border-box; }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const customer = customers.find((c) => c.id === selectedCustomer);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Retail Billing</h1>
        <p className="text-muted-foreground mt-1">Create bills quickly and efficiently</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
      {/* Customer Selection with Add New Button */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">Select Customer</Label>
              <AddCustomerModal
                onCustomerAdded={handleCustomerAdded}
                trigger={
                  <Button variant="outline" size="sm" className="gap-2 btn-gold">
                    <Plus size={16} />
                    Add New
                  </Button>
                }
              />
            </div>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name or mobile..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Customer List - Always visible with all data */}
            <div className="border rounded-lg max-h-48 overflow-y-auto bg-background">
              {filteredCustomers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No customers found
                </div>
              ) : (
                filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCustomer(c.id)}
                    className={`w-full p-3 text-left border-b last:border-b-0 hover:bg-secondary/50 transition-colors flex items-center justify-between ${
                      selectedCustomer === c.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <span className="font-medium text-foreground">{c.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {c.mobile || "No mobile"}
                      </div>
                    </div>
                    {c.creditBalance > 0 && (
                      <span className="text-sm font-semibold text-destructive">
                        ₹{c.creditBalance.toLocaleString()} due
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Selected Customer Display */}
            {selectedCustomer && (
              <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    <span className="font-semibold text-foreground">
                      {customers.find(c => c.id === selectedCustomer)?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer("")}
                    className="h-8 w-8 p-0"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Product Search */}
          <div className="glass-card rounded-xl p-5">
            <Label className="mb-3 block font-semibold">Add Products</Label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input placeholder="Search products..." value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} className="pl-10 h-12" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <button key={product.id} onClick={() => addToCart(product)} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-accent transition-all text-left group">
                  <p className="font-medium text-foreground text-sm mb-1 line-clamp-2">{product.name}</p>
                  <p className="text-accent font-semibold">₹{product.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cart & Checkout */}
        <div className="glass-card rounded-xl p-5 h-fit sticky top-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="text-primary" size={20} />
            <h2 className="font-display font-semibold text-lg">Cart</h2>
            <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">{cart.length} items</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{item.name}</p>
                    <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.id)}><Trash2 size={14} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-4" />

          {/* Payment Mode */}
          <div className="space-y-3 mb-4">
            <Label className="font-semibold">Payment Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["cash", "credit", "partial"] as const).map((mode) => (
                <button key={mode} onClick={() => setPaymentMode(mode)} className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${paymentMode === mode ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {(paymentMode === "partial" || paymentMode === "credit") && (
            <div className="space-y-2 mb-4">
              <Label>Paid Amount (₹)</Label>
              <Input type="number" value={paidAmount} onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                if (val <= total) setPaidAmount(e.target.value);
              }} placeholder="Enter amount paid" max={total} disabled={paymentMode === "credit"} />
            </div>
          )}

          {/* Discount */}
          <div className="space-y-2 mb-4">
            <Label>Discount (₹)</Label>
            <Input 
              type="number" 
              value={discount} 
              onChange={(e) => setDiscount(e.target.value)} 
              placeholder="Enter discount" 
            />
          </div>

          {/* Bill Summary */}
          <div className="space-y-2 py-4 border-t border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-green-600">-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            {paymentMode !== "cash" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-medium text-green-600">₹{paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium text-destructive">₹{pending.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-lg pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-foreground">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-4">
            <Button onClick={handleCheckout} className="w-full h-12 btn-maroon text-base"><Receipt size={18} className="mr-2" />Generate Bill</Button>
            {customer && customer.mobile && (
              <WhatsAppButton phone={customer.mobile} customerName={customer.name} billAmount={total} paidAmount={paid} pendingAmount={pending} billType="retail" variant="outline" />
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-10" onClick={handlePrint} disabled={!generatedBill}><Printer size={16} className="mr-2" />Print</Button>
              <Button variant="outline" className="h-10"><Download size={16} className="mr-2" />PDF</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Preview Dialog */}
      <Dialog open={showBillPreview} onOpenChange={setShowBillPreview}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-secondary/50">
            <DialogTitle className="font-display flex items-center justify-between">
              <span>Bill #{generatedBill?.billNo}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {generatedBill && (
              <BillPreview
                ref={billRef}
                billNo={generatedBill.billNo}
                date={generatedBill.date}
                customerName={generatedBill.customerName}
                customerPhone={generatedBill.customerPhone}
                items={generatedBill.items}
                subTotal={generatedBill.subTotal}
                discount={generatedBill.discount}
                total={generatedBill.total}
                paidAmount={generatedBill.paidAmount}
                balanceAmount={generatedBill.balanceAmount}
                paymentMode={generatedBill.paymentMode}
                dueDate={generatedBill.dueDate}
              />
            )}
          </div>
          <div className="p-4 border-t flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            <Button className="flex-1 btn-maroon" onClick={handleCloseBill}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
