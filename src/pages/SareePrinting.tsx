import { useState } from "react";
import {
  Stamp,
  Search,
  Plus,
  Calendar,
  User,
  Package,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { AddCustomerModal } from "@/components/AddCustomerModal";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  creditBalance: number;
}

interface PrintingJob {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  sareeCount: number;
  designNotes: string;
  deliveryDate: string;
  totalCost: number;
  advancePaid: number;
  pendingAmount: number;
  status: "pending" | "in_progress" | "completed" | "delivered";
  createdAt: string;
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Lakshmi Devi", mobile: "9876543210", address: "Hyderabad", creditBalance: 0 },
  { id: "2", name: "Priya Sharma", mobile: "9876543211", address: "Secunderabad", creditBalance: 0 },
];

const initialJobs: PrintingJob[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "Lakshmi Devi",
    customerPhone: "9876543210",
    sareeCount: 2,
    designNotes: "Block print, floral pattern, natural dyes",
    deliveryDate: "2024-01-25",
    totalCost: 2000,
    advancePaid: 1000,
    pendingAmount: 1000,
    status: "in_progress",
    createdAt: "2024-01-16",
  },
];

const SareePrinting = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [jobs, setJobs] = useState<PrintingJob[]>(initialJobs);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    sareeCount: "",
    designNotes: "",
    deliveryDate: "",
    totalCost: "",
    advancePaid: "",
  });

  const handleCustomerAdded = (customer: Customer) => {
    setCustomers([...customers, customer]);
    setSelectedCustomer(customer.id);
  };

  const handleCreateJob = () => {
    const customer = customers.find((c) => c.id === selectedCustomer);
    if (!customer) {
      toast({ title: "Select Customer", description: "Please select a customer.", variant: "destructive" });
      return;
    }
    if (!formData.sareeCount || !formData.totalCost) {
      toast({ title: "Missing Details", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const totalCost = parseFloat(formData.totalCost);
    const advancePaid = parseFloat(formData.advancePaid) || 0;

    const newJob: PrintingJob = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.mobile,
      sareeCount: parseInt(formData.sareeCount),
      designNotes: formData.designNotes,
      deliveryDate: formData.deliveryDate,
      totalCost,
      advancePaid,
      pendingAmount: totalCost - advancePaid,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setJobs([newJob, ...jobs]);
    setFormData({ sareeCount: "", designNotes: "", deliveryDate: "", totalCost: "", advancePaid: "" });
    setSelectedCustomer("");
    setIsAddDialogOpen(false);
    toast({ title: "Job Created!", description: `Printing job for ${customer.name} created.` });
  };

  const updateJobStatus = (jobId: string, newStatus: PrintingJob["status"]) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)));
    toast({ title: "Status Updated", description: `Job status changed to ${newStatus}.` });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600"><Clock size={12} className="mr-1" />Pending</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500/10 text-blue-600"><AlertCircle size={12} className="mr-1" />In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600"><CheckCircle size={12} className="mr-1" />Completed</Badge>;
      case "delivered":
        return <Badge className="bg-primary/10 text-primary"><Package size={12} className="mr-1" />Delivered</Badge>;
      default:
        return null;
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.designNotes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPending = jobs.reduce((sum, j) => sum + j.pendingAmount, 0);
  const inProgressCount = jobs.filter((j) => j.status === "in_progress" || j.status === "pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Stamp className="text-primary" />
            Old Saree Printing
          </h1>
          <p className="text-muted-foreground mt-1">Manage block printing orders</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold">
              <Plus size={18} className="mr-2" />
              New Printing Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Create Printing Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Select Customer</Label>
                <div className="flex gap-2">
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Choose customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AddCustomerModal onCustomerAdded={handleCustomerAdded} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Sarees</Label>
                  <Input
                    type="number"
                    value={formData.sareeCount}
                    onChange={(e) => setFormData({ ...formData, sareeCount: e.target.value })}
                    placeholder="Enter count"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Design Notes</Label>
                <Textarea
                  value={formData.designNotes}
                  onChange={(e) => setFormData({ ...formData, designNotes: e.target.value })}
                  placeholder="Describe block print design, patterns, colors..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Cost (₹)</Label>
                  <Input
                    type="number"
                    value={formData.totalCost}
                    onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                    placeholder="Enter cost"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Advance Paid (₹)</Label>
                  <Input
                    type="number"
                    value={formData.advancePaid}
                    onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                    placeholder="Enter advance"
                  />
                </div>
              </div>

              {formData.totalCost && (
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending Amount</span>
                    <span className="font-semibold text-destructive">
                      ₹{Math.max(0, parseFloat(formData.totalCost) - (parseFloat(formData.advancePaid) || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <Button onClick={handleCreateJob} className="w-full btn-maroon">
                Create Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Jobs</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">{jobs.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">In Progress</p>
          <p className="text-3xl font-display font-bold text-amber-600 mt-2">{inProgressCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Pending Amount</p>
          <p className="text-3xl font-display font-bold text-destructive mt-2">₹{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search by customer or design..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="glass-card rounded-xl p-5 hover:shadow-elevated transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <Stamp className="text-accent" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground text-lg">{job.customerName}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{job.sareeCount} sarees • {job.designNotes}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Due: {job.deliveryDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold">₹{job.totalCost.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="font-semibold text-green-600">₹{job.advancePaid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className={`font-semibold ${job.pendingAmount > 0 ? "text-destructive" : "text-green-600"}`}>
                    ₹{job.pendingAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={job.status}
                    onValueChange={(value) => updateJobStatus(job.id, value as PrintingJob["status"])}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <WhatsAppButton
                    phone={job.customerPhone}
                    customerName={job.customerName}
                    billAmount={job.totalCost}
                    paidAmount={job.advancePaid}
                    pendingAmount={job.pendingAmount}
                    billType="service"
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
  );
};

export default SareePrinting;
