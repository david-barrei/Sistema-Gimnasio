import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8000';

// Configurar interceptor para inyectar token en cada petición
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

const clientService = {
  // Obtener lista de clientes
  list: async () => {
    const response = await api.get('/client/list/');
    return response.data;
  },

  // Obtener un cliente específico
  detail: async (id) => {
    const response = await api.get(`/client/detail/${id}/`);
    return response.data;
  },

  // Crear un cliente
  create: async (data) => {
    const response = await api.post('/client/', data);
    return response.data;
  },

  // Actualizar un cliente
  update: async (id, data) => {
    const response = await api.put(`/client/update/${id}/`, data);
    return response.data;
  },

  // Eliminar un cliente
  destroy: async (id) => {
    const response = await api.delete(`/client/destroy/${id}/`);
    return response.data;
  }
};

export default clientService;
