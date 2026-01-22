import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Calendar,
  IndianRupee,
  Download,
  Edit,
  Wallet,
  Building,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  monthlySalary: number;
  joinDate: string;
  phone: string;
}

interface SalaryRecord {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  year: number;
  monthlySalary: number;
  paidAmount: number;
  pendingAmount: number;
  paymentDate: string | null;
  status: "paid" | "partial" | "pending";
  notes: string;
}

const initialStaff: Staff[] = [
  { id: "1", name: "Rajesh Kumar", role: "Store Manager", department: "Retail", monthlySalary: 25000, joinDate: "2022-01-15", phone: "9876543210" },
  { id: "2", name: "Sunita Devi", role: "Sales Associate", department: "Retail", monthlySalary: 15000, joinDate: "2022-06-01", phone: "9876543211" },
  { id: "3", name: "Venkat Rao", role: "Block Printer", department: "Production", monthlySalary: 18000, joinDate: "2021-03-10", phone: "9876543212" },
  { id: "4", name: "Lakshmi Bai", role: "Dye Specialist", department: "Production", monthlySalary: 20000, joinDate: "2020-08-20", phone: "9876543213" },
  { id: "5", name: "Ramu", role: "Helper", department: "Production", monthlySalary: 12000, joinDate: "2023-01-01", phone: "9876543214" },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentMonth = months[new Date().getMonth()];
const currentYear = new Date().getFullYear();

const initialSalaryRecords: SalaryRecord[] = [
  { id: "1", staffId: "1", staffName: "Rajesh Kumar", month: "January", year: 2024, monthlySalary: 25000, paidAmount: 25000, pendingAmount: 0, paymentDate: "2024-01-31", status: "paid", notes: "" },
  { id: "2", staffId: "2", staffName: "Sunita Devi", month: "January", year: 2024, monthlySalary: 15000, paidAmount: 15000, pendingAmount: 0, paymentDate: "2024-01-31", status: "paid", notes: "" },
  { id: "3", staffId: "3", staffName: "Venkat Rao", month: "January", year: 2024, monthlySalary: 18000, paidAmount: 10000, pendingAmount: 8000, paymentDate: "2024-01-31", status: "partial", notes: "Balance next week" },
  { id: "4", staffId: "4", staffName: "Lakshmi Bai", month: "January", year: 2024, monthlySalary: 20000, paidAmount: 0, pendingAmount: 20000, paymentDate: null, status: "pending", notes: "" },
];

const StaffSalaries = () => {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(initialSalaryRecords);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [newStaffData, setNewStaffData] = useState({
    name: "",
    role: "",
    department: "Retail",
    monthlySalary: "",
    phone: "",
  });

  const [paymentData, setPaymentData] = useState({
    paidAmount: "",
    notes: "",
  });

  const handleAddStaff = () => {
    if (!newStaffData.name || !newStaffData.role || !newStaffData.monthlySalary) {
      toast({ title: "Missing Details", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const newStaff: Staff = {
      id: Date.now().toString(),
      name: newStaffData.name,
      role: newStaffData.role,
      department: newStaffData.department,
      monthlySalary: parseFloat(newStaffData.monthlySalary),
      joinDate: new Date().toISOString().split("T")[0],
      phone: newStaffData.phone,
    };

    setStaff([...staff, newStaff]);
    setNewStaffData({ name: "", role: "", department: "Retail", monthlySalary: "", phone: "" });
    setIsAddStaffOpen(false);
    toast({ title: "Staff Added", description: `${newStaff.name} has been added.` });
  };

  const handlePaySalary = () => {
    if (!selectedStaff) return;
    
    const paidAmount = parseFloat(paymentData.paidAmount) || 0;
    if (paidAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a valid amount.", variant: "destructive" });
      return;
    }

    const existingRecord = salaryRecords.find(
      (r) => r.staffId === selectedStaff.id && r.month === selectedMonth && r.year === parseInt(selectedYear)
    );

    if (existingRecord) {
      const newPaidAmount = existingRecord.paidAmount + paidAmount;
      const newPendingAmount = Math.max(0, existingRecord.monthlySalary - newPaidAmount);
      const newStatus = newPendingAmount === 0 ? "paid" : newPaidAmount > 0 ? "partial" : "pending";

      setSalaryRecords(salaryRecords.map((r) =>
        r.id === existingRecord.id
          ? { ...r, paidAmount: newPaidAmount, pendingAmount: newPendingAmount, status: newStatus, notes: paymentData.notes, paymentDate: new Date().toISOString().split("T")[0] }
          : r
      ));
    } else {
      const newPendingAmount = Math.max(0, selectedStaff.monthlySalary - paidAmount);
      const newRecord: SalaryRecord = {
        id: Date.now().toString(),
        staffId: selectedStaff.id,
        staffName: selectedStaff.name,
        month: selectedMonth,
        year: parseInt(selectedYear),
        monthlySalary: selectedStaff.monthlySalary,
        paidAmount,
        pendingAmount: newPendingAmount,
        paymentDate: new Date().toISOString().split("T")[0],
        status: newPendingAmount === 0 ? "paid" : "partial",
        notes: paymentData.notes,
      };
      setSalaryRecords([...salaryRecords, newRecord]);
    }

    setPaymentData({ paidAmount: "", notes: "" });
    setIsPaymentOpen(false);
    setSelectedStaff(null);
    toast({ title: "Payment Recorded", description: `₹${paidAmount.toLocaleString()} paid to ${selectedStaff.name}.` });
  };

  const getStaffSalaryStatus = (staffId: string) => {
    const record = salaryRecords.find(
      (r) => r.staffId === staffId && r.month === selectedMonth && r.year === parseInt(selectedYear)
    );
    return record;
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-600"><CheckCircle size={12} className="mr-1" />Paid</Badge>;
      case "partial":
        return <Badge className="bg-amber-500/10 text-amber-600"><Clock size={12} className="mr-1" />Partial</Badge>;
      default:
        return <Badge className="bg-destructive/10 text-destructive"><Clock size={12} className="mr-1" />Pending</Badge>;
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalary = staff.reduce((sum, s) => sum + s.monthlySalary, 0);
  const totalPaid = salaryRecords
    .filter((r) => r.month === selectedMonth && r.year === parseInt(selectedYear))
    .reduce((sum, r) => sum + r.paidAmount, 0);
  const totalPending = totalSalary - totalPaid;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Users className="text-primary" />
            Staff Salaries
          </h1>
          <p className="text-muted-foreground mt-1">Manage staff and salary payments</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-36">
              <Calendar size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 50 }, (_, i) => 2020 + i).map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus size={18} className="mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Add New Staff</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newStaffData.name}
                    onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={newStaffData.role}
                      onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                      placeholder="Enter role"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={newStaffData.department} onValueChange={(v) => setNewStaffData({ ...newStaffData, department: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Salary (₹)</Label>
                    <Input
                      type="number"
                      value={newStaffData.monthlySalary}
                      onChange={(e) => setNewStaffData({ ...newStaffData, monthlySalary: e.target.value })}
                      placeholder="Enter salary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newStaffData.phone}
                      onChange={(e) => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                      placeholder="Enter phone"
                    />
                  </div>
                </div>
                <Button onClick={handleAddStaff} className="w-full btn-maroon">Add Staff</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Total Staff</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">{staff.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Monthly Salary</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">₹{totalSalary.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Paid ({selectedMonth})</p>
          <p className="text-3xl font-display font-bold text-green-600 mt-2">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-muted-foreground text-sm">Pending ({selectedMonth})</p>
          <p className="text-3xl font-display font-bold text-destructive mt-2">₹{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search by name, role, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        {filteredStaff.map((member) => {
          const salaryStatus = getStaffSalaryStatus(member.id);
          const paidAmount = salaryStatus?.paidAmount || 0;
          const pendingAmount = member.monthlySalary - paidAmount;

          return (
            <div key={member.id} className="glass-card rounded-xl p-5 hover:shadow-elevated transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-display font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{member.role}</span>
                      <span className="flex items-center gap-1">
                        <Building size={14} />
                        {member.department}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-semibold">₹{member.monthlySalary.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="font-semibold text-green-600">₹{paidAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className={`font-semibold ${pendingAmount > 0 ? "text-destructive" : "text-green-600"}`}>
                      ₹{pendingAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>{getStatusBadge(salaryStatus?.status)}</div>
                  <Dialog open={isPaymentOpen && selectedStaff?.id === member.id} onOpenChange={(open) => {
                    setIsPaymentOpen(open);
                    if (open) setSelectedStaff(member);
                    else setSelectedStaff(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="btn-gold" onClick={() => setSelectedStaff(member)}>
                        <Wallet size={16} className="mr-2" />
                        Pay
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="font-display">Pay Salary - {member.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Monthly Salary</span>
                            <span className="font-medium">₹{member.monthlySalary.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Already Paid</span>
                            <span className="font-medium text-green-600">₹{paidAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining</span>
                            <span className="font-medium text-destructive">₹{pendingAmount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount to Pay (₹)</Label>
                          <Input
                            type="number"
                            value={paymentData.paidAmount}
                            onChange={(e) => setPaymentData({ ...paymentData, paidAmount: e.target.value })}
                            placeholder="Enter amount"
                            max={pendingAmount}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes (Optional)</Label>
                          <Input
                            value={paymentData.notes}
                            onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                            placeholder="Any notes..."
                          />
                        </div>
                        <Button onClick={handlePaySalary} className="w-full btn-maroon">
                          <IndianRupee size={16} className="mr-2" />
                          Record Payment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffSalaries;
