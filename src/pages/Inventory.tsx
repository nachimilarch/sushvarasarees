import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  Edit,
  Trash2,
  AlertTriangle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  category: "sarees" | "dresses" | "fabrics" | "suit-sets";
  productCode: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
}

const initialInventory: InventoryItem[] = [
  { id: "1", name: "Kanjeevaram Silk Saree", category: "sarees", productCode: "SAR001", purchasePrice: 3500, sellingPrice: 5500, quantity: 12 },
  { id: "2", name: "Banarasi Silk Saree", category: "sarees", productCode: "SAR002", purchasePrice: 2800, sellingPrice: 4500, quantity: 8 },
  { id: "3", name: "Cotton Kurti", category: "dresses", productCode: "DRS001", purchasePrice: 450, sellingPrice: 850, quantity: 25 },
  { id: "4", name: "Designer Anarkali", category: "dresses", productCode: "DRS002", purchasePrice: 1200, sellingPrice: 2200, quantity: 5 },
  { id: "5", name: "Pure Cotton Fabric", category: "fabrics", productCode: "FAB001", purchasePrice: 120, sellingPrice: 200, quantity: 150 },
  { id: "6", name: "Silk Fabric (per meter)", category: "fabrics", productCode: "FAB002", purchasePrice: 350, sellingPrice: 550, quantity: 80 },
  { id: "7", name: "Churidar Suit Set", category: "suit-sets", productCode: "SET001", purchasePrice: 800, sellingPrice: 1500, quantity: 18 },
  { id: "8", name: "Palazzo Suit Set", category: "suit-sets", productCode: "SET002", purchasePrice: 950, sellingPrice: 1800, quantity: 3 },
];

const categoryLabels = {
  sarees: "Sarees",
  dresses: "Dresses",
  fabrics: "Fabrics",
  "suit-sets": "Suit Sets",
};

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "sarees" as InventoryItem["category"],
    productCode: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
  });

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      productCode: formData.productCode,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      quantity: parseInt(formData.quantity),
    };
    setInventory([...inventory, newItem]);
    setFormData({ name: "", category: "sarees", productCode: "", purchasePrice: "", sellingPrice: "", quantity: "" });
    setIsAddDialogOpen(false);
    toast({ title: "Item Added", description: `${newItem.name} has been added to inventory.` });
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
    toast({ title: "Item Deleted", description: "Item has been removed from inventory." });
  };

  const lowStockItems = inventory.filter((item) => item.quantity <= 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your stock and products
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold">
              <Plus size={18} className="mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v as InventoryItem["category"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarees">Sarees</SelectItem>
                      <SelectItem value="dresses">Dresses</SelectItem>
                      <SelectItem value="fabrics">Fabrics</SelectItem>
                      <SelectItem value="suit-sets">Suit Sets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Product Code</Label>
                  <Input
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    placeholder="SAR001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selling Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleAddItem} className="w-full btn-maroon">
                Add to Inventory
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-destructive mt-0.5" size={20} />
          <div>
            <p className="font-medium text-foreground">Low Stock Alert</p>
            <p className="text-sm text-muted-foreground">
              {lowStockItems.length} items are running low on stock
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sarees">Sarees</SelectItem>
            <SelectItem value="dresses">Dresses</SelectItem>
            <SelectItem value="fabrics">Fabrics</SelectItem>
            <SelectItem value="suit-sets">Suit Sets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => (
          <div key={item.id} className="glass-card rounded-xl p-5 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="text-primary" size={24} />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.quantity <= 5 ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent-foreground"
              }`}>
                {item.quantity <= 5 ? "Low Stock" : categoryLabels[item.category]}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">Code: {item.productCode}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Purchase</p>
                <p className="font-semibold text-foreground">₹{item.purchasePrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Selling</p>
                <p className="font-semibold text-accent">₹{item.sellingPrice.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-muted-foreground text-sm">Stock</p>
                <p className={`text-xl font-bold ${item.quantity <= 5 ? "text-destructive" : "text-foreground"}`}>
                  {item.quantity}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Edit size={16} />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 text-destructive hover:text-destructive" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
