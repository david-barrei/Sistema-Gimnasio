import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit2, FiTrash2, FiUsers, FiArrowUpCircle } from 'react-icons/fi';
import clientService from '../services/clientService';
import Layout from '../components/Layout';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.list();
      setClients(data);
    } catch (err) {
      setError('Error al cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await clientService.destroy(id);
        fetchClients();
      } catch (err) {
        alert('Error al eliminar el cliente');
      }
    }
  };

  return (
    <Layout title="GESTIÓN DE USUARIOS">

      {/* Top Metrics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Total Usuarios</p>
              <h2 className="display-4 fw-bold mb-0 text-main">{clients.length}</h2>
            </div>
            <div className="bg-light rounded-circle p-3 text-muted">
              <FiUsers size={32} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Nuevos Este Mes</p>
              <div className="d-flex align-items-center gap-2">
                <h2 className="display-4 fw-bold mb-0 text-main">85</h2>
                <FiArrowUpCircle size={32} className="text-teal" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card-custom p-0">

        {/* Table Header Controls */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <h5 className="mb-0 fw-bold text-uppercase">Listado de Miembros</h5>
          <div className="d-flex gap-3">
            <input type="text" className="form-control form-control-sm bg-light border-0" placeholder="Buscar..." style={{ width: '200px' }} />
            <select className="form-select form-select-sm border-0 bg-light text-muted fw-semibold">
              <option>Plan: Todos</option>
            </select>
            <select className="form-select form-select-sm border-0 bg-light text-muted fw-semibold">
              <option>Estado: Todos</option>
            </select>
            <Link to="/clients/new" className="btn btn-sm btn-dark px-3 fw-bold shadow-sm d-flex align-items-center gap-2">
              <span>Nuevo</span>
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger m-4">{error}</div>}

        {/* The Table */}
        <div className="table-responsive px-4 pb-2 mt-3">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-teal" role="status"></div></div>
          ) : (
            <table className="table table-borderless align-middle mb-0">
              <thead className="border-bottom">
                <tr>
                  <th className="text-muted fw-bold small pb-3">Foto</th>
                  <th className="text-muted fw-bold small pb-3">Nombre Completo</th>
                  <th className="text-muted fw-bold small pb-3 text-center">Plan Actual</th>
                  <th className="text-muted fw-bold small pb-3 text-center">Estado</th>
                  <th className="text-muted fw-bold small pb-3">Última Visita</th>
                  <th className="text-muted fw-bold small pb-3 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No hay clientes registrados.</td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="py-3">
                        {/* Placeholder Foto */}
                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40 }}>
                          {client.first_name[0]}{client.last_name[0]}
                        </div>
                      </td>
                      <td className="fw-semibold text-main">{client.first_name} {client.last_name}</td>
                      <td className="text-center">
                        <span className="badge-active">Active</span> {/* Mocking the Plan badge */}
                      </td>
                      <td className="text-center">
                        {client.is_active ?
                          <span className="badge-active">Active</span> :
                          <span className="badge-expired">Expired</span>
                        }
                      </td>
                      <td className="text-muted small">10/00 al 16:00</td>
                      <td className="text-end">
                        <Link to={`/clients/detail/${client.id}`} className="action-btn me-2" title="Ver Detalles">
                          <FiEye size={18} />
                        </Link>
                        <Link to={`/clients/update/${client.id}`} className="action-btn me-2" title="Editar">
                          <FiEdit2 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(client.id)} className="action-btn delete-btn" title="Eliminar">
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Paginacion Mock */}
        <div className="d-flex justify-content-between text-muted small px-4 py-3 bg-light">
          <span>Mostrando 1-{clients.length} de {clients.length} usuarios</span>
          <span className="fw-semibold cursor-pointer">[Anterior] <span className="text-dark">[1]</span> [Siguiente]</span>
        </div>

      </div>
    </Layout>
  );
};

export default ClientList;
