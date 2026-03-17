// services/saleService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/sale/';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
};

const saleService = {
    // [GET] Listar todo el historial de ventas
    list: async () => {
        const response = await axios.get(`${API_URL}list/`, getAuthHeaders());
        return response.data;
    },

    // [GET] Detalle de una venta puntual por su ID
    detail: async (id) => {
        const response = await axios.get(`${API_URL}detail/${id}/`, getAuthHeaders());
        return response.data;
    },

    // [POST] Crear una nueva venta desde el POS
    // El payload debe contener: { "items": [ {"product": 1, "quantity": 2}, ... ] }
    create: async (saleData) => {
        const response = await axios.post(`${API_URL}create/`, saleData, getAuthHeaders());
        return response.data;
    }
};

export default saleService;
