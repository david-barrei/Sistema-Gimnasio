import { FiSearch, FiBell } from 'react-icons/fi';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <header className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
      {/* Título de la Sección Actual */}
      <h4 className="mb-0 fw-bold" style={{ letterSpacing: '0.5px' }}>{title}</h4>

      {/* Controles del Header */}
      <div className="d-flex align-items-center gap-4">
        {/* Ícono de Búsqueda */}
        <button className="btn btn-link text-muted p-0 border-0">
          <FiSearch size={20} />
        </button>

        {/* Notificaciones */}
        <button className="btn btn-link text-muted p-0 border-0 position-relative">
          <FiBell size={20} />
          {/* Badge de alerta (Punto rojo) */}
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">Nuevas alertas</span>
          </span>
        </button>

        {/* Perfil de Usuario */}
        <div className="dropdown">
          <button 
            className="btn btn-light bg-white border-0 shadow-sm d-flex align-items-center gap-2 rounded-pill px-2 py-1 dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            {/* Foto de perfil simulada */}
            <div 
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" 
              style={{ width: '32px', height: '32px', fontSize: '14px' }}
            >
              AD
            </div>
            <span className="small fw-semibold text-dark me-1">Admin User</span>
          </button>
          
          <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
            <li><button className="dropdown-item small" type="button">Mi Perfil</button></li>
            <li><button className="dropdown-item small" type="button">Configuración</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button 
                className="dropdown-item small text-danger fw-bold d-flex align-items-center" 
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
