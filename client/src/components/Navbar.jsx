import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const active = location.pathname === path;
    return `px-4 py-2 rounded-lg font-medium transition ${
      active
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 mb-8 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">RFQ Management</h1>
        <div className="flex space-x-2">
          <Link to="/" className={getLinkClass('/')}>
            Tambah RFQ & List
          </Link>
          <Link to="/add-company" className={getLinkClass('/add-company')}>
            Tambah Perusahaan
          </Link>
        </div>
      </div>
    </nav>
  );
}