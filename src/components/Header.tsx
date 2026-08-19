import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-slate-800">
      <div className="mx-auto container px-5 py-16">
        <div className="flex justify-between items-center">
          <div>
            <img className="w-32" src="/logo.svg" alt="logotipo" />
          </div>

          <nav className='flex gap-4'>
            <Link className="text-white uppercase font-bold" to="/">
              Inicio
            </Link>
            <Link className="text-white uppercase font-bold" to="/favoritos">
              Favoritos
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
