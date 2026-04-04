import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCreateOrder } from '../queries/orders';
import { useCartStore } from '../zustand/cart';
import OrderItem from '../components/OrderItem';
import { Edit2Icon, ShoppingBag } from 'lucide-react';
import { useShippingStore } from '../zustand/shippingAddress';

export const Route = createFileRoute('/checkout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync: checkout } = useCreateOrder();
  const { cart, clearCart } = useCartStore();

  return (
    <main className="max-w-6xl flex flex-col mx-auto my-12 gap-3">
      <ShippingData />
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
      <div className="flex flex-row-reverse gap-3">
        <button
          className="btn"
          onClick={async () => {
            await checkout().then(() => {
              clearCart();
            });
          }}
        >
          Checkout
        </button>
        <button className="btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </main>
  );
}

const ShippingData = () => {
  const navigate = useNavigate();
  const { shipping } = useShippingStore();

  const isEmpty = Object.values(shipping).some((v) => v === '');

  if (isEmpty) {
    return (
      <div className="flex flex-row gap-3 p-3 justify-center">
        <button className="bg-teal-800 text-white font-medium p-3 px-6 rounded-md hover:opacity-60 cursor-pointer animate-pulse">
          Add Shipping Data
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-3 p-4 justify-between items-center shadow">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-zinc-500">
          Name <span className="text-zinc-900">{shipping.name}</span>
        </p>
        <p className="text-sm text-zinc-500">
          Email <span className="text-zinc-900">{shipping.email}</span>
        </p>
        <p className="text-sm text-zinc-500">
          Address <span className="text-zinc-900">{shipping.address}</span>
        </p>
      </div>
      <button
        onClick={() => {
          navigate({ to: '/shipping-info' });
        }}
        className="p-4 bg-zinc-100 rounded-full hover:bg-teal-200"
      >
        <Edit2Icon className="size-5" />
      </button>
    </div>
  );
};
