import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clientService from '../services/clientService';
import Layout from '../components/Layout';

const ClientForm = () => {
  const { id } = useParams(); // Si hay ID en la URL, estamos editando
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    membership_type: 'M', // Por defecto Mensual
    start_date: new Date().toISOString().split('T')[0], // Fecha actual
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const data = await clientService.detail(id);
      // Populamos el formulario con los datos preexistentes
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        membership_type: data.membership_type,
        start_date: data.start_date,
      });
    } catch (err) {
      setError('Error al cargar datos del cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await clientService.update(id, formData);
        alert('Cliente actualizado exitosamente');
      } else {
        await clientService.create(formData);
        alert('Cliente creado exitosamente');
      }
      navigate('/clients'); // Volver a la lista
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data)); // Mostrar errores de validación de Django
      } else {
        setError('Ocurrió un error al guardar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={isEditing ? 'EDITAR CLIENTE' : 'NUEVO CLIENTE'}>
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="card-custom border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              
              <h5 className="mb-4 fw-bold">{isEditing ? 'Configurar Perfil' : 'Ingresar Datos'}</h5>
              
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Fila 1 */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Nombre</label>
                    <input 
                      type="text" 
                      name="first_name" 
                      className="form-control bg-light border-0 shadow-none py-2" 
                      value={formData.first_name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Apellido</label>
                    <input 
                      type="text" 
                      name="last_name" 
                      className="form-control bg-light border-0 shadow-none py-2" 
                      value={formData.last_name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  {/* Fila 2 */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-control bg-light border-0 shadow-none py-2" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Teléfono</label>
                    <input 
                      type="text" 
                      name="phone" 
                      className="form-control bg-light border-0 shadow-none py-2" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  {/* Fila 3 */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Tipo de Membresía</label>
                    <select 
                      name="membership_type" 
                      className="form-select bg-light border-0 shadow-none py-2 text-muted" 
                      value={formData.membership_type} 
                      onChange={handleChange}
                    >
                      <option value="D">Diario</option>
                      <option value="M">Mensual</option>
                      <option value="T">Trimestral</option>
                      <option value="A">Anual</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Fecha de Inicio</label>
                    <input 
                      type="date" 
                      name="start_date" 
                      className="form-control bg-light border-0 shadow-none py-2 text-muted" 
                      value={formData.start_date} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <hr className="my-5 border-light" />

                <div className="d-flex justify-content-end gap-3">
                  <button type="button" onClick={() => navigate('/clients')} className="btn btn-light px-4 fw-semibold text-muted shadow-sm">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-dark px-5 fw-bold shadow-sm" style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }} disabled={loading}>
                    {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Registro')}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientForm;
