import { useState, useRef, useEffect } from 'react';
import { useCartStore, type CartItem } from '../zustand/cart';
import { ShoppingBag, Trash2 as Trash } from 'lucide-react';
import { toKebabCase } from '../utils/strings';
import { Link } from '@tanstack/react-router';

const CartDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { cart } = useCartStore();

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
      <button
        onClick={() => setOpen(!open)}
        className="relative px-4 py-2"
        data-testid="cart-btn"
      >
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
              <CartItem key={index} {...item} />
            ))}
          </div>

          <div className="mt-4 border-t pt-2 flex justify-between">
            <span>Total:</span>
            <span className="font-bold" data-testid={'cart-item-amount'}>
              ${Math.round(total * 100) / 100}
            </span>
          </div>

          <div className="flex mt-3">
            <Link
              disabled={!Boolean(total)}
              to="/checkout"
              className="bg-black text-center text-white px-3 py-2 w-full active:bg-teal-700"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

interface CartItemProps extends CartItem {}

const CartItem: React.FC<CartItemProps> = (props) => {
  const { removeFromCart } = useCartStore();
  return (
    <div data-testid={`cart-item-attribute-${toKebabCase(props.name)}`}>
      <div className="flex flex-row gap-3">
        <figure className="size-18 bg-red-200">
          <img src={props.productContent} className="w-full h-full" />
        </figure>
        <div className="flex flex-col flex-1">
          <p className="font-semibold">{props.name}</p>
          <div className="text-sm text-zinc-700 flex flex-col flex-wrap mb-2">
            {props.attributes.map((attr) => (
              <p
                key={attr.attributeId}
                className="font-medium text-xs"
                data-testid={`cart-item-attribute-${toKebabCase(props.name)}-${toKebabCase(attr.attributeId)}`}
              >
                {attr.attributeId}{' '}
                <span className="text-teal-700">{attr.attributeValueId}</span>
              </p>
            ))}
          </div>
          <p>${props.price.amount}</p>

          <div className="py-2 flex flex-row justify-between">
            <p>Qty: {props.quantity}</p>
            <Trash
              onClick={() => {
                removeFromCart(props);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
