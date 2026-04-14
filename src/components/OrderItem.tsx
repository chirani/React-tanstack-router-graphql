import { useEffect, useState } from 'react';
import { useProductData } from '../queries/products';
import { useCartStore, type CartItem as CartItemType } from '../zustand/cart';
import type { Attribute, AttributeItem } from '../graphql/queryTypes';
import { MinusSquareIcon, PlusSquareIcon, TrashIcon } from 'lucide-react';
import { toKebabCase } from '../utils/strings';

interface OrderItemProps extends CartItemType {}

const OrderItem: React.FC<OrderItemProps> = (props) => {
  const { productId } = props;
  const { addToCart, removeFromCart, updateCartItem } = useCartStore();
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
  }, [data]);

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
    <div className="flex flex-row gap-4 shadow-sm p-4">
      <figure className="size-36 aspect-square overflow-hidden rounded-md">
        <img src={props.productContent} />
      </figure>
      <div className="flex flex-col py-3">
        <h2 className="font-medium text-lg mb-2">{props.name}</h2>

        {product.attributes?.map((attr: Attribute) => (
          <div
            key={attr.id}
            data-testid={`product-attribute-${toKebabCase(attr.id)}`}
          >
            <p className="font-medium mb-2">{attr.id}</p>
            {attr.id === 'Color' ? (
              <div className="flex flex-wrap gap-2">
                {attr.items
                  .sort((a, b) => a.position - b.position)
                  .map((item: AttributeItem) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(attr.id, item.id)}
                      className={`border-3 p-1 ${
                        selectedAttributes[attr.id] === item.id
                          ? 'border-zinc-900'
                          : 'border-transparent'
                      }`}
                    >
                      <div
                        className="size-6"
                        style={{ backgroundColor: item.value }}
                      ></div>
                    </button>
                  ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {attr.items
                  .sort((a, b) => a.position - b.position)
                  .map((item: AttributeItem) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(attr.id, item.id)}
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
        <div className="flex flex-row items-center mt-3">
          <PlusSquareIcon onMouseDown={() => addToCart(props)} />
          <p className="p-2">{props.quantity}</p>
          {props.quantity > 1 ? (
            <MinusSquareIcon onMouseDown={() => removeFromCart(props)} />
          ) : (
            <TrashIcon onMouseDown={() => removeFromCart(props)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
