import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { OrderInvoice } from "./OrderInvoice";
import { Order } from "./OrderReceipt";

interface OrderInvoiceModalProps {
    order: Order;
    isInvoiceOpen?: boolean | null;
    setIsInvoiceOpen?: boolean | null;
}

export default function OrderInvoiceModal({ order, isInvoiceOpen, setIsInvoiceOpen }: OrderInvoiceModalProps) {
    return (
        <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
            <DialogContent className="max-w-[90vh] max-h-[90vh] overflow-y-auto">
                {/* <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Order Invoice
                    </DialogTitle>
                </DialogHeader> */}
                <OrderInvoice order={order} />
            </DialogContent>
        </Dialog>
    );
}
