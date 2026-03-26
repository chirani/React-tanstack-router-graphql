import { createFileRoute } from '@tanstack/react-router';
import { useStoreData } from '../queries/categories';
import ProductCard from '../components/ProductCard';

type IndexSearch = {
  category?: string;
};

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    return {
      category: typeof search.category === 'string' ? search.category : 'all',
    };
  },
  component: Index,
});

function Index() {
  const search = Route.useSearch();
  const { data, isSuccess } = useStoreData(search.category ?? 'all');
  const ProductList = isSuccess ? data.products : [];

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-300 my-12 mx-auto">
      {ProductList.map((product) => {
        return (
          <ProductCard
            key={product.id}
            {...product}
            price={product.prices[0].amount}
          />
        );
      })}
    </main>
  );
}
