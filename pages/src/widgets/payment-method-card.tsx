import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sypra-ui/ui';
import type { PaymentMethod } from './billing-types';
export function PaymentMethodCard({
  paymentMethod,
  onUpdate,
}: {
  paymentMethod?: PaymentMethod;
  onUpdate?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Payment method</CardTitle>
          <CardDescription>
            {paymentMethod
              ? `${paymentMethod.brand} •••• ${paymentMethod.last4}${paymentMethod.expiresAt ? ` · Expires ${paymentMethod.expiresAt}` : ''}`
              : 'No payment method on file.'}
          </CardDescription>
        </div>
        {onUpdate && (
          <Button variant="outline" size="sm" onClick={onUpdate}>
            {paymentMethod ? 'Update' : 'Add payment method'}
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}
