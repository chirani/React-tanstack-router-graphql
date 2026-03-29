import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '../zustand/cart';
import { ShoppingBag, Trash2 as Trash } from 'lucide-react';

const CartDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { cart, removeFromCart } = useCartStore();

  const total = cart.reduce(
    (sum, item) => sum + item.price.amount * item.quantity,
    0
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative px-4 py-2">
        <ShoppingBag
          className="text-zinc-900 cursor-pointer hover:text-teal-600 hover:opacity-60"
          size={28}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg p-4 z-50">
          <h3 className="font-bold mb-3">My Cart</h3>

          {cart.length === 0 && <p>Your cart is empty</p>}

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
            {cart.map((item, index) => (
              <div key={index} className="border p-2">
                <p className="font-semibold">{item.name}</p>
                <p>${item.price.amount}</p>
                <p>Qty: {item.quantity}</p>

                <div className="text-sm text-gray-600">
                  {item.attributes.map((attr, i) => (
                    <p key={i}>
                      {attr.attributeId}: {attr.attributeValueId}
                    </p>
                  ))}
                </div>
                <Trash
                  onClick={() => {
                    removeFromCart(item);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-2 flex justify-between">
            <span>Total:</span>
            <span className="font-bold">${total}</span>
          </div>

          <div className="flex gap-2 mt-3">
            <button className="border px-3 py-2 w-full">View Cart</button>
            <button className="bg-black text-white px-3 py-2 w-full">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
