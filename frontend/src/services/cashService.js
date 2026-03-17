// services/cashService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/cash/';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
};

const cashService = {
    // [GET] Consulta si hay una caja abierta actualmente
    // Según tu backend: def cash_session_active(request)
    getActiveSession: async () => {
        const response = await axios.get(`${API_URL}active`, getAuthHeaders());
        return response.data;
    },

    // [POST] Abrir un nuevo turno de caja enviando el saldo inicial (gaveta)
    // Según tu backend: CashSessionOpenView
    openSession: async (opening_balance) => {
        const payload = { opening_balance };
        const response = await axios.post(`${API_URL}open`, payload, getAuthHeaders());
        return response.data;
    },

    // [POST] Cerrar el turno actual mandando el total físico contado
    // Según tu backend: def cash_session_close(request)
    closeSession: async (closing_balance) => {
        const payload = { closing_balance };
        const response = await axios.post(`${API_URL}close`, payload, getAuthHeaders());
        return response.data;
    }
};

export default cashService;
