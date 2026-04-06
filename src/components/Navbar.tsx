import { Link } from '@tanstack/react-router';
import { useCategories } from '../queries/products';
import { capitalizeFirstLetter } from '../utils/strings';
import { Anchor } from 'lucide-react';
import { useStoreCategory } from '../zustand/category';
import CartDropdown from './CartDropdown';
import { useState } from 'react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { id: categoryId } = useStoreCategory();
  const { data, isSuccess } = useCategories();
  const categories = isSuccess ? data.categories : [];

  const testAttributes = (isActive: boolean) => ({
    'data-testid': isActive ? 'active-category-link' : 'category-link',
  });

  return (
    <nav className="flex flex-row px-4 sticky top-0 z-50 bg-white shadow-xs">
      <div className="flex-1 sm:hidden">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full p-4 rounded-md text-teal-800 text-left font-medium"
        >
          {capitalizeFirstLetter(categoryId)}
        </button>

        {open && (
          <div className="absolute top-full left-0 w-96 max-w-full bg-white shadow z-10">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/"
                search={{ category: category.id }}
                onClick={() => setOpen(false)}
                className={`block p-3 ${
                  category.id === categoryId
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-zinc-900'
                } hover:bg-zinc-100`}
                {...testAttributes}
                {...testAttributes(category.id === categoryId)}
              >
                {capitalizeFirstLetter(category.name)}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="hidden sm:flex flex gap-4 flex-1">
        {categories.map((category) => {
          return (
            <Link
              key={category.id}
              to="/"
              className={`p-4 ${category.id === categoryId ? 'border-b-3 border-teal-600' : 'text-zinc-900'} hover:opacity-40`}
              search={{ category: category.id }}
              {...testAttributes}
              {...testAttributes(category.id === categoryId)}
            >
              {capitalizeFirstLetter(category.name)}
            </Link>
          );
        })}
      </div>

      <div className="flex-1 flex items-center justify-center font-medium">
        <Anchor className="text-teal-400" />
      </div>
      <div className="flex-1 flex flex-row-reverse items-center">
        <CartDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
