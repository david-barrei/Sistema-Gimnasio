import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiBox, FiDollarSign, FiArchive, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import cashService from '../services/cashService';
import productService from '../services/productService';
import saleService from '../services/saleService';
import Layout from '../components/Layout';

const PointOfSale = () => {
  const navigate = useNavigate();

  // --------- ESTADOS DE CAJA ---------
  // Ahora el POS controla si la caja está abierta o no.
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('');

  // --------- ESTADOS DEL POS ---------
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------- CARGAR DATOS INICIALES ---------
  useEffect(() => {
    checkCashSession();
    fetchProducts();
  }, []);

  const checkCashSession = async () => {
    try {
      const activeSession = await cashService.getActiveSession();
      if (activeSession) {
        setIsSessionOpen(true);
      }
    } catch (error) {
      setIsSessionOpen(false); // No open session found
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.list();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
      alert("Error al cargar el inventario de productos.");
    } finally {
      setLoading(false);
    }
  };

  // --------- FUNCIONES DE CAJA ---------
  const handleOpenRegister = async (e) => {
    e.preventDefault();
    if (!openingBalance) return;
    
    try {
      await cashService.openSession(parseFloat(openingBalance));
      alert(`Caja abierta exitosamente con $${parseFloat(openingBalance).toFixed(2)}.`);
      setIsSessionOpen(true);
    } catch (error) {
      console.error("Error abriendo caja:", error);
      alert(error.response?.data?.detail || "Ya existe una caja abierta o hubo un error.");
    }
  };

  // --------- FUNCIONES DEL CARRITO ---------
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = calculateSubtotal();

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Agrega productos al carrito primero.");
    if (window.confirm(`¿Confirmar cobro de $${total.toFixed(2)}?`)) {
      try {
        // Armar el array esperado por Django: [{"product": 1, "quantity": 2}, ...]
        const itemsPayload = cart.map(item => ({
          product: item.id,
          quantity: item.quantity
        }));

        await saleService.create({ items: itemsPayload });
        
        alert("¡Venta procesada con éxito y registrada en caja!");
        setCart([]); // Vaciar carrito
        fetchProducts(); // Recargar stock real
      } catch (error) {
        console.error("Error al procesar venta:", error);
        alert(error.response?.data?.detail || "Error al procesar el pago. Verifica tu conexión.");
      }
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // ================= RENDERIZADO =================
  return (
    <Layout title="TERMINAL PUNTO DE VENTA (POS)">
      
      {/* PANTALLA DE BLOQUEO: ABRIR CAJA OBLIGATORIO */}
      {!isSessionOpen ? (
         <div className="row justify-content-center mt-5">
         <div className="col-12 col-md-6 col-lg-5">
           <div className="card-custom border-0 shadow text-center p-5">
             <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-4 text-teal" style={{width: 100, height: 100}}>
               <FiArchive size={48} />
             </div>
             <h3 className="fw-bold mb-2">Apertura de Turno Requerida</h3>
             <p className="text-muted mb-4 small">Antes de empezar a vender, por favor ingresa el dinero inicial que existe en tu gaveta física.</p>
             
             <form onSubmit={handleOpenRegister}>
               <div className="mb-4 text-start">
                 <label className="form-label small fw-bold text-muted text-uppercase mb-2">Fondo Base (Apertura)</label>
                 <div className="input-group input-group-lg shadow-sm rounded">
                   <span className="input-group-text bg-white border-end-0 text-dark fw-bold"><FiDollarSign /></span>
                   <input 
                     type="number" 
                     step="0.01"
                     className="form-control bg-white border-start-0 shadow-none fw-bold text-main" 
                     placeholder="0.00" 
                     value={openingBalance}
                     onChange={(e) => setOpeningBalance(e.target.value)}
                     required
                     autoFocus
                   />
                 </div>
               </div>
               <button type="submit" className="btn btn-dark w-100 py-3 fw-bold shadow-sm fs-5" style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}>
                 Habilitar Ventas
               </button>
             </form>

             <button onClick={() => navigate('/cash')} className="btn btn-link text-muted mt-3 small text-decoration-none">
                Revisar historial de turnos pasados
             </button>
           </div>
         </div>
       </div>
      ) : (

      // INTERFAZ DEL TERMINAL POS (SPLIT SCREEN)
      <div className="row g-0" style={{ height: 'calc(100vh - 100px)' }}>
        
        {/* ================= PANEL IZQUIERDO: CATÁLOGO DE PRODUCTOS (58% / col-xl-7) ================= */}
        <div className="col-12 col-lg-7 col-xl-7 pe-lg-3 d-flex flex-column h-100">
          
          {/* Header Búsqueda y Link Administrativo */}
          <div className="card-custom border-0 p-3 mb-3 d-flex align-items-center gap-3 justify-content-between flex-wrap">
            <div className="input-group shadow-sm" style={{ maxWidth: '400px' }}>
              <span className="input-group-text bg-white border-0 text-muted"><FiSearch /></span>
              <input 
                type="text" 
                className="form-control bg-white border-0 shadow-none" 
                placeholder="Buscar en el catálogo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => navigate('/cash')} className="btn btn-outline-secondary btn-sm fw-bold d-flex align-items-center gap-2">
              <FiActivity /> Control de Turno
            </button>
          </div>

          {/* Grilla de Productos (Scrollable) */}
          <div className="card-custom border-0 h-100 p-3 overflow-auto custom-scrollbar bg-light border">
            <div className="row g-3">
              {filteredProducts.map(product => (
                <div key={product.id} className="col-6 col-md-6 col-xl-4">
                  {/* Tarjeta de Producto Interactiva */}
                  <div 
                    className={`card h-100 border-0 shadow-sm transition-all ${product.stock > 0 ? 'cursor-pointer' : 'opacity-50'}`} 
                    onClick={() => product.stock > 0 && addToCart(product)}
                    style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: product.stock > 0 ? 'pointer' : 'not-allowed' }}
                    onMouseEnter={(e) => { if (product.stock > 0) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)'; } }}
                    onMouseLeave={(e) => { if (product.stock > 0) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--soft-shadow)'; } }}
                  >
                    <div className="card-body p-3 text-center d-flex flex-column">
                      <div className="rounded bg-light d-flex align-items-center justify-content-center mx-auto mb-3 text-teal" style={{width: 60, height: 60}}>
                        <FiBox size={24} />
                      </div>
                      <h6 className="fw-bold fs-6 mb-1 text-truncate" title={product.name}>{product.name}</h6>
                      {product.stock === 0 ? (
                        <span className="badge bg-danger bg-opacity-10 text-danger mb-2 align-self-center">AGOTADO</span>
                      ) : (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary mb-2 align-self-center">Stock: {product.stock} unids</span>
                      )}
                      
                      <div className="mt-auto text-center">
                        <span className="fw-bold text-main fs-5">${parseFloat(product.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-12 text-center text-muted py-5">No se encontraron productos coincidentes.</div>
              )}
            </div>
          </div>

        </div>

        {/* ================= PANEL DERECHO: TICKET / CARRITO (42% / col-xl-5) ================= */}
        <div className="col-12 col-lg-5 col-xl-5 mt-4 mt-lg-0 d-flex flex-column h-100">
          <div className="card-custom border-0 h-100 d-flex flex-column p-0 overflow-hidden shadow">
            
            {/* Header Carrito */}
            <div className="p-3 bg-dark text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 pt-1 pb-1">
                <FiShoppingCart /> Orden Actual
              </h5>
              <span className="badge bg-teal rounded-pill fs-6">{cart.length}</span>
            </div>

            {/* Lista de Ítems (Scrollable) */}
            <div className="flex-grow-1 overflow-auto p-3 custom-scrollbar bg-white">
              {cart.length === 0 ? (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted text-center p-4">
                  <FiShoppingCart size={48} className="mb-3 opacity-50" />
                  <p>Selecciona productos en el catálogo para agregarlos al ticket de comprador.</p>
                </div>
              ) : (
                <ul className="list-group list-group-flush gap-2">
                  {cart.map(item => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-start border rounded bg-light p-3 shadow-sm">
                      <div className="ms-2 me-auto w-100">
                        <div className="fw-bold text-dark text-wrap d-block mb-1" style={{fontSize: '1.05rem'}}>{item.name}</div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="text-teal fw-bold fs-5">${(item.price * item.quantity).toFixed(2)}</span>
                          
                          {/* Controles de Cantidad */}
                          <div className="btn-group bg-white border rounded shadow-sm">
                            <button onClick={() => updateQuantity(item.id, -1)} className="btn btn-light px-3 fw-bold fs-5"><FiMinus /></button>
                            <span className="btn btn-light px-4 fw-bold border-start border-end fs-5" style={{pointerEvents: 'none'}}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="btn btn-light px-3 fw-bold fs-5"><FiPlus /></button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="btn btn-link text-danger p-0 ms-3" title="Quitar">
                        <FiTrash2 size={24} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer de Cobro */}
            <div className="p-4 border-top bg-light">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-bold">Subtotal:</span>
                <span className="fw-bold">${total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-bold">Impuestos (0%):</span>
                <span className="fw-bold">$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-end mb-4">
                <span className="text-uppercase fw-bold text-dark fs-5">Total a Pagar</span>
                <span className="display-5 fw-bold text-teal" style={{lineHeight: '1'}}>${total.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleCheckout} 
                className="btn btn-dark w-100 py-3 fw-bold fs-5 shadow-sm btn-lg"
                style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}
                disabled={cart.length === 0}
              >
                PROCESAR PAGO
              </button>
            </div>
            
          </div>
        </div>

      </div>
      )}
    </Layout>
  );
};

export default PointOfSale;
