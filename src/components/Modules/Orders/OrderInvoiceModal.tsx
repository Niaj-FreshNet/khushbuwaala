import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OrderInvoice } from "./OrderInvoice";

interface OrderInvoiceModalProps {
  order: any;
  isInvoiceOpen?: boolean | null;
  setIsInvoiceOpen?: any;
  discountBreakdown?: any;
}

export default function OrderInvoiceModal({
  order,
  isInvoiceOpen,
  setIsInvoiceOpen,
  discountBreakdown,
}: OrderInvoiceModalProps) {
  return (
    <Dialog open={!!isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <OrderInvoice order={order} discountBreakdown={discountBreakdown} />
      </DialogContent>
    </Dialog>
  );
}
