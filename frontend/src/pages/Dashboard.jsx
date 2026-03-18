import { useState, useEffect } from 'react';
import { FiArrowUpCircle, FiTrendingUp, FiUsers, FiLoader } from 'react-icons/fi';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import dashboardService from '../services/dashboardService';
import Layout from '../components/Layout';

// --- Componente Dashboard ---
const Dashboard = () => {

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Error al cargar el Dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="DASHBOARD">
        <div className="d-flex flex-column justify-content-center align-items-center mt-5 text-teal">
          <FiLoader size={48} className="spin-animation mb-3" />
          <h5>Cargando Métricas...</h5>
        </div>
      </Layout>
    );
  }

  // Prevenir crashes si falla la API
  const data = metrics || {
    active_members: 0, today_sales: 0, expiring_members: [], upcoming_classes: [], recent_clients: [], activity_graph: []
  };

  return (
    <Layout title="DASHBOARD">
      <div className="row g-4 h-100">
        
        {/* === FILA 1: Top Metrics === */}
        <div className="col-12 col-xl-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Miembros Activos</p>
              <div className="d-flex align-items-center gap-2">
                <h2 className="display-6 fw-bold mb-0 text-main">{data.active_members}</h2>
                <FiArrowUpCircle size={28} className="text-teal" />
              </div>
              <small className="text-muted mt-1 d-block">Mini trender trendo</small>
            </div>
            
            {/* Gráfico Mini (Area) */}
            <div style={{ width: '150px', height: '80px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.activity_graph}>
                  <defs>
                    <linearGradient id="colorUv1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip cursor={{stroke: 'transparent'}} contentStyle={{display: 'none'}} />
                  <Area type="monotone" dataKey="uv" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorUv1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Ventas Hoy</p>
              <h2 className="display-6 fw-bold mb-0 text-main">${parseFloat(data.today_sales).toFixed(2)}</h2>
              <small className="text-muted mt-1 d-block">Mini orentas evento</small>
            </div>
            
            {/* Gráfico Mini (Area) */}
            <div style={{ width: '150px', height: '80px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.activity_graph}>
                  <defs>
                    <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip cursor={{stroke: 'transparent'}} contentStyle={{display: 'none'}} />
                  <Area type="monotone" dataKey="uv" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorUv2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        {/* === FILA 2: Medio === */}
        <div className="col-12 col-md-6">
          <div className="card-custom h-100 p-4 d-flex flex-column justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Clases Siguientes</p>
              <h3 className="fw-bold text-main mb-4">3 Classes</h3>
            </div>
            
            <div className="d-flex justify-content-between">
              <div>
                <p className="mb-0 fw-bold">Spinning</p>
                <small className="text-muted">7 participantes</small>
              </div>
              <div>
                <p className="mb-0 fw-bold">Yoga</p>
                <small className="text-muted">2 participantes</small>
              </div>
              <div>
                <p className="mb-0 fw-bold">Boxing</p>
                <small className="text-muted">3 participantes</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card-custom h-100 p-4">
            <p className="text-muted fw-bold mb-1 small text-uppercase">Alertas Vencimiento</p>
            <h3 className="fw-bold text-main mb-4">{data.expiring_members.length} Miembros Expiran Pronto</h3>
            
            <div className="row g-3">
              {data.expiring_members.map((member, idx) => (
                <div key={idx} className="col-12 d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted">{member.name}</span>
                  <span className="badge bg-danger bg-opacity-10 text-danger shadow-sm rounded-pill px-3">
                    En {member.days_left} días
                  </span>
                </div>
              ))}
              {data.expiring_members.length === 0 && (
                <div className="col-12 text-muted small">No hay vencimientos próximos (7 días).</div>
              )}
            </div>
          </div>
        </div>

        {/* === FILA 3: Inferior === */}
        <div className="col-12 col-xl-6">
          <div className="card-custom h-100 p-4">
            <p className="text-muted fw-bold mb-4 small text-uppercase">Resumen Ingresos</p>
            
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.activity_graph}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                  <Tooltip />
                  <Area type="monotone" dataKey="uv" stroke="#14B8A6" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="card-custom h-100 p-0">
            <div className="p-4 border-bottom">
               <p className="text-muted fw-bold mb-0 small text-uppercase">Recién Llegados</p>
            </div>
            
            <div className="table-responsive px-4 pb-4 mt-3">
              <table className="table table-borderless align-middle mb-0">
                <thead className="border-bottom">
                  <tr>
                    <th className="text-muted fw-bold small pb-3">Foto</th>
                    <th className="text-muted fw-bold small pb-3">Nombre</th>
                    <th className="text-muted fw-bold small pb-3">Plan</th>
                    <th className="text-muted fw-bold small pb-3">Check-in Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_clients.map((user, idx) => (
                    <tr key={idx}>
                      <td className="py-3">
                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{width: 35, height: 35}}>
                          <FiUsers size={16} />
                        </div>
                      </td>
                      <td className="fw-semibold text-main">{user.name}</td>
                      <td><span className="badge-active bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">{user.plan}</span></td>
                      <td className="text-muted small">Ingreso el {user.joined}</td>
                    </tr>
                  ))}
                  {data.recent_clients.length === 0 && (
                    <tr><td colSpan="4" className="text-center text-muted py-3">No hay registros de clientes nuevos recientes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
