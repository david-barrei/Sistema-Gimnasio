import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';
import Layout from '../components/Layout';

const ProductForm = () => {
  const { id } = useParams(); // ID desde URL, si existe indica edición
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // El modelo de producto en Django requiere name, price, stock
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  // Si estamos en modo de edición, llamamos a la API para poblar los datos
  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.detail(id);
      setFormData({
        name: data.name,
        price: data.price,
        stock: data.stock,
      });
    } catch (err) {
      setError('Error al cargar datos del producto.');
    } finally {
      setLoading(false);
    }
  };

  // Manejador genérico para los inputs del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Envío del formulario, discriminando si es Creación o Actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await productService.update(id, formData);
        alert('Producto actualizado exitosamente');
      } else {
        await productService.create(formData);
        alert('Producto creado exitosamente');
      }
      navigate('/products'); // Retornamos a la lista de inventario
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Ocurrió un error al guardar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={isEditing ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}>
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="card-custom border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              
              <h5 className="mb-4 fw-bold">{isEditing ? 'Modificar Especificaciones' : 'Ingresar Artículo'}</h5>
              
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Fila 1 */}
                  <div className="col-md-12">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Nombre Comercial</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-control bg-light border-0 shadow-none py-2" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Ej. Proteína Whey 5lb"
                      required 
                    />
                  </div>

                  {/* Fila 2 */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Precio Unitario ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="price" 
                      className="form-control bg-light border-0 shadow-none py-2" 
                      value={formData.price} 
                      onChange={handleChange} 
                      placeholder="Ej. 49.99"
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Cantidad en Stock</label>
                    <input 
                      type="number" 
                      name="stock" 
                      min="0"
                      className="form-control bg-light border-0 shadow-none py-2" 
                      value={formData.stock} 
                      onChange={handleChange} 
                      placeholder="Ej. 100"
                      required 
                    />
                  </div>
                </div>

                <hr className="my-5 border-light" />

                <div className="d-flex justify-content-end gap-3">
                  <button type="button" onClick={() => navigate('/products')} className="btn btn-light px-4 fw-semibold text-muted shadow-sm">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-dark px-5 fw-bold shadow-sm" style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }} disabled={loading}>
                    {loading ? 'Guardando...' : (isEditing ? 'Actualizar Artículo' : 'Crear Artículo')}
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

export default ProductForm;
