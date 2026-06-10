import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { useProductData } from '../../queries/products';
import type { Attribute, AttributeItem } from '../../graphql/queryTypes';
import { getPreviewText, toKebabCase } from '../../utils/strings';
import { useCartStore } from '../../zustand/cart';
import useToastStore from '../../zustand/toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/product/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { addToCart, toggleCart } = useCartStore();
  const { addToast } = useToastStore();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isFullDescription, toggleFullDescription] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const { data, isSuccess, isLoading } = useProductData(params.id);

  useEffect(() => {
    if (data?.product.length) {
      document.title = data?.product[0].name;
      let attrs = data.product[0]?.attributes;
      attrs.map((attr) => {
        setSelectedAttributes((prev) => ({
          ...prev,
          [attr.id]: '',
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

  const rawContent = isFullDescription
    ? product.description
    : getPreviewText(product.description, 20);

  const onAddToCart = () => {
    const isAttributeValueEmpty = Object.values(selectedAttributes).some(
      (sav) => sav === ''
    );

    if (isAttributeValueEmpty) {
      addToast('You need to select all attributes', 'error');
      return;
    }

    const attrs = Object.entries(selectedAttributes).map(
      ([attributeId, attributeValueId]) => {
        return {
          attributeId,
          attributeValueId,
        };
      }
    );

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.prices[0],
      attributes: attrs,
      quantity: 1,
      productContent: product.gallery.length ? product.gallery[0] : '',
    });

    toggleCart(true);
    addToast('Product added to cart', 'info');
  };

  const isAttributeValueEmpty = Object.values(selectedAttributes).some(
    (sav) => sav === ''
  );

  const gallery = product.gallery;

  return (
    <main className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-10">
      <div className="flex flex-col-reverse md:flex-row md:flex-2 gap-1">
        <div
          data-testid="product-gallery"
          className="flex flex-row md:flex-col gap-2 flex-wrap mt-3"
        >
          {product.gallery.map((img: string, imgIndex) => (
            <figure key={img} className="h-20 w-20">
              <img
                src={img}
                onClick={() => setSelectedImage(imgIndex)}
                className="max-h-20 object-cover cursor-pointer hover:opacity-70"
              />
            </figure>
          ))}
        </div>
        <div className="relative md:flex-1">
          <figure className="aspect-square overflow-hidden">
            <img
              src={gallery[selectedImage] || product.gallery[0]}
              alt={product.name}
              className="max-h-full mx-auto object-cover"
            />
          </figure>

          {selectedImage > 0 && (
            <ChevronLeft
              onMouseDown={() => {
                selectedImage > 0 ? setSelectedImage(selectedImage - 1) : 0;
              }}
              size={40}
              className="bg-zinc-800 p-2 rounded absolute left-0 top-1/2 -translate-y-1/2 z-300 hover:opacity-80 text-white"
            />
          )}
          {selectedImage < gallery.length - 1 && (
            <ChevronRight
              onMouseDown={() => {
                selectedImage < gallery.length - 1
                  ? setSelectedImage(selectedImage + 1)
                  : gallery.length - 1;
              }}
              size={40}
              className="bg-zinc-800 p-2 rounded absolute right-0 top-1/2 -translate-y-1/2 z-300 hover:opacity-80 text-white"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-1 self-stretch">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p
            className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}
          >
            {product.inStock ? 'Stock Available' : 'Out of Stock'}
          </p>
        </div>
        {product.attributes?.map((attr: Attribute) => (
          <div
            key={attr.id}
            data-testid={`product-attribute-${toKebabCase(attr.id)}`}
          >
            <p className="font-medium mb-2">{attr.id}</p>
            {attr.id === 'Color' ? (
              <div className="flex flex-wrap gap-2">
                {attr.items
                  .sort((a, b) => b.position - a.position)
                  .map((item: AttributeItem) => (
                    <button
                      key={item.displayValue}
                      onClick={() => handleSelect(attr.id, item.id)}
                      data-testid={`product-attribute-color-${item.value}${selectedAttributes[attr.id] === item.id ? '-selected' : ''}`}
                      className={`p-0.5 border-3 ${
                        selectedAttributes[attr.id] === item.id
                          ? 'border-zinc-900'
                          : 'border-zinc-200'
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
              <div className="flex flex-wrap gap-2">
                {attr.items
                  .sort((a, b) => a.position - b.position)
                  .map((item: AttributeItem) => (
                    <button
                      key={item.displayValue}
                      onClick={() => handleSelect(attr.id, item.id)}
                      data-testid={`product-attribute-${toKebabCase(attr.id)}-${item.value}${selectedAttributes[attr.id] === item.id ? '-selected' : ''}`}
                      className={`px-4 py-1.5 border ${
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

        <p className="text-lg font-bold">PRICE</p>
        <p className="text-2xl font-bold font-raleway">
          ${product.prices[0].amount}
        </p>
        <button
          data-testid="add-to-cart"
          disabled={!product.inStock || isAttributeValueEmpty}
          onMouseDown={() => onAddToCart()}
          className="mt-4 bg-green-600 font-medium disabled:bg-zinc-300 cursor-pointer text-white py-3 hover:opacity-80"
        >
          Add to Cart
        </button>
        <p data-testid="product-description">{parse(rawContent)}</p>
        <button
          hidden={product.description.length < 199}
          onClick={() => toggleFullDescription((prev) => !prev)}
          className="text-blue-500 mt-2"
        >
          {isFullDescription ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </main>
  );
}
