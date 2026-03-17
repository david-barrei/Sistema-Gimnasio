import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * Componente LoginPage
 * Renderiza el formulario de inicio de sesión con estilo minimalista (Gimnasio).
 */
const Login = () => {
  const navigate = useNavigate();
  // Estados para manejar el formulario y los mensajes de error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene que la página se recargue
    setError(''); // Limpiamos errores previos
    setLoading(true);

    try {
      // Llamamos al servicio de autenticación
      const data = await authService.login(email, password);
      console.log('Login exitoso:', data);
      
      // Redirigir al usuario al Dashboard principal
      navigate('/dashboard');
    } catch (err) {
      // Si el backend devuelve un error (ej. 401 Unauthorized), mostramos un mensaje
      if (err.response && err.response.status === 400) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else {
        setError('Ocurrió un error al conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal: Ocupa toda la pantalla, fondo oscuro, centrado.
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-light">
      <div className="card bg-secondary text-white shadow-lg border-0" style={{ width: '22rem', borderRadius: '15px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            {/* Título de la app */}
            <h2 className="fw-bold text-uppercase">Systems Gym</h2>
            <p className="text-light opacity-75 small">Accede a tu panel de control</p>
          </div>

          {/* Mostrar mensaje de error si existe */}
          {error && (
            <div className="alert alert-danger py-2 text-center small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label text-light small fw-bold">Correo Electrónico</label>
              <input
                type="email"
                className="form-control bg-dark text-white border-secondary"
                id="emailInput"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="passwordInput" className="form-label text-light small fw-bold">Contraseña</label>
              <input
                type="password"
                className="form-control bg-dark text-white border-secondary"
                id="passwordInput"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 fw-bold text-uppercase"
              disabled={loading}
              style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
