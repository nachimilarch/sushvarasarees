import { useState } from "react";
import { Plus, User, Phone, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  gstNumber?: string;
  notes?: string;
  creditBalance: number;
}

interface AddCustomerModalProps {
  onCustomerAdded: (customer: Customer) => void;
  trigger?: React.ReactNode;
}

export const AddCustomerModal = ({ onCustomerAdded, trigger }: AddCustomerModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    gstNumber: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter valid 10-digit mobile number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      address: formData.address.trim(),
      gstNumber: formData.gstNumber.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      creditBalance: 0,
    };

    onCustomerAdded(newCustomer);
    setFormData({ name: "", mobile: "", address: "", gstNumber: "", notes: "" });
    setErrors({});
    setOpen(false);
    
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus size={16} />
            Add New Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <User className="text-primary" size={20} />
            Add New Customer
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User size={14} className="text-muted-foreground" />
              Customer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter customer name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone size={14} className="text-muted-foreground" />
              Mobile Number <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              placeholder="Enter 10-digit mobile number"
              className={errors.mobile ? "border-destructive" : ""}
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin size={14} className="text-muted-foreground" />
              Address
            </Label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter address"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText size={14} className="text-muted-foreground" />
              GST Number (Optional)
            </Label>
            <Input
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
              placeholder="Enter GST number"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>
          
          <Button onClick={handleSubmit} className="w-full btn-maroon h-12">
            <Plus size={18} className="mr-2" />
            Add Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
