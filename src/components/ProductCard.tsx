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
    <div className="p-3 shadow-sm rounded-lg flex flex-col gap-2 bg-white">
      <figure className="flex items-center justify-center aspect-square w-full overflow-hidden rounded-md">
        <img
          src={props.gallery[0]}
          alt={props.name}
          className="w-full hover:scale-80 transition duration-300 object-cover"
        />
      </figure>

      <div className="flex flex-col">
        <h2 className="text-sm font-medium">{props.name}</h2>
        <p className="text-lg font-semibold">${props.price}</p>

        <span
          className={`text-xs ${
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
