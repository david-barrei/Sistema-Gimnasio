import { FiArrowUpCircle, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';

// --- Datos Mockeados para los Gráficos ---
const activityData = [
  { name: 'Lun', uv: 400 },
  { name: 'Mar', uv: 300 },
  { name: 'Mie', uv: 500 },
  { name: 'Jue', uv: 280 },
  { name: 'Vie', uv: 590 },
  { name: 'Sab', uv: 400 },
  { name: 'Dom', uv: 700 },
];

const salesData = [
  { name: 'Lun', uv: 500 },
  { name: 'Mar', uv: 700 },
  { name: 'Mie', uv: 600 },
  { name: 'Jue', uv: 800 },
  { name: 'Vie', uv: 1200 },
  { name: 'Sab', uv: 1000 },
  { name: 'Dom', uv: 1530 },
];

const incomeData = [
  { name: 'Semana 1', uv: 200 },
  { name: 'Semana 2', uv: 100 },
  { name: 'Semana 3', uv: 400 },
  { name: 'Semana 4', uv: 300 },
  { name: 'Semana 5', uv: 600 },
  { name: 'Semana 6', uv: 500 },
  { name: 'Semana 7', uv: 800 },
];

// --- Componente Dashboard ---
const Dashboard = () => {
  return (
    <Layout title="DASHBOARD">
      <div className="row g-4 h-100">
        
        {/* === FILA 1: Top Metrics === */}
        <div className="col-12 col-xl-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Miembros Activos</p>
              <div className="d-flex align-items-center gap-2">
                <h2 className="display-6 fw-bold mb-0 text-main">1,208</h2>
                <FiArrowUpCircle size={28} className="text-teal" />
              </div>
              <small className="text-muted mt-1 d-block">Mini trender trendo</small>
            </div>
            
            {/* Gráfico Mini (Area) */}
            <div style={{ width: '150px', height: '80px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
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
              <h2 className="display-6 fw-bold mb-0 text-main">$1,530</h2>
              <small className="text-muted mt-1 d-block">Mini orentas evento</small>
            </div>
            
            {/* Gráfico Mini (Area) */}
            <div style={{ width: '150px', height: '80px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
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
            <h3 className="fw-bold text-main mb-4">5 Members Expiring</h3>
            
            <div className="row g-3">
              <div className="col-6 d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Elexandra Name</span>
                <span className="badge bg-light text-dark shadow-sm rounded-circle px-2">2</span>
              </div>
              <div className="col-6 d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Markina Gohnson</span>
                <span className="badge bg-light text-dark shadow-sm rounded-circle px-2">2</span>
              </div>
              <div className="col-6 d-flex justify-content-between pb-2">
                <span className="text-muted">Donalo Mairider</span>
                <span className="badge bg-light text-dark shadow-sm rounded-circle px-2">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* === FILA 3: Inferior === */}
        <div className="col-12 col-xl-6">
          <div className="card-custom h-100 p-4">
            <p className="text-muted fw-bold mb-4 small text-uppercase">Resumen Ingresos</p>
            
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incomeData}>
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
                  {[
                    {name: 'Nama Menta', time: '10:00 al 16:00'},
                    {name: 'Ncola Smelo', time: '10:00 al 16:00'},
                  ].map((user, idx) => (
                    <tr key={idx}>
                      <td className="py-3">
                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{width: 35, height: 35}}>
                          <FiUsers size={16} />
                        </div>
                      </td>
                      <td className="fw-semibold text-main">{user.name}</td>
                      <td><span className="badge-active">Active</span></td>
                      <td className="text-muted small">{user.time}</td>
                    </tr>
                  ))}
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
