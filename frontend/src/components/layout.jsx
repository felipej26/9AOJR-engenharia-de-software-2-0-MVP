import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transações' },
  { to: '/categories', label: 'Categorias' },
  { to: '/budgets', label: 'Orçamentos' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="layout-header">
        <nav className="layout-nav">
          <Link to="/" className="layout-brand">
            Controle Financeiro
          </Link>
          <ul className="layout-nav-list">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={location.pathname === to ? 'active' : ''}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
