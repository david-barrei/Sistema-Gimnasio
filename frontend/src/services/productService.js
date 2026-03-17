// services/productService.js
// Importamos nuestro cliente axios configurado en authService
import axios from 'axios';

// La URL base del backend para productos
const API_URL = 'http://127.0.0.1:8000/product/';

// Función auxiliar para obtener los headers con el token dinámicamente
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
};

const productService = {
    // [GET] Listar todos los productos
    list: async () => {
        // Petición a /product/list/
        const response = await axios.get(`${API_URL}list/`, getAuthHeaders());
        return response.data;
    },

    // [GET] Obtener los detalles de un solo producto por su ID
    detail: async (id) => {
        // Petición a /product/detail/<id>/
        const response = await axios.get(`${API_URL}detail/${id}/`, getAuthHeaders());
        return response.data;
    },

    // [POST] Crear un nuevo producto
    create: async (productData) => {
        // Petición a /product/create/
        const response = await axios.post(`${API_URL}create/`, productData, getAuthHeaders());
        return response.data;
    },

    // [PUT] Actualizar un producto existente
    update: async (id, productData) => {
        // Petición a /product/update/<id>/
        const response = await axios.put(`${API_URL}update/${id}/`, productData, getAuthHeaders());
        return response.data;
    },

    // [DELETE] Eliminar un producto
    destroy: async (id) => {
        // Petición a /product/destroy/<id>/
        const response = await axios.delete(`${API_URL}destroy/${id}/`, getAuthHeaders());
        return response.data;
    }
};

export default productService;
