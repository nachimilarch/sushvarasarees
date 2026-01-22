import { useState } from "react";
import {
  Plus,
  Factory,
  ArrowRightLeft,
  Package,
  Calendar,
  TrendingUp,
  Search,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ProductionEntry {
  id: string;
  date: string;
  type: "saree" | "dress";
  designName: string;
  quantity: number;
}

interface RollingEntry {
  id: string;
  date: string;
  sentQuantity: number;
  returnedQuantity: number;
  pending: number;
}

const initialProduction: ProductionEntry[] = [
  { id: "1", date: "2024-01-15", type: "saree", designName: "Floral Block Print", quantity: 12 },
  { id: "2", date: "2024-01-15", type: "saree", designName: "Paisley Design", quantity: 8 },
  { id: "3", date: "2024-01-15", type: "dress", designName: "Traditional Kurta", quantity: 15 },
  { id: "4", date: "2024-01-14", type: "saree", designName: "Abstract Pattern", quantity: 10 },
  { id: "5", date: "2024-01-14", type: "dress", designName: "Indo-Western", quantity: 6 },
];

const initialRolling: RollingEntry[] = [
  { id: "1", date: "2024-01-15", sentQuantity: 50, returnedQuantity: 35, pending: 15 },
  { id: "2", date: "2024-01-12", sentQuantity: 40, returnedQuantity: 40, pending: 0 },
  { id: "3", date: "2024-01-10", sentQuantity: 60, returnedQuantity: 48, pending: 12 },
];

const Production = () => {
  const [production, setProduction] = useState<ProductionEntry[]>(initialProduction);
  const [rolling, setRolling] = useState<RollingEntry[]>(initialRolling);
  const [isProductionDialogOpen, setIsProductionDialogOpen] = useState(false);
  const [isRollingDialogOpen, setIsRollingDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [productionForm, setProductionForm] = useState({
    type: "saree" as "saree" | "dress",
    designName: "",
    quantity: "",
  });

  const [rollingForm, setRollingForm] = useState({
    action: "send" as "send" | "receive",
    quantity: "",
  });

  const todayProduction = production.filter((p) => p.date === "2024-01-15");
  const totalSarees = todayProduction.filter((p) => p.type === "saree").reduce((sum, p) => sum + p.quantity, 0);
  const totalDresses = todayProduction.filter((p) => p.type === "dress").reduce((sum, p) => sum + p.quantity, 0);
  const totalAtRolling = rolling.reduce((sum, r) => sum + r.pending, 0);
  const inStore = 89; // Mock data

  const handleAddProduction = () => {
    const newEntry: ProductionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      type: productionForm.type,
      designName: productionForm.designName,
      quantity: parseInt(productionForm.quantity),
    };
    setProduction([newEntry, ...production]);
    setProductionForm({ type: "saree", designName: "", quantity: "" });
    setIsProductionDialogOpen(false);
    toast({ title: "Production Added", description: `${newEntry.quantity} ${newEntry.type}(s) added.` });
  };

  const handleRollingAction = () => {
    if (rollingForm.action === "send") {
      const newEntry: RollingEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        sentQuantity: parseInt(rollingForm.quantity),
        returnedQuantity: 0,
        pending: parseInt(rollingForm.quantity),
      };
      setRolling([newEntry, ...rolling]);
      toast({ title: "Sent for Rolling", description: `${rollingForm.quantity} sarees sent for rolling.` });
    } else {
      toast({ title: "Received from Rolling", description: `${rollingForm.quantity} sarees received.` });
    }
    setRollingForm({ action: "send", quantity: "" });
    setIsRollingDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Sushvara Production
          </h1>
          <p className="text-muted-foreground mt-1">
            Block Printing Unit Management
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isProductionDialogOpen} onOpenChange={setIsProductionDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus size={18} className="mr-2" />
                Add Production
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Add Production Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Select
                    value={productionForm.type}
                    onValueChange={(v) => setProductionForm({ ...productionForm, type: v as "saree" | "dress" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saree">Saree</SelectItem>
                      <SelectItem value="dress">Dress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Design Name</Label>
                  <Input
                    value={productionForm.designName}
                    onChange={(e) => setProductionForm({ ...productionForm, designName: e.target.value })}
                    placeholder="Enter design name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={productionForm.quantity}
                    onChange={(e) => setProductionForm({ ...productionForm, quantity: e.target.value })}
                    placeholder="Enter quantity"
                  />
                </div>
                <Button onClick={handleAddProduction} className="w-full btn-maroon">
                  Add Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isRollingDialogOpen} onOpenChange={setIsRollingDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowRightLeft size={18} className="mr-2" />
                Rolling
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Rolling Management</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select
                    value={rollingForm.action}
                    onValueChange={(v) => setRollingForm({ ...rollingForm, action: v as "send" | "receive" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send">Send for Rolling</SelectItem>
                      <SelectItem value="receive">Receive from Rolling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={rollingForm.quantity}
                    onChange={(e) => setRollingForm({ ...rollingForm, quantity: e.target.value })}
                    placeholder="Enter quantity"
                  />
                </div>
                <Button onClick={handleRollingAction} className="w-full btn-maroon">
                  {rollingForm.action === "send" ? "Send for Rolling" : "Receive from Rolling"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Factory className="text-primary" size={20} />
            </div>
            <span className="text-sm text-muted-foreground">Today's Sarees</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{totalSarees}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Factory className="text-accent" size={20} />
            </div>
            <span className="text-sm text-muted-foreground">Today's Dresses</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{totalDresses}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-peacock/10 flex items-center justify-center">
              <ArrowRightLeft className="text-peacock" size={20} />
            </div>
            <span className="text-sm text-muted-foreground">At Rolling</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{totalAtRolling}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Package className="text-green-600" size={20} />
            </div>
            <span className="text-sm text-muted-foreground">In Store</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{inStore}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search by design name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="production" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="production">Daily Production</TabsTrigger>
          <TabsTrigger value="rolling">Rolling Status</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="mt-6">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-display font-semibold text-lg">Recent Production</h3>
            </div>
            <div className="divide-y divide-border">
              {production
                .filter((entry) => entry.designName.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((entry) => (
                <div key={entry.id} className="p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      entry.type === "saree" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    }`}>
                      <Factory size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{entry.designName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{entry.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display font-bold text-foreground">{entry.quantity}</p>
                    <p className="text-sm text-muted-foreground">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rolling" className="mt-6">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-display font-semibold text-lg">Rolling History</h3>
            </div>
            <div className="divide-y divide-border">
              {rolling.map((entry) => (
                <div key={entry.id} className="p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-peacock/10 flex items-center justify-center">
                      <ArrowRightLeft className="text-peacock" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{entry.date}</p>
                      <p className="text-sm text-muted-foreground">
                        Sent: {entry.sentQuantity} | Returned: {entry.returnedQuantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-display font-bold ${entry.pending > 0 ? "text-accent" : "text-green-600"}`}>
                      {entry.pending}
                    </p>
                    <p className="text-sm text-muted-foreground">pending</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Production;
