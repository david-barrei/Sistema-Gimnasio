import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import clientService from '../services/clientService';
import Layout from '../components/Layout';
import { FiEdit2, FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiActivity } from 'react-icons/fi';

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await clientService.detail(id);
        setClient(data);
      } catch (err) {
        setError('Error al cargar los detalles del cliente.');
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <Layout title="DETALLES DEL CLIENTE">
        <div className="d-flex justify-content-center align-items-center h-100 py-5">
          <div className="spinner-border text-teal" role="status"></div>
        </div>
      </Layout>
    );
  }

  if (error || !client) {
    return (
      <Layout title="DETALLES DEL CLIENTE">
        <div className="alert alert-danger m-4">{error || 'Cliente no encontrado'}</div>
      </Layout>
    );
  }

  return (
    <Layout title="DETALLES DEL EMPLEADO">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          
          <div className="mb-4">
            <Link to="/clients" className="btn btn-light shadow-sm text-muted fw-bold d-inline-flex align-items-center gap-2 border">
              <FiArrowLeft /> Regresar a la lista
            </Link>
          </div>

          <div className="card-custom border-0 shadow-sm overflow-hidden">
            {/* Header / Banner del perfil */}
            <div className="bg-light p-4 d-flex align-items-center gap-4 border-bottom">
              <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white shadow" style={{width: 80, height: 80, fontSize: '2rem'}}>
                {client.first_name[0]}{client.last_name[0]}
              </div>
              <div>
                <h3 className="mb-0 fw-bold">{client.first_name} {client.last_name}</h3>
                <p className="text-muted mb-0">{client.email}</p>
              </div>
              <div className="ms-auto">
                <Link to={`/clients/update/${client.id}`} className="btn btn-dark fw-bold d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}>
                  <FiEdit2 /> Editar Perfil
                </Link>
              </div>
            </div>

            {/* Cuerpo del perfil */}
            <div className="p-4 p-md-5">
              <h5 className="mb-4 fw-bold text-muted text-uppercase">Información Personal</h5>
              
              <div className="row g-4 mb-5">
                <div className="col-md-6 d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-teal"><FiUser size={20} /></div>
                  <div>
                    <label className="text-muted small fw-bold text-uppercase">Nombre Completo</label>
                    <p className="fw-semibold mb-0">{client.first_name} {client.last_name}</p>
                  </div>
                </div>
                
                <div className="col-md-6 d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-teal"><FiMail size={20} /></div>
                  <div>
                    <label className="text-muted small fw-bold text-uppercase">Correo Electrónico</label>
                    <p className="fw-semibold mb-0">{client.email}</p>
                  </div>
                </div>

                <div className="col-md-6 d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-teal"><FiPhone size={20} /></div>
                  <div>
                    <label className="text-muted small fw-bold text-uppercase">Teléfono</label>
                    <p className="fw-semibold mb-0">{client.phone}</p>
                  </div>
                </div>
              </div>

              <h5 className="mb-4 fw-bold text-muted text-uppercase">Estado de Membresía</h5>
              
              <div className="row g-4">
                <div className="col-md-6 d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-teal"><FiActivity size={20} /></div>
                  <div>
                    <label className="text-muted small fw-bold text-uppercase">Estado</label>
                    <div>
                      {client.is_active ? 
                        <span className="badge-active px-3 py-2 mt-1 d-inline-block">Activo</span> : 
                        <span className="badge-expired px-3 py-2 mt-1 d-inline-block">Expirado</span>
                      }
                    </div>
                  </div>
                </div>

                <div className="col-md-6 d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-teal"><FiCalendar size={20} /></div>
                  <div>
                    <label className="text-muted small fw-bold text-uppercase">Período</label>
                    <p className="fw-semibold mb-0">{client.start_date} al {client.end_date}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ClientDetail;
