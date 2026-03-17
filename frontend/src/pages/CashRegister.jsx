import { useState, useEffect } from 'react';
import { FiDollarSign, FiArchive, FiActivity, FiLogOut, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import cashService from '../services/cashService';
import Layout from '../components/Layout';

const CashRegister = () => {
  const navigate = useNavigate();

  // ========= ESTADOS SIMULADOS =========
  const [isSessionOpen, setIsSessionOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Datos reales desde backend
  const [sessionData, setSessionData] = useState({
    opening_balance: 0,
    expected_balance: 0,
    counted_amount: 0,
    status: 'closed',
    opened_by_name: '',
    opened_at: ''
  });

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchActiveSession();
  }, []);

  const fetchActiveSession = async () => {
    try {
      const active = await cashService.getActiveSession();
      if (active && active.id) {
        setIsSessionOpen(true);
        setSessionData(active);
        // El serializer de CashSession deberia traernos los txs si se configura
        // Por ahora simularemos la tabla vacía o con data mapeada si existe
        setTransactions(active.transactions || []);
      }
    } catch (error) {
      setIsSessionOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRegister = async () => {
    if (window.confirm('¿Estás seguro de cerrar el turno de caja actual de manera definitiva?')) {
      const counted = prompt("Por favor, ingresa el dinero físico exacto contado en caja:");
      if (counted !== null) {
        try {
          await cashService.closeSession(parseFloat(counted));
          alert("Caja Cerrada Exitosamente. Te regresaremos al POS.");
          setIsSessionOpen(false);
          navigate('/pos');
        } catch (error) {
          alert('Error al cerrar caja: ' + (error.response?.data?.Detail || error.message));
        }
      }
    }
  };

  if (loading) return <Layout title="ADMINISTRACIÓN DE CAJA"><div className="p-5 text-center">Cargando datos de caja...</div></Layout>;

  return (
    <Layout title="ADMINISTRACIÓN DE CAJA">
      {!isSessionOpen ? (
        // Si no hay caja, redirige amigablemente o avisa
        <div className="card-custom border-0 shadow text-center p-5 mt-5">
          <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-4 text-secondary" style={{width: 100, height: 100}}>
            <FiArchive size={48} />
          </div>
          <h3 className="fw-bold mb-2">No hay un turno de caja activo</h3>
          <p className="text-muted mb-4 small">Debes ir al Punto de Venta para abrir la caja primero.</p>
          <button onClick={() => navigate('/pos')} className="btn btn-dark px-4 py-2" style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}>
            Ir al Terminal (POS)
          </button>
        </div>
      ) : (
        // ================= VISTA: ADMINISTRADOR DE CAJA ABIERTA =================
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-0 fw-bold text-main">Rendimiento del Turno Actual</h5>
              <p className="text-muted small mb-0">Abierto por {sessionData.opened_by_name || 'Admin'} a las {new Date(sessionData.opened_at).toLocaleTimeString()}</p>
            </div>
            <button onClick={handleCloseRegister} className="btn btn-danger px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2">
              <FiLogOut /> Cierre de Caja (Día)
            </button>
          </div>

          {/* Tarjetas de Métricas de Caja */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
                <div>
                  <p className="text-muted fw-bold mb-1 small text-uppercase">Fondo Inicial</p>
                  <h3 className="fw-bold mb-0 text-main">${parseFloat(sessionData.opening_balance).toFixed(2)}</h3>
                </div>
                <div className="bg-light rounded-circle p-3 text-muted">
                  <FiArchive size={28} />
                </div>
              </div>
            </div>
            
            <div className="col-12 col-md-4">
              <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
                <div>
                  <p className="text-muted fw-bold mb-1 small text-uppercase">Ingresos Estimados</p>
                  <h3 className="fw-bold mb-0 text-teal">+ ${(parseFloat(sessionData.expected_balance) - parseFloat(sessionData.opening_balance)).toFixed(2)}</h3>
                </div>
                <div className="bg-light rounded-circle p-3 text-teal" style={{ background: 'var(--accent-teal-soft)'}}>
                  <FiTrendingUp size={28} />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between border-dark" style={{ borderLeft: '4px solid var(--accent-teal)'}}>
                <div>
                  <p className="text-muted fw-bold mb-1 small text-uppercase">Balance en Gaveta Esperado</p>
                  <h3 className="fw-bold mb-0 text-main display-6">${parseFloat(sessionData.expected_balance).toFixed(2)}</h3>
                </div>
                <div className="bg-light rounded-circle p-3 text-main">
                  <FiDollarSign size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Transacciones Recientes */}
          <div className="card-custom p-0">
            <div className="p-4 border-bottom bg-light d-flex gap-2 align-items-center">
              <FiActivity className="text-muted" /> <h6 className="mb-0 fw-bold text-uppercase">Transacciones y Movimientos de Hoy</h6>
            </div>
            <div className="table-responsive px-4 pb-2 mt-3">
              <table className="table table-borderless align-middle mb-0">
                <thead className="border-bottom">
                  <tr>
                    <th className="text-muted fw-bold small pb-3">Hora</th>
                    <th className="text-muted fw-bold small pb-3">Tipo</th>
                    <th className="text-muted fw-bold small pb-3">Descripción</th>
                    <th className="text-muted fw-bold small pb-3 text-end">Monto Real</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 && (
                    <tr><td colSpan="4" className="text-center text-muted py-4">No hay transacciones registradas en este turno aún.</td></tr>
                  )}
                  {transactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="py-3 text-muted small fw-semibold">{new Date(tx.created_at).toLocaleTimeString()}</td>
                      <td>
                        {tx.type === 'sale' ? (
                          <span className="badge-active bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3">Venta Ingreso</span>
                        ) : (
                          <span className="badge-expired bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3">Gasto / Retiro</span>
                        )}
                      </td>
                      <td className="fw-semibold text-main">{tx.description}</td>
                      <td className={`text-end fw-bold ${tx.type === 'sale' ? 'text-teal' : 'text-danger'}`}>
                        {tx.type === 'sale' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 text-center text-muted small bg-light">
              Los montos calculados asumen un balance 100% exacto según sistema.
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CashRegister;
