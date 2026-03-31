import { createFileRoute } from '@tanstack/react-router';
import { useCreateOrder } from '../queries/orders';
import { useCartStore } from '../zustand/cart';
import OrderItem from '../components/OrderItem';
import { ShoppingBag } from 'lucide-react';

export const Route = createFileRoute('/checkout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: checkout } = useCreateOrder();
  const { cart } = useCartStore();

  return (
    <main className="max-w-6xl mx-auto my-12">
      {!Boolean(cart.length) && (
        <div className="flex flex-col items-center gap-6">
          <p className="font-medium text-2xl text-center">
            There No Items In Your Carts Yet
          </p>
          <ShoppingBag size={48} />
        </div>
      )}
      {cart.map((cartItem, index) => {
        return <OrderItem key={index} {...cartItem} />;
      })}
    </main>
  );
}
