// app/invoice/[id]/page.tsx

import InvoicePageClient from "./ui";

export default function InvoicePage({ params }: { params: { id: string } }) {
    return <InvoicePageClient orderId={params.id} />;
}
