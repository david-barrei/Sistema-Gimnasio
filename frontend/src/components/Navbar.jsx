import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-uppercase" to="/clients">Systems Gym</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/clients">Clientes</Link>
            </li>
          </ul>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Cerrar Sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
