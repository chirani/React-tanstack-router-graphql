import { createFileRoute } from '@tanstack/react-router';
import { useStoreData } from '../queries/products';
import ProductCard from '../components/ProductCard';
import { useEffect } from 'react';
import { useStoreCategory } from '../zustand/category';
import { capitalizeFirstLetter } from '../utils/strings';

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
  head: () => ({
    meta: [{ title: 'Home' }],
  }),
});

function Index() {
  const search = Route.useSearch();
  const { updateCateogryId } = useStoreCategory();
  const { data, isSuccess } = useStoreData(search.category ?? 'all');
  const ProductList = isSuccess ? data.products : [];

  useEffect(() => {
    if (search.category) {
      updateCateogryId(search.category);
    }
  }, [search.category]);

  return (
    <main className="max-w-300 my-12 mx-auto">
      <h1 className="font-raleway text-3xl mb-8">
        {capitalizeFirstLetter(search?.category ?? 'all')}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ProductList.map((product) => {
          return (
            <ProductCard
              key={product.id}
              {...product}
              price={product.prices[0]}
            />
          );
        })}
      </div>
    </main>
  );
}
