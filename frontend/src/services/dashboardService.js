// services/dashboardService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/dashboard/';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
};

const dashboardService = {
    // [GET] Obtener todas las métricas agrupadas para el dashboard
    getMetrics: async () => {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    }
};

export default dashboardService;
