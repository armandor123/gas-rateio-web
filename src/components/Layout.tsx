import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">G</span>
          <div>
            <strong>GasRateio</strong>
            <small>Condomínio</small>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/torres">Torres</NavLink>
          <NavLink to="/medidores">Medidores</NavLink>
          <NavLink to="/leituras">Leituras</NavLink>
          <NavLink to="/contas-mensais">Contas Mensais</NavLink>
          <NavLink to="/rateios">Rateios</NavLink>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
