import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit2, FiTrash2, FiBox, FiDollarSign } from 'react-icons/fi';
import productService from '../services/productService';
import Layout from '../components/Layout';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.list();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar la lista de productos.');
    } finally {
      setLoading(false);
    }
  };

  // Lógica para eliminar un producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productService.destroy(id);
        fetchProducts(); // Refrescar la tabla
      } catch (err) {
        alert('Error al eliminar el producto');
      }
    }
  };

  // Calcular métricas rápidas
  const totalValue = products.reduce((acc, current) => acc + (parseFloat(current.price) * current.stock), 0);
  const totalItems = products.reduce((acc, current) => acc + current.stock, 0);

  return (
    <Layout title="GESTIÓN DE INVENTARIO">
      
      {/* Tarjetas de Métricas Superiores */}
      <div className="row g-4 mb-4">
        {/* Tarjeta: Total de Productos (Stock) */}
        <div className="col-12 col-md-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Items en Stock</p>
              <h2 className="display-4 fw-bold mb-0 text-main">{totalItems}</h2>
            </div>
            <div className="bg-light rounded-circle p-3 text-muted">
              <FiBox size={32} />
            </div>
          </div>
        </div>
        {/* Tarjeta: Valor Total del Inventario */}
        <div className="col-12 col-md-6">
          <div className="card-custom h-100 d-flex flex-row p-4 align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-bold mb-1 small text-uppercase">Valor Aproximado</p>
              <div className="d-flex align-items-center gap-2">
                <h2 className="display-4 fw-bold mb-0 text-main">${totalValue.toFixed(2)}</h2>
                <FiDollarSign size={32} className="text-teal" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta Principal de la Tabla */}
      <div className="card-custom p-0">
        
        {/* Cabecera y Controles de la Tabla */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <h5 className="mb-0 fw-bold text-uppercase">Listado de Productos</h5>
          <div className="d-flex gap-3">
            {/* Buscador y filtros visuales */}
            <input type="text" className="form-control form-control-sm bg-light border-0" placeholder="Buscar producto..." style={{ width: '200px' }} />
            <Link to="/products/new" className="btn btn-sm btn-dark px-3 fw-bold shadow-sm d-flex align-items-center gap-2" style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}>
              <span>+ Nuevo</span>
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger m-4">{error}</div>}

        {/* Tabla sin bordes */}
        <div className="table-responsive px-4 pb-2 mt-3">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-teal" role="status"></div></div>
          ) : (
            <table className="table table-borderless align-middle mb-0">
              <thead className="border-bottom">
                <tr>
                  <th className="text-muted fw-bold small pb-3">Icono</th>
                  <th className="text-muted fw-bold small pb-3">Nombre del Producto</th>
                  <th className="text-muted fw-bold small pb-3 text-center">Precio Unit.</th>
                  <th className="text-muted fw-bold small pb-3 text-center">Stock</th>
                  <th className="text-muted fw-bold small pb-3 text-center">Estado</th>
                  <th className="text-muted fw-bold small pb-3 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No hay productos registrados en el inventario.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="py-3">
                        {/* Placeholder visual del producto */}
                        <div className="rounded bg-light d-flex align-items-center justify-content-center text-muted border" style={{width: 40, height: 40}}>
                          <FiBox size={20} />
                        </div>
                      </td>
                      <td className="fw-semibold text-main">{product.name}</td>
                      <td className="text-center fw-semibold text-muted">${product.price}</td>
                      <td className="text-center">
                        <span className="fw-bold">{product.stock}</span> unid.
                      </td>
                      <td className="text-center">
                        {/* Badge dinámico: Verde si hay stock, Rojo si está agotado */}
                        {product.stock > 0 ? 
                          <span className="badge-active">Disponible</span> : 
                          <span className="badge-expired">Agotado</span>
                        }
                      </td>
                      <td className="text-end">
                        <Link to={`/products/detail/${product.id}`} className="action-btn me-2" title="Ver Detalles">
                          <FiEye size={18} />
                        </Link>
                        <Link to={`/products/update/${product.id}`} className="action-btn me-2" title="Editar">
                          <FiEdit2 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="action-btn delete-btn" title="Eliminar">
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
        
        {/* Footer Paginacion */}
        <div className="d-flex justify-content-between text-muted small px-4 py-3 bg-light">
          <span>Mostrando 1-{products.length} de {products.length} productos</span>
          <span className="fw-semibold cursor-pointer">[Anterior] <span className="text-dark">[1]</span> [Siguiente]</span>
        </div>

      </div>
    </Layout>
  );
};

export default ProductList;
