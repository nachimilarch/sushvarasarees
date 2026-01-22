import { useState } from "react";
import {
  RotateCcw,
  Search,
  ArrowLeftRight,
  Receipt,
  Package,
  IndianRupee,
  Check,
  X,
  Plus,
  Minus,
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
import { useToast } from "@/hooks/use-toast";

interface Bill {
  id: string;
  billNo: string;
  customerName: string;
  customerPhone: string;
  date: string;
  items: BillItem[];
  totalAmount: number;
}

interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ReturnRecord {
  id: string;
  billNo: string;
  customerName: string;
  date: string;
  returnType: "refund" | "credit_note" | "exchange";
  returnedItems: { name: string; price: number; quantity: number }[];
  exchangedItems?: { name: string; price: number; quantity: number }[];
  refundAmount: number;
  priceDifference: number;
  status: "completed" | "pending";
}

const bills: Bill[] = [
  {
    id: "1",
    billNo: "BILL-001",
    customerName: "Lakshmi Devi",
    customerPhone: "9876543210",
    date: "2024-01-15",
    items: [
      { id: "1", name: "Kanjeevaram Silk Saree", price: 5500, quantity: 1 },
      { id: "2", name: "Cotton Kurti", price: 850, quantity: 2 },
    ],
    totalAmount: 7200,
  },
  {
    id: "2",
    billNo: "BILL-002",
    customerName: "Priya Sharma",
    customerPhone: "9876543211",
    date: "2024-01-16",
    items: [
      { id: "3", name: "Banarasi Silk Saree", price: 4500, quantity: 1 },
      { id: "4", name: "Churidar Suit Set", price: 1500, quantity: 1 },
    ],
    totalAmount: 6000,
  },
];

const products = [
  { id: "1", name: "Kanjeevaram Silk Saree", price: 5500 },
  { id: "2", name: "Banarasi Silk Saree", price: 4500 },
  { id: "3", name: "Cotton Kurti", price: 850 },
  { id: "4", name: "Designer Anarkali", price: 2200 },
  { id: "5", name: "Churidar Suit Set", price: 1500 },
  { id: "6", name: "Palazzo Suit Set", price: 1800 },
];

const initialReturns: ReturnRecord[] = [
  {
    id: "1",
    billNo: "BILL-001",
    customerName: "Lakshmi Devi",
    date: "2024-01-17",
    returnType: "refund",
    returnedItems: [{ name: "Cotton Kurti", price: 850, quantity: 1 }],
    refundAmount: 850,
    priceDifference: 0,
    status: "completed",
  },
];

const ReturnsExchange = () => {
  const [returns, setReturns] = useState<ReturnRecord[]>(initialReturns);
  const [selectedBillNo, setSelectedBillNo] = useState("");
  const [returnType, setReturnType] = useState<"refund" | "credit_note" | "exchange">("refund");
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantity: number }[]>([]);
  const [exchangeItems, setExchangeItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [reason, setReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [billSearchTerm, setBillSearchTerm] = useState("");
  const { toast } = useToast();

  const selectedBill = bills.find((b) => b.billNo === selectedBillNo);

  const toggleItemSelection = (itemId: string) => {
    const existing = selectedItems.find((i) => i.itemId === itemId);
    if (existing) {
      setSelectedItems(selectedItems.filter((i) => i.itemId !== itemId));
    } else {
      setSelectedItems([...selectedItems, { itemId, quantity: 1 }]);
    }
  };

  const updateReturnQuantity = (itemId: string, delta: number) => {
    const billItem = selectedBill?.items.find((i) => i.id === itemId);
    if (!billItem) return;

    setSelectedItems(selectedItems.map((item) => {
      if (item.itemId === itemId) {
        const newQty = Math.max(1, Math.min(billItem.quantity, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const addExchangeItem = (productId: string) => {
    const existing = exchangeItems.find((i) => i.productId === productId);
    if (existing) {
      setExchangeItems(exchangeItems.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setExchangeItems([...exchangeItems, { productId, quantity: 1 }]);
    }
  };

  const removeExchangeItem = (productId: string) => {
    setExchangeItems(exchangeItems.filter((i) => i.productId !== productId));
  };

  const returnTotal = selectedItems.reduce((sum, item) => {
    const billItem = selectedBill?.items.find((i) => i.id === item.itemId);
    return sum + (billItem ? billItem.price * item.quantity : 0);
  }, 0);

  const exchangeTotal = exchangeItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const priceDifference = exchangeTotal - returnTotal;

  const handleProcessReturn = () => {
    if (!selectedBill || selectedItems.length === 0) {
      toast({ title: "Select Items", description: "Please select items to return.", variant: "destructive" });
      return;
    }

    if (returnType === "exchange" && exchangeItems.length === 0) {
      toast({ title: "Select Exchange Items", description: "Please select items for exchange.", variant: "destructive" });
      return;
    }

    const returnedItemsList = selectedItems.map((item) => {
      const billItem = selectedBill.items.find((i) => i.id === item.itemId)!;
      return { name: billItem.name, price: billItem.price, quantity: item.quantity };
    });

    const exchangedItemsList = exchangeItems.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return { name: product.name, price: product.price, quantity: item.quantity };
    });

    const newReturn: ReturnRecord = {
      id: Date.now().toString(),
      billNo: selectedBill.billNo,
      customerName: selectedBill.customerName,
      date: new Date().toISOString().split("T")[0],
      returnType,
      returnedItems: returnedItemsList,
      exchangedItems: returnType === "exchange" ? exchangedItemsList : undefined,
      refundAmount: returnType !== "exchange" ? returnTotal : 0,
      priceDifference: returnType === "exchange" ? priceDifference : 0,
      status: "completed",
    };

    setReturns([newReturn, ...returns]);
    
    // Reset form
    setSelectedBillNo("");
    setSelectedItems([]);
    setExchangeItems([]);
    setReason("");
    setReturnType("refund");

    toast({
      title: "Return Processed!",
      description: returnType === "exchange" 
        ? `Exchange completed. ${priceDifference > 0 ? `Customer pays ₹${priceDifference}` : priceDifference < 0 ? `Refund ₹${Math.abs(priceDifference)}` : "No difference"}`
        : `Refund of ₹${returnTotal} processed.`
    });
  };

  const filteredReturns = returns.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.billNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBills = bills.filter(
    (b) =>
      b.billNo.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
      b.customerPhone.includes(billSearchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <RotateCcw className="text-primary" />
          Returns & Exchange
        </h1>
        <p className="text-muted-foreground mt-1">Process product returns and exchanges</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Returns</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">{returns.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Refunded</p>
          <p className="text-3xl font-display font-bold text-destructive mt-2">
            ₹{returns.reduce((sum, r) => sum + r.refundAmount, 0).toLocaleString()}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Exchanges</p>
          <p className="text-3xl font-display font-bold text-accent mt-2">
            {returns.filter((r) => r.returnType === "exchange").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Return Form */}
        <div className="glass-card rounded-xl p-5 space-y-5">
          <h2 className="font-display font-semibold text-lg">Process Return / Exchange</h2>

          {/* Bill Selection with Search */}
          <div className="space-y-2">
            <Label>Select Bill</Label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by bill no, customer name, or phone..."
                value={billSearchTerm}
                onChange={(e) => setBillSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedBillNo} onValueChange={setSelectedBillNo}>
              <SelectTrigger>
                <Receipt size={16} className="mr-2" />
                <SelectValue placeholder="Choose bill number" />
              </SelectTrigger>
              <SelectContent>
                {filteredBills.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No bills found
                  </div>
                ) : (
                  filteredBills.map((bill) => (
                    <SelectItem key={bill.id} value={bill.billNo}>
                      {bill.billNo} - {bill.customerName} - {bill.customerPhone} (₹{bill.totalAmount.toLocaleString()})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedBill && (
            <>
              {/* Bill Items */}
              <div className="space-y-2">
                <Label>Select Items to Return</Label>
                <div className="space-y-2">
                  {selectedBill.items.map((item) => {
                    const isSelected = selectedItems.some((i) => i.itemId === item.id);
                    const selectedItem = selectedItems.find((i) => i.itemId === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                            }`}>
                              {isSelected && <Check size={14} className="text-primary-foreground" />}
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()} × {item.quantity}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateReturnQuantity(item.id, -1)}>
                                <Minus size={14} />
                              </Button>
                              <span className="w-8 text-center font-semibold">{selectedItem?.quantity}</span>
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateReturnQuantity(item.id, 1)}>
                                <Plus size={14} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Return Type */}
              <div className="space-y-2">
                <Label>Return Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["refund", "credit_note", "exchange"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setReturnType(type)}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                        returnType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {type === "refund" ? "Cash Refund" : type === "credit_note" ? "Credit Note" : "Exchange"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exchange Products */}
              {returnType === "exchange" && (
                <div className="space-y-2">
                  <Label>Select Products for Exchange</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {products.map((product) => {
                      const exchangeItem = exchangeItems.find((i) => i.productId === product.id);
                      return (
                        <button
                          key={product.id}
                          onClick={() => addExchangeItem(product.id)}
                          className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary text-left group relative"
                        >
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-accent font-semibold text-sm">₹{product.price.toLocaleString()}</p>
                          {exchangeItem && (
                            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                              ×{exchangeItem.quantity}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {exchangeItems.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {exchangeItems.map((item) => {
                        const product = products.find((p) => p.id === item.productId)!;
                        return (
                          <Badge key={item.productId} variant="secondary" className="gap-2">
                            {product.name} ×{item.quantity}
                            <X size={14} className="cursor-pointer" onClick={() => removeExchangeItem(item.productId)} />
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Reason */}
              <div className="space-y-2">
                <Label>Reason for Return</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason..."
                  rows={2}
                />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Return Value</span>
                  <span className="font-medium">₹{returnTotal.toLocaleString()}</span>
                </div>
                {returnType === "exchange" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exchange Value</span>
                      <span className="font-medium">₹{exchangeTotal.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Difference</span>
                      <span className={`font-bold ${priceDifference > 0 ? "text-destructive" : priceDifference < 0 ? "text-green-600" : ""}`}>
                        {priceDifference > 0 ? `Customer Pays ₹${priceDifference.toLocaleString()}` : priceDifference < 0 ? `Refund ₹${Math.abs(priceDifference).toLocaleString()}` : "No Difference"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Button onClick={handleProcessReturn} className="w-full h-12 btn-maroon">
                <ArrowLeftRight size={18} className="mr-2" />
                Process {returnType === "exchange" ? "Exchange" : "Return"}
              </Button>
            </>
          )}
        </div>

        {/* Return History */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Return History</h2>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search returns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredReturns.map((record) => (
              <div key={record.id} className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{record.customerName}</p>
                    <p className="text-sm text-muted-foreground">{record.billNo} • {record.date}</p>
                  </div>
                  <Badge className={
                    record.returnType === "refund" ? "bg-green-500/10 text-green-600" :
                    record.returnType === "credit_note" ? "bg-blue-500/10 text-blue-600" :
                    "bg-accent/10 text-accent"
                  }>
                    {record.returnType === "credit_note" ? "Credit Note" : record.returnType.charAt(0).toUpperCase() + record.returnType.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Returned: {record.returnedItems.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</p>
                  {record.exchangedItems && (
                    <p>Exchanged: {record.exchangedItems.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  {record.refundAmount > 0 && (
                    <span className="text-green-600 font-semibold">Refund: ₹{record.refundAmount.toLocaleString()}</span>
                  )}
                  {record.priceDifference !== 0 && (
                    <span className={record.priceDifference > 0 ? "text-destructive font-semibold" : "text-green-600 font-semibold"}>
                      {record.priceDifference > 0 ? `Paid: ₹${record.priceDifference}` : `Refund: ₹${Math.abs(record.priceDifference)}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchange;