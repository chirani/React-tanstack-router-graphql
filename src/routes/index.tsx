import { createFileRoute } from '@tanstack/react-router';
import { useStoreData } from '../queries/categories';
import ProductCard from '../components/ProductCard';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data, isSuccess } = useStoreData('all');
  const ProductList = isSuccess ? data.products : [];
  console.log(ProductList[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-300 my-12 mx-auto">
      {ProductList.map((product) => {
        return (
          <ProductCard
            key={product.id}
            {...product}
            price={product.prices[0].amount}
          />
        );
      })}
    </div>
  );
}
