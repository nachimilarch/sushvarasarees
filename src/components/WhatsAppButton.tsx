import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppButtonProps {
  phone: string;
  customerName: string;
  billAmount: number;
  paidAmount: number;
  pendingAmount: number;
  billType?: "retail" | "dtdc" | "service";
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
}

export const WhatsAppButton = ({
  phone,
  customerName,
  billAmount,
  paidAmount,
  pendingAmount,
  billType = "retail",
  size = "default",
  variant = "default",
}: WhatsAppButtonProps) => {
  const { toast } = useToast();

  const sendWhatsAppMessage = () => {
    if (!phone) {
      toast({
        title: "No Phone Number",
        description: "Customer phone number is not available.",
        variant: "destructive",
      });
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

    let message = "";
    
    if (billType === "retail") {
      message = `🛍️ *SriDevi Nelluri Collections*

Hello ${customerName},

Your bill details:
━━━━━━━━━━━━━━━
💰 Bill Amount: ₹${billAmount.toLocaleString()}
✅ Paid: ₹${paidAmount.toLocaleString()}
${pendingAmount > 0 ? `⏳ Pending: ₹${pendingAmount.toLocaleString()}` : ""}
━━━━━━━━━━━━━━━

${pendingAmount > 0 ? "Please clear the pending amount at your earliest convenience." : "Thank you for your purchase!"}

📍 Visit us again!
Thank you – SriDevi Collections`;
    } else if (billType === "dtdc") {
      message = `📦 *SriDevi Nelluri Collections*
*DTDC Courier Billing*

Hello ${customerName},

Your courier charges:
━━━━━━━━━━━━━━━
💰 Total Amount: ₹${billAmount.toLocaleString()}
✅ Paid: ₹${paidAmount.toLocaleString()}
${pendingAmount > 0 ? `⏳ Pending: ₹${pendingAmount.toLocaleString()}` : ""}
━━━━━━━━━━━━━━━

Thank you – SriDevi Collections`;
    } else {
      message = `🎨 *SriDevi Nelluri Collections*
*Saree Services*

Hello ${customerName},

Your service bill:
━━━━━━━━━━━━━━━
💰 Total Cost: ₹${billAmount.toLocaleString()}
✅ Paid: ₹${paidAmount.toLocaleString()}
${pendingAmount > 0 ? `⏳ Pending: ₹${pendingAmount.toLocaleString()}` : ""}
━━━━━━━━━━━━━━━

Thank you – SriDevi Collections`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "WhatsApp Opened",
      description: "Message ready to send.",
    });
  };

  return (
    <Button
      onClick={sendWhatsAppMessage}
      size={size}
      variant={variant}
      className={variant === "default" ? "bg-green-600 hover:bg-green-700 text-white" : "text-green-600 hover:text-green-700"}
    >
      <MessageCircle size={size === "sm" ? 14 : 18} className={size !== "icon" ? "mr-2" : ""} />
      {size !== "icon" && "WhatsApp"}
    </Button>
  );
};
