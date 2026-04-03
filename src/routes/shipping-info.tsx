import { createFileRoute } from '@tanstack/react-router';
import ShippingForm from '../components/ShippingForm';

export const Route = createFileRoute('/shipping-info')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="my-12">
      <ShippingForm />
    </main>
  );
}
