import { useState } from "react";
import {
  Plus,
  Search,
  Phone,
  Building,
  IndianRupee,
  Eye,
  FileText,
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

interface Vendor {
  id: string;
  name: string;
  company: string;
  mobile: string;
  address: string;
  totalPurchases: number;
  pendingPayment: number;
  lastPurchase: string;
}

const initialVendors: Vendor[] = [
  { id: "1", name: "Rajesh Textiles", company: "Rajesh Traders Pvt Ltd", mobile: "9876543220", address: "Surat, Gujarat", totalPurchases: 450000, pendingPayment: 75000, lastPurchase: "2024-01-10" },
  { id: "2", name: "Krishna Silks", company: "Krishna Silk House", mobile: "9876543221", address: "Kanchipuram, Tamil Nadu", totalPurchases: 890000, pendingPayment: 0, lastPurchase: "2024-01-08" },
  { id: "3", name: "Banarasi Weavers", company: "Banarasi Handloom Co.", mobile: "9876543222", address: "Varanasi, UP", totalPurchases: 320000, pendingPayment: 45000, lastPurchase: "2024-01-05" },
  { id: "4", name: "Cotton Kings", company: "CK Fabrics", mobile: "9876543223", address: "Ahmedabad, Gujarat", totalPurchases: 560000, pendingPayment: 0, lastPurchase: "2024-01-02" },
];

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    mobile: "",
    address: "",
  });

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = () => {
    const newVendor: Vendor = {
      id: Date.now().toString(),
      name: formData.name,
      company: formData.company,
      mobile: formData.mobile,
      address: formData.address,
      totalPurchases: 0,
      pendingPayment: 0,
      lastPurchase: new Date().toISOString().split("T")[0],
    };
    setVendors([...vendors, newVendor]);
    setFormData({ name: "", company: "", mobile: "", address: "" });
    setIsAddDialogOpen(false);
    toast({ title: "Vendor Added", description: `${newVendor.name} has been added.` });
  };

  const totalPending = vendors.reduce((sum, v) => sum + v.pendingPayment, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Vendors
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your supplier relationships
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold">
              <Plus size={18} className="mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter vendor name"
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Enter company name"
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
                  rows={2}
                />
              </div>
              <Button onClick={handleAddVendor} className="w-full btn-maroon">
                Add Vendor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Vendors</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">{vendors.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">With Pending Payment</p>
          <p className="text-3xl font-display font-bold text-accent mt-2">
            {vendors.filter((v) => v.pendingPayment > 0).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Pending</p>
          <p className="text-3xl font-display font-bold text-destructive mt-2">
            ₹{totalPending.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Vendor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="glass-card rounded-xl p-5 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xl font-display font-bold">
                {vendor.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{vendor.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Building size={14} />
                  <span>{vendor.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Phone size={14} />
                  <span>{vendor.mobile}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
                <p className="font-semibold text-foreground">₹{vendor.totalPurchases.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payment</p>
                <p className={`font-semibold ${vendor.pendingPayment > 0 ? "text-destructive" : "text-green-600"}`}>
                  ₹{vendor.pendingPayment.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye size={16} className="mr-1" />
                View Details
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <FileText size={16} className="mr-1" />
                Purchase Bills
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendors;
