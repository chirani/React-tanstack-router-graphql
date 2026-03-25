import { Link } from '@tanstack/react-router';
import { useCategories } from '../queries/categories';
import { capitalizeFirstLetter } from '../utils/strings';
import { Anchor, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { data, isSuccess } = useCategories();
  const categories = isSuccess ? data.categories : [];

  return (
    <nav className="flex flex-row px-4 shadow-xs">
      <div className="flex gap-4 flex-1">
        {categories.map((category) => {
          return (
            <Link
              to="/"
              className="p-4 order-b-3 text-zinc-900 border-white hover:text-zinc-400"
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
        <ShoppingBag
          className="text-zinc-900 cursor-pointer hover:opacity-60"
          size={28}
        />
      </div>
    </nav>
  );
};

export default Navbar;
