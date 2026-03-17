import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiFileText, FiLogOut, FiBox, FiMonitor, FiDollarSign } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div 
      className="d-flex flex-column align-items-center py-4 vh-100" 
      style={{ 
        width: '80px', 
        backgroundColor: 'var(--bg-sidebar)', 
        position: 'fixed' 
      }}
    >
      {/* Brand Icon or Logo placeholder */}
      <div className="mb-5 text-teal fs-4 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
        <strong>S</strong>
      </div>

      <nav className="nav flex-column w-100 px-3 gap-2">
        <NavLink to="/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} title="Dashboard">
          <FiHome size={24} />
        </NavLink>
        <NavLink to="/pos" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} title="Punto de Venta (POS)">
          <FiMonitor size={24} />
        </NavLink>
        <NavLink to="/cash" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} title="Caja">
          <FiDollarSign size={24} />
        </NavLink>
        <NavLink to="/products" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} title="Inventario de Productos">
          <FiBox size={24} />
        </NavLink>
        <NavLink to="/sales" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} title="Historial de Ventas">
          <FiFileText size={24} />
        </NavLink>
        <NavLink to="/clients" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} title="Usuarios / Clientes">
          <FiUsers size={24} />
        </NavLink>
        <NavLink to="/documents" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} title="Documentos">
          <FiFileText size={24} />
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} title="Ajustes">
          <FiSettings size={24} />
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
