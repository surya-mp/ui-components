import { Badge, Button, DataTable, type DataColumn } from '@sypra-ui/ui';
import type { Invoice } from './billing-types';
export function InvoiceTable({
  invoices,
  onView,
}: {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
}) {
  const columns: DataColumn<Invoice>[] = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'amount', header: 'Amount' },
    {
      key: 'status',
      header: 'Status',
      cell: (invoice) => (
        <Badge
          variant={
            invoice.status.toLowerCase() === 'paid' ? 'success' : 'warning'
          }
        >
          {invoice.status}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: <span className="sr-only">Actions</span>,
      cell: (invoice) =>
        onView && (
          <Button variant="ghost" size="sm" onClick={() => onView(invoice)}>
            View
          </Button>
        ),
    },
  ];
  return (
    <DataTable
      data={invoices}
      columns={columns}
      emptyMessage="No invoices yet."
    />
  );
}
