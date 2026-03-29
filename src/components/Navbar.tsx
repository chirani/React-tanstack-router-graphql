import { Link } from '@tanstack/react-router';
import { useCategories } from '../queries/categories';
import { capitalizeFirstLetter } from '../utils/strings';
import { Anchor, ShoppingBag } from 'lucide-react';
import { useStoreCategory } from '../zustand/category';
import CartDropdown from './CartDropdown';

const Navbar = () => {
  const { id: categoryId } = useStoreCategory();
  const { data, isSuccess } = useCategories();
  const categories = isSuccess ? data.categories : [];

  return (
    <nav className="flex flex-row px-4 sticky top-0 z-50 bg-white shadow-xs">
      <div className="flex gap-4 flex-1">
        {categories.map((category) => {
          return (
            <Link
              key={category.id}
              to="/"
              className={`p-4 ${category.id === categoryId ? 'border-b-3 border-teal-600' : 'text-zinc-900'} hover:opacity-40`}
              search={{ category: category.id }}
            >
              {capitalizeFirstLetter(category.name)}
            </Link>
          );
        })}
      </div>
      <div className="flex-1 flex items-center justify-center font-medium">
        <Anchor className="text-teal-400" />
      </div>
      <div className="flex-1 flex flex-row-reverse items-center px-4">
        <CartDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
