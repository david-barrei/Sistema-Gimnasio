import axios from 'axios';

// Definimos la URL base de nuestro backend Django
const API_URL = 'http://localhost:8000';

/**
 * Servicio de Autenticación
 * Contiene las llamadas a la API relacionadas con la sesión del usuario.
 */
const authService = {
  /**
   * Envía las credenciales al backend para obtener el token de acceso.
   * @param {string} email - Correo del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta de la API (generalmente incluye el token)
   */
  login: async (email, password) => {
    try {
      // Hacemos una petición POST al endpoint de login
      const response = await axios.post(`${API_URL}/login/`, {
        email,
        password,
      });
      
      // Si la petición es exitosa, guardamos el token en localStorage para mantener la sesión
      if (response.data && response.data.Token) {
        localStorage.setItem('token', response.data.Token);
      }
      
      return response.data;
    } catch (error) {
      // Si hay un error (ej. credenciales inválidas), lo capturamos y lo lanzamos para manejarlo en el componente
      console.error("Error en authService.login:", error);
      throw error;
    }
  },

  /**
   * Elimina el token almacenado y cierra la sesión local.
   */
  /**
   * Elimina el token almacenado y cierra la sesión tanto en el backend como en local.
   */
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Le avisa a Django que borre el Token en Base de datos
        await axios.post(`${API_URL}/logout/`, {}, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      // Siempre elimina la sesión local aunque el servidor falle (ej. token ya expirado)
      localStorage.removeItem('token');
    }
  },

  /**
   * Verifica si el usuario tiene un token activo.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
