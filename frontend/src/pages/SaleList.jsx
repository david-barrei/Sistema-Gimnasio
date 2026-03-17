import { useState, useEffect } from 'react';
import { FiEye, FiSearch, FiCalendar, FiDollarSign, FiLoader } from 'react-icons/fi';
import saleService from '../services/saleService';
import Layout from '../components/Layout';

const SaleList = () => {
  // --------- ESTADOS ---------
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --------- OBTENER VENTAS DEL BACKEND ---------
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const data = await saleService.list();
      setSales(data);
    } catch (error) {
      console.error("Error cargando el historial de ventas:", error);
      alert("Hubo un error cargando las ventas.");
    } finally {
      setLoading(false);
    }
  };

  // Simples métricas (Calculadas en base a los datos obtenidos)
  const totalSalesValue = sales.reduce((acc, sale) => acc + parseFloat(sale.total), 0);

  const filteredSales = sales.filter(sale => {
    const term = searchTerm.toLowerCase();
    return sale.id.toString().includes(term) || (sale.date && sale.date.includes(term));
  });

  if (loading) {
    return (
      <Layout title="HISTORIAL DE VENTAS">
        <div className="d-flex flex-column justify-content-center align-items-center mt-5 text-teal">
          <FiLoader size={48} className="spin-animation mb-3" />
          <h5>Cargando historial...</h5>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="HISTORIAL DE VENTAS">

      {/* Tarjetas de Métricas Superiores */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Ventas Registradas</p>
              <h2 className="display-4 fw-bold mb-0 text-main">{sales.length}</h2>
            </div>
            <div className="bg-light rounded-circle p-3 text-muted">
              <FiCalendar size={32} />
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Importe Total</p>
              <div className="d-flex align-items-center gap-2">
                <h2 className="display-4 fw-bold mb-0 text-teal">${totalSalesValue.toFixed(2)}</h2>
              </div>
            </div>
            <div className="bg-light rounded-circle p-3 text-teal">
              <FiDollarSign size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta Principal de la Tabla */}
      <div className="card-custom p-0">
        
        {/* Cabecera y Controles */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
          <h5 className="mb-0 fw-bold text-uppercase">Tickets Emitidos</h5>
          <div className="d-flex gap-3">
            <div className="input-group input-group-sm" style={{ width: '250px' }}>
              <span className="input-group-text bg-white border-end-0 text-muted"><FiSearch /></span>
              <input 
                type="text" 
                className="form-control border-start-0 shadow-none ps-0" 
                placeholder="Buscar por #Ticket..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabla sin bordes */}
        <div className="table-responsive px-4 pb-2 mt-3">
          <table className="table table-borderless align-middle mb-0">
            <thead className="border-bottom">
              <tr>
                <th className="text-muted fw-bold small pb-3">No. Ticket</th>
                <th className="text-muted fw-bold small pb-3">Fecha y Hora</th>
                <th className="text-muted fw-bold small pb-3">Cajero</th>
                <th className="text-muted fw-bold small pb-3 text-center">Cant. Ítems</th>
                <th className="text-muted fw-bold small pb-3 text-end">Total</th>
                <th className="text-muted fw-bold small pb-3 text-center">Estado</th>
                <th className="text-muted fw-bold small pb-3 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">No se encontraron ventas registradas.</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="fw-bold text-dark py-3">#{sale.id}</td>
                    <td className="text-muted small fw-semibold">{new Date(sale.date || sale.created_at).toLocaleString()}</td>
                    <td className="text-main fw-semibold">{sale.user_name || 'Admin'}</td>
                    <td className="text-center fw-semibold text-muted">{sale.items ? sale.items.length : 0}</td>
                    <td className="text-end fw-bold text-teal">${parseFloat(sale.total).toFixed(2)}</td>
                    <td className="text-center">
                      <span className="badge-active bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                        Exitosa
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="action-btn" title="Ver Detalle Ticket (Próximamente)" onClick={() => alert("Mostrando Detalle del Ticket #" + sale.id)}>
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-3 text-end text-muted small bg-light">
          Mostrando {filteredSales.length} comprobantes.
        </div>
      </div>

    </Layout>
  );
};

export default SaleList;
