import { useState, useRef, useEffect } from 'react';
import { useCartStore, type CartItem } from '../zustand/cart';
import {
  MinusSquareIcon,
  PlusSquareIcon,
  ShoppingBag,
  TrashIcon,
} from 'lucide-react';
import { toKebabCase } from '../utils/strings';
import { Link } from '@tanstack/react-router';
import { useProductData } from '../queries/products';
import type { Attribute, AttributeItem } from '../graphql/queryTypes';

const CartDropdown = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { cart, toggleCart, isOpen } = useCartStore();

  const total = cart.reduce(
    (sum, item) => sum + item.price.amount * item.quantity,
    0
  );

  const numberOfItems: number = cart.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => toggleCart(!isOpen)}
        className="relative px-4 py-2"
        data-testid="cart-btn"
      >
        <ShoppingBag
          className="text-zinc-900 cursor-pointer hover:text-teal-600 hover:opacity-60"
          size={28}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white shadow-lg p-4 z-50"
          data-testid="cart-overlay"
        >
          <h3 className="font-bold mb-3">My Cart</h3>

          {cart.length === 0 && <p>Your cart is empty</p>}

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
            {cart.map((item, index) => (
              <CartItem key={index} {...item} />
            ))}
          </div>
          <div>{`${numberOfItems} ${numberOfItems === 1 ? ' Item' : ' Items'}`}</div>
          <div className="mt-4 border-t pt-2 flex justify-between">
            <span>Total:</span>
            <span className="font-bold" data-testid="cart-total">
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
  const { productId } = props;
  const { addToCart, removeFromCart, updateCartItem, cart } = useCartStore();
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const { data, isLoading, isSuccess } = useProductData(productId);
  const products = isSuccess ? data.product : [];

  useEffect(() => {
    if (data?.product.length) {
      let cartAttrs = props.attributes;

      cartAttrs.map((attr) => {
        setSelectedAttributes((prev) => ({
          ...prev,
          [attr.attributeId]: attr.attributeValueId,
        }));
      });
    }
  }, [data, cart]);

  const handleSelect = (attrId: string, itemId: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attrId]: itemId,
    }));
    updateCartItem(props, {
      attributeId: attrId,
      attributeValueId: itemId,
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!products.length) {
    return <div className="my-12 text-center">404 Product not found</div>;
  }

  if (!isSuccess) {
    return <div className="p-6">Product not found</div>;
  }

  const product = products[0];

  return (
    <div data-testid={`cart-item-attribute-${toKebabCase(props.name)}`}>
      <div className="flex flex-row gap-3">
        <figure className="size-18 min-w-18">
          <img
            src={props.productContent}
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="flex flex-col flex-1">
          <p className="font-semibold">{props.name}</p>
          <div className="text-sm text-zinc-700 flex flex-col flex-wrap mb-2">
            {product.attributes.map((attr: Attribute) => (
              <div
                key={attr.id}
                data-testid={`product-attribute-${toKebabCase(attr.id)}`}
              >
                <p className="font-medium mb-2">{attr.id}</p>
                {attr.id === 'Color' ? (
                  <div key={attr.id} className="flex flex-wrap gap-2">
                    {attr.items
                      .sort((a, b) => a.position - b.position)
                      .map((item: AttributeItem) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(attr.id, item.id)}
                          data-testid={`product-attribute-color-${item.value}${selectedAttributes[attr.id] === item.id ? '-selected' : ''}`}
                          className={`border-3 p-1 ${
                            selectedAttributes[attr.id] === item.id
                              ? 'border-zinc-900'
                              : 'border-zinc-200'
                          }`}
                        >
                          <div
                            className="size-6"
                            style={{ backgroundColor: item.value }}
                          />
                        </button>
                      ))}
                  </div>
                ) : (
                  <div key={attr.id} className="flex flex-wrap gap-2">
                    {attr.items
                      .sort((a, b) => a.position - b.position)
                      .map((item: AttributeItem) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(attr.id, item.id)}
                          data-testid={`product-attribute-${toKebabCase(attr.id)}-${item.value}${selectedAttributes[attr.id] === item.id ? '-selected' : ''}`}
                          className={`px-3 py-1 border rounded ${
                            selectedAttributes[attr.id] === item.id
                              ? 'bg-black text-white'
                              : ''
                          }`}
                        >
                          {item.displayValue}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="font-bold text-teal-900" data-testid="cart-item-amount">
            ${props.price.amount}
          </p>

          <div className="py-2 flex flex-row justify-between">
            <div className="flex flex-row items-center">
              <button
                data-testid="cart-item-amount-increase"
                onMouseDown={() => addToCart(props)}
              >
                <PlusSquareIcon />
              </button>
              <p className="p-2">{props.quantity}</p>
              <button
                data-testid="cart-item-amount-decrease"
                onMouseDown={() => {
                  removeFromCart(props);
                }}
              >
                {props.quantity > 1 ? <MinusSquareIcon /> : <TrashIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
