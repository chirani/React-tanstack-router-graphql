import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';
import {
  useCartStore,
  type AttributeSelection,
  type CartItem,
} from '../zustand/cart';
import type { Attribute, Price } from '../graphql/queryTypes';
import useToastStore from '../zustand/toast';
import { toKebabCase } from '../utils/strings';

interface ProductCardProps {
  id: string;
  name: string;
  price: Price;
  category: string;
  inStock: boolean;
  gallery: string[];
  attributes: Attribute[];
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useCartStore();
  const { addToast } = useToastStore();

  const onAddToCart = () => {
    const attributeSelection: AttributeSelection[] = props.attributes.map(
      (attr) => ({
        attributeId: attr.id,
        attributeValueId: attr.items[0].id,
      })
    );

    const cartItem: CartItem = {
      productId: props.id,
      productContent: props.gallery[0],
      name: props.name,
      quantity: 1,
      price: props.price,
      attributes: attributeSelection,
    };

    addToCart(cartItem);
  };

  return (
    <div
      className="p-3 shadow-sm rounded-lg flex flex-col gap-2 bg-white"
      data-testid={`product-${toKebabCase(props.name)}`}
    >
      <figure className="group flex items-center justify-center aspect-square w-full overflow-hidden rounded-md relative">
        <img
          onMouseDown={() => {
            navigate({ to: '/product/$id', params: { id: props.id } });
          }}
          src={props.gallery[0]}
          alt={props.name}
          className="w-full hover:scale-80 transition duration-300 object-cover"
        />

        <button
          className="invisible group-hover:visible hover:opacity-60 p-3 bg-teal-600 absolute rounded-full top-4 right-4 opacity-80 disabled:opacity-0"
          disabled={props.inStock}
          data-testid="add-to-cart"
          onMouseDown={() => {
            onAddToCart();
            toggleCart(true);
            addToast('Product Added To Cart', 'info');
          }}
        >
          <ShoppingBag className="text-white" />
        </button>
      </figure>

      <div className="flex flex-col">
        <h2 className="text-sm font-medium">{props.name}</h2>
        <p className="text-lg font-semibold">
          {props.price.currency.symbol}
          {props.price.amount}
        </p>

        <span
          className={`text-xs self-end ${
            props.inStock ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {props.inStock ? 'In stock' : 'Out of stock'}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
