import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title }) => {
  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Contenedor Principal (Empujado 80px a la derecha por el sidebar) */}
      <div className="flex-grow-1" style={{ marginLeft: '80px' }}>
        <div className="container-fluid px-4 py-3 h-100 d-flex flex-column">
          
          {/* Header Superior Dinámico */}
          <Header title={title} />
          
          {/* Contenido Renderizado de la Página (Dashboard, Clients, etc) */}
          <div className="flex-grow-1">
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Layout;
