import { useEffect, useMemo, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';

export default function Header() {
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    category: '',
  });
  const { pathname } = useLocation();
  const isHome = useMemo(() => pathname === '/', [pathname]);

  const fetchCategories = useAppStore((state) => state.fetchCategories);
  const categories = useAppStore((state) => state.categories);
  const searchRecipes = useAppStore((state) => state.searchRecipes);
  const showNotification = useAppStore((state) => state.showNotification);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && value ? { category: '' } : {}),
      ...(name === 'category' && value ? { name: '' } : {}),
    }));
  };

  // const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
  //   setSearchFilters({
  //     ...searchFilters,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchFilters.name.trim() && !searchFilters.category) {
      showNotification({
        text: 'Debes ingresar un nombre o seleccionar una categoría',
        error: true,
      });
      return;
    }

    searchRecipes(searchFilters);

    setSearchFilters({
      name: '',
      category: '',
    });
  };

  // const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (Object.values(searchFilters).includes('')) {
  //     showNotification({
  //       text: 'Todos los campos son obligatorios',
  //       error: true,
  //     });
  //     return;
  //   }

  //   // Consultar las recetas
  //   searchRecipes(searchFilters);
  // };

  return (
    <header className={isHome ? 'bg-[url(/bg.jpg)] bg-center bg-cover' : 'bg-red-950'}>
      <div className="mx-auto container px-5 py-16">
        <div className="flex justify-between items-center">
          <div>
            <img className="w-52" src="/logo.png" alt="logotipo" />
          </div>

          <nav className="flex gap-4">
            <NavLink
              className={({ isActive }) =>
                isActive ? 'text-amber-500 uppercase font-bold' : 'text-white uppercase font-bold'
              }
              to="/"
            >
              Inicio
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'text-amber-500 uppercase font-bold' : 'text-white uppercase font-bold'
              }
              to="/favorites"
            >
              Favoritos
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'text-amber-500 uppercase font-bold' : 'text-white uppercase font-bold'
              }
              to="/generate"
            >
              Generar con IA
            </NavLink>
          </nav>
        </div>

        {isHome && (
          <form
            className="md:w-1/2 2xl:w-1/3 bg-red-950/90 my-32 p-10 rounded-lg shadow space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <label
                htmlFor="name"
                className="block text-white uppercase font-extrabold text-lg"
              >
                Nombre de la bebida
              </label>
              <input
                type="text"
                id="name"
                name="name"
                disabled={!!searchFilters.category}
                className="bg-white p-3 w-full rounded-lg focus:outline-none disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                placeholder="Ej. Margarita, Mojito, Martini, Vodka"
                onChange={handleChange}
                value={searchFilters.name}
              />
            </div>
            <div className="space-y-4">
              <label
                htmlFor="category"
                className="block text-white uppercase font-extrabold text-lg"
              >
                Categoría
              </label>
              <select
                id="category"
                name="category"
                disabled={!!searchFilters.name.trim()}
                className="bg-white p-3 w-full rounded-lg focus:outline-none disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                onChange={handleChange}
                value={searchFilters.category}
              >
                <option value="">-- Seleccione --</option>
                {categories.drinks.map((category) => (
                  <option key={category.strCategory} value={category.strCategory}>
                    {category.strCategory}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="submit"
              value="Buscar Recetas"
              className="cursor-pointer bg-linear-to-r from-red-800 to-amber-800 hover:from-red-900 hover:to-amber-900 text-white font-extrabold w-full p-2 rounded-lg uppercase"
            />
          </form>
        )}
      </div>
    </header>
  );
}
