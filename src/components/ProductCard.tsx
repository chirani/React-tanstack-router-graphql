import { Link } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  gallery: string[];
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  return (
    <Link
      to="/product/$id"
      params={{ id: props.id }}
      className="p-3 shadow-sm rounded-lg flex flex-col gap-2 bg-white"
    >
      <figure className="group flex items-center justify-center aspect-square w-full overflow-hidden rounded-md relative">
        <img
          src={props.gallery[0]}
          alt={props.name}
          className="w-full hover:scale-80 transition duration-300 object-cover"
        />
        <div className="invisible group-hover:visible hover:opacity-60 p-3 bg-teal-600 absolute rounded-full top-4 right-4 opacity-80">
          <ShoppingBag className="text-white" />
        </div>
      </figure>

      <div className="flex flex-col">
        <h2 className="text-sm font-medium">{props.name}</h2>
        <p className="text-lg font-semibold">${props.price}</p>

        <span
          className={`text-xs self-end ${
            props.inStock ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {props.inStock ? 'In stock' : 'Out of stock'}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
