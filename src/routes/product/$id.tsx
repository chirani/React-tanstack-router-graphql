import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useProductData } from '../../queries/products';
import type { Attribute, AttributeItem } from '../../graphql/queryTypes';
import { getPreviewText, toKebabCase } from '../../utils/strings';
import { useCartStore } from '../../zustand/cart';

export const Route = createFileRoute('/product/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data, isSuccess, isLoading } = useProductData(params.id);
  const { addToCart } = useCartStore();
  const [selectedImage, setSelectedImage] = useState('');
  const [isFullDescription, toggleFullDescription] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (data?.product.length) {
      let attrs = data.product[0]?.attributes;
      attrs.map((attr) => {
        setSelectedAttributes((prev) => ({
          ...prev,
          [attr.id]: attr.items[0].id,
        }));
      });
    }
  }, [data]);

  const products = isSuccess ? data.product : [];

  const handleSelect = (attrId: string, itemId: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attrId]: itemId,
    }));
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

  const onAddToCart = () => {
    console.log(selectedAttributes);

    const attrs = Object.entries(selectedAttributes).map(
      ([attributeId, attributeValueId]) => ({
        attributeId,
        attributeValueId,
      })
    );

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.prices[0],
      attributes: attrs,
      quantity: 1,
      productContent: product.gallery.length ? product.gallery[0] : '',
    });
  };

  return (
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <figure className="aspect-square w-full overflow-hidden rounded-md">
          <img
            src={selectedImage || product.gallery[0]}
            alt={product.name}
            className="max-h-full mx-auto object-cover"
          />
        </figure>

        <div
          data-testid="product-gallery"
          className="flex gap-2 flex-wrap mt-3"
        >
          {product.gallery.map((img: string) => (
            <figure className="h-20 w-20">
              <img
                key={img}
                src={img}
                onClick={() => setSelectedImage(img)}
                className="max-h-20 object-cover cursor-pointer hover:opacity-70"
              />
            </figure>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>

        <p className="text-xl font-bold">${product.prices[0].amount}</p>

        {product.attributes?.map((attr: Attribute) => (
          <div
            key={attr.id}
            data-testid={`product-attribute-${toKebabCase(attr.id)}`}
          >
            <p className="font-medium mb-2">{attr.id}</p>
            <div className="flex gap-2">
              {attr.items.map((item: AttributeItem) => (
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
          </div>
        ))}
        <p
          data-testid="product-description"
          dangerouslySetInnerHTML={{
            __html: isFullDescription
              ? product.description
              : getPreviewText(product.description, 20),
          }}
        ></p>
        <button
          hidden={product.description.length < 199}
          onClick={() => toggleFullDescription((prev) => !prev)}
          className="text-blue-500 mt-2"
        >
          {isFullDescription ? 'Show Less' : 'Show More'}
        </button>
        <button
          data-testid="add-to-cart"
          disabled={!product.inStock}
          onMouseDown={() => onAddToCart()}
          className="mt-4 bg-black disabled:bg-zinc-300 cursor-pointer text-white py-3 rounded hover:opacity-80"
        >
          Add to Cart
        </button>
      </div>
    </main>
  );
}
