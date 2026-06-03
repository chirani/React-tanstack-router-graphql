import { Link } from '@tanstack/react-router';
import { useCategories } from '../queries/products';
import { capitalizeFirstLetter } from '../utils/strings';
import { useStoreCategory } from '../zustand/category';
import CartDropdown from './CartDropdown';
import { useState } from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { id: categoryId } = useStoreCategory();
  const { data, isSuccess } = useCategories();
  const categories = isSuccess ? data.categories : [];

  const testAttributes = (isActive: boolean) => ({
    'data-testid': isActive ? 'active-category-link' : 'category-link',
  });

  return (
    <nav className="flex flex-row sticky top-0 z-50 bg-white">
      <div className="m-auto w-[1200px] sm:px-4 flex flex-row">
        <div className="flex-1 sm:hidden">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-full p-4 rounded-md text-green-800 text-left font-medium"
          >
            {capitalizeFirstLetter(categoryId)}
          </button>

          {open && (
            <div className="absolute top-full left-0 w-96 max-w-full bg-white shadow z-10">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to="/$category"
                  params={{ category: category.id }}
                  onClick={() => setOpen(false)}
                  className={`block p-3 ${
                    category.id === categoryId
                      ? 'bg-green-100 text-green-700'
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
        <div className="hidden sm:flex gap-4 flex-1">
          {categories.map((category) => {
            return (
              <Link
                key={category.id}
                to="/$category"
                className={`p-5 ${category.id === categoryId ? 'text-green-500 border-b-2 border-green-400' : 'text-black'} hover:opacity-40`}
                params={{ category: category.id }}
                {...testAttributes}
                {...testAttributes(category.id === categoryId)}
              >
                {capitalizeFirstLetter(category.name)}
              </Link>
            );
          })}
        </div>
        <div className="flex-1 flex items-center justify-center font-medium">
          <img src={logo} alt="my_logo" className="h-12" />
        </div>
        <div className="flex-1 flex flex-row-reverse items-center">
          <CartDropdown />
        </div>{' '}
      </div>
    </nav>
  );
};

export default Navbar;
