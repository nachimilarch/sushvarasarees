import { useState } from "react";
import {
  Plus,
  Search,
  Phone,
  MapPin,
  IndianRupee,
  Eye,
  Edit,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  totalPurchases: number;
  creditBalance: number;
  lastPurchase: string;
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Lakshmi Devi", mobile: "9876543210", address: "123 Main Street, Hyderabad", totalPurchases: 45000, creditBalance: 0, lastPurchase: "2024-01-15" },
  { id: "2", name: "Priya Sharma", mobile: "9876543211", address: "456 Park Avenue, Secunderabad", totalPurchases: 78000, creditBalance: 8200, lastPurchase: "2024-01-14" },
  { id: "3", name: "Anjali Reddy", mobile: "9876543212", address: "789 Lake View, Kukatpally", totalPurchases: 125000, creditBalance: 0, lastPurchase: "2024-01-13" },
  { id: "4", name: "Meera Nair", mobile: "9876543213", address: "321 Garden Road, Banjara Hills", totalPurchases: 230000, creditBalance: 15000, lastPurchase: "2024-01-12" },
  { id: "5", name: "Sunita Rao", mobile: "9876543214", address: "654 Temple Street, Jubilee Hills", totalPurchases: 56000, creditBalance: 3500, lastPurchase: "2024-01-11" },
  { id: "6", name: "Kavitha Pillai", mobile: "9876543215", address: "987 River Road, Madhapur", totalPurchases: 89000, creditBalance: 0, lastPurchase: "2024-01-10" },
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      totalPurchases: 0,
      creditBalance: 0,
      lastPurchase: new Date().toISOString().split("T")[0],
    };
    setCustomers([...customers, newCustomer]);
    setFormData({ name: "", mobile: "", address: "" });
    setIsAddDialogOpen(false);
    toast({ title: "Customer Added", description: `${newCustomer.name} has been added.` });
  };

  const totalCredit = customers.reduce((sum, c) => sum + c.creditBalance, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Customers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer relationships
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold">
              <Plus size={18} className="mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddCustomer} className="w-full btn-maroon">
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Customers</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">{customers.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">With Credit Balance</p>
          <p className="text-3xl font-display font-bold text-destructive mt-2">
            {customers.filter((c) => c.creditBalance > 0).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Outstanding</p>
          <p className="text-3xl font-display font-bold text-accent mt-2">
            ₹{totalCredit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search by name or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="glass-card rounded-xl p-5 hover:shadow-elevated transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-display font-bold">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{customer.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone size={14} />
                      {customer.mobile}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {customer.address}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 ml-auto">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Purchases</p>
                  <p className="font-semibold text-foreground">₹{customer.totalPurchases.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Credit Balance</p>
                  <p className={`font-semibold ${customer.creditBalance > 0 ? "text-destructive" : "text-green-600"}`}>
                    ₹{customer.creditBalance.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                  {customer.creditBalance > 0 && (
                    <Button size="sm" className="btn-gold">
                      <CreditCard size={16} className="mr-1" />
                      Collect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
