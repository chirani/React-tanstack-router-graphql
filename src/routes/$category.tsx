import { createFileRoute } from '@tanstack/react-router';
import { useStoreCategory } from '../zustand/category';
import { useStoreData } from '../queries/products';
import ProductCard from '../components/ProductCard';
import { useEffect } from 'react';

export const Route = createFileRoute('/$category')({
  component: RouteComponent,
  head: ({ params }) => {
    return {
      meta: [{ title: `Home - ${params.category}` }],
    };
  },
});

function RouteComponent() {
  const { category } = Route.useParams();
  const { updateCateogryId } = useStoreCategory();
  const { data, isSuccess, isLoading, isError, error } = useStoreData(
    category ?? 'all'
  );

  useEffect(() => {
    if (category) {
      updateCateogryId(category);
    }
  }, [category]);

  const ProductList = isSuccess ? data.products : [];

  if (isLoading) {
    return <div className="my-12 mx-auto text-center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="my-12 mx-auto text-center">
        Something went wrong: {error.message}
      </div>
    );
  }

  if (!data?.products?.length) {
    return <div className="my-12 mx-auto text-center">No products found.</div>;
  }

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-300 my-12 mx-auto">
      <h1 className="hidden">Product List</h1>
      {ProductList.map((product) => {
        return (
          <ProductCard
            key={product.id}
            {...product}
            price={product.prices[0]}
          />
        );
      })}
    </main>
  );
}
