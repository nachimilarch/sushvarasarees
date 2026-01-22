import { forwardRef } from "react";
import { format } from "date-fns";

interface BillItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface BillPreviewProps {
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

const BillPreview = forwardRef<HTMLDivElement, BillPreviewProps>(({
  billNo,
  date,
  customerName,
  customerPhone,
  items,
  subTotal,
  discount,
  total,
  paidAmount,
  balanceAmount,
  paymentMode,
  dueDate,
}, ref) => {
  return (
    <div 
      ref={ref}
      className="bg-white text-black p-6 max-w-[300px] mx-auto font-mono text-sm"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold tracking-wide">Sarees by Sri</h1>
        <p className="text-xs mt-1">Satish Road, Prakash Nagar, Narasaraopet</p>
        <p className="text-xs">Ph: 7981445404</p>
      </div>

      <div className="border-t border-dashed border-gray-400 my-3"></div>

      {/* Bill Info */}
      <div className="flex justify-between text-xs mb-2">
        <span className="font-bold">Bill No: {billNo}</span>
        <span>Date: {format(date, "dd-MM-yyyy")}</span>
      </div>

      <div className="border-t border-gray-300 my-2"></div>

      {/* Customer Info */}
      <div className="mb-3">
        <p className="font-bold">Customer: {customerName}</p>
        <p>Mobile: {customerPhone}</p>
      </div>

      <div className="border-t border-dashed border-gray-400 my-3"></div>

      {/* Items Header */}
      <div className="grid grid-cols-4 gap-1 text-xs font-bold border-b border-gray-400 pb-1 mb-2">
        <span>ITEM</span>
        <span className="text-center">QTY</span>
        <span className="text-right">RATE</span>
        <span className="text-right">AMT</span>
      </div>

      {/* Items */}
      <div className="space-y-1 mb-3">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-1 text-xs">
            <span className="truncate">{item.name}</span>
            <span className="text-center">{item.quantity > 0 ? item.quantity : "-"}</span>
            <span className="text-right">{item.rate.toLocaleString()}</span>
            <span className="text-right">{item.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-400 my-3"></div>

      {/* Totals */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="font-bold">Sub Total:</span>
          <span>₹ {subTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>₹ {discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
          <span>Total:</span>
          <span>₹ {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="border-t border-gray-300 my-3"></div>

      {/* Payment Info */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="font-bold">Paid:</span>
          <span>₹ {paidAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Balance:</span>
          <span>₹ {balanceAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="border-t border-gray-300 my-3"></div>

      {/* Payment Mode & Due Date */}
      <div className="text-xs space-y-1">
        <p>Payment: {paymentMode}</p>
        {dueDate && balanceAmount > 0 && (
          <p>Due Date: {format(dueDate, "dd-MM-yyyy")}</p>
        )}
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm font-semibold">Thank you 🙏</p>
      </div>
    </div>
  );
});

BillPreview.displayName = "BillPreview";

export { BillPreview };
export type { BillItem, BillPreviewProps };
