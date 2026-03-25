import { useCategories } from '../queries/categories';

const Navbar = () => {
  const { data, isSuccess } = useCategories();
  const categories = isSuccess ? data.categories : [];

  return (
    <>
      {categories.map((category) => {
        return <>{category.name}</>;
      })}
    </>
  );
};

export default Navbar;
