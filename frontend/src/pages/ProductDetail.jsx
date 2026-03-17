import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import Layout from '../components/Layout';
import { FiEdit2, FiArrowLeft, FiBox, FiDollarSign, FiArchive, FiTag } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.detail(id);
        setProduct(data);
      } catch (err) {
        setError('Error al cargar los detalles del producto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout title="DETALLES DEL PRODUCTO">
        <div className="d-flex justify-content-center align-items-center h-100 py-5">
          <div className="spinner-border text-teal" role="status"></div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout title="DETALLES DEL PRODUCTO">
        <div className="alert alert-danger m-4">{error || 'Producto no encontrado'}</div>
      </Layout>
    );
  }

  return (
    <Layout title="DETALLES DEL PRODUCTO">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          
          <div className="mb-4">
            <Link to="/products" className="btn btn-light shadow-sm text-muted fw-bold d-inline-flex align-items-center gap-2 border">
              <FiArrowLeft /> Regresar al inventario
            </Link>
          </div>

          <div className="card-custom border-0 shadow-sm overflow-hidden">
            {/* Header del producto */}
            <div className="bg-light p-4 d-flex align-items-center gap-4 border-bottom">
              <div className="rounded bg-secondary d-flex align-items-center justify-content-center text-white shadow" style={{width: 80, height: 80, fontSize: '2rem'}}>
                <FiBox />
              </div>
              <div>
                <h3 className="mb-0 fw-bold">{product.name}</h3>
                <p className="text-muted mb-0">ID del Sistema: #{product.id}</p>
              </div>
              <div className="ms-auto">
                <Link to={`/products/update/${product.id}`} className="btn btn-dark fw-bold d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}>
                  <FiEdit2 /> Editar Artículo
                </Link>
              </div>
            </div>

            {/* Módulo de especificaciones */}
            <div className="p-4 p-md-5">
              <h5 className="mb-4 fw-bold text-muted text-uppercase">Información del Artículo</h5>
              
              <div className="row g-4 mb-5">
                {/* Nombre del Artículo */}
                <div className="col-md-6 d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-teal"><FiTag size={20} /></div>
                  <div>
                    <label className="text-muted small fw-bold text-uppercase">Nombre Comercial</label>
                    <p className="fw-semibold mb-0">{product.name}</p>
                  </div>
                </div>
                
                {/* Precio */}
                <div className="col-md-6 d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-teal"><FiDollarSign size={20} /></div>
                  <div>
                    <label className="text-muted small fw-bold text-uppercase">Precio de Venta</label>
                    <p className="fw-bold mb-0 text-main fs-5">${product.price}</p>
                  </div>
                </div>

                {/* Status / Stock */}
                <div className="col-md-6 d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-teal"><FiArchive size={20} /></div>
                  <div>
                    <label className="text-muted small fw-bold text-uppercase">Inventario Físico</label>
                    <div className="d-flex align-items-center gap-3 mt-1">
                      <p className="fw-bold mb-0 text-main fs-5">{product.stock} unids.</p>
                      {product.stock > 0 ? 
                        <span className="badge-active px-2 py-1">En Stock</span> : 
                        <span className="badge-expired px-2 py-1">Agotado</span>
                      }
                    </div>
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

export default ProductDetail;
