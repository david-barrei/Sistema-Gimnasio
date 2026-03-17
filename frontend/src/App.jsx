import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';
import ClientDetail from './pages/ClientDetail';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import authService from './services/authService';

// Componente para proteger las rutas privadas
// Si no hay token, redirige al Login
const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública (Login) */}
        <Route path="/" element={<Login />} />

        {/* Rutas Privadas */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/clients" 
          element={
            <PrivateRoute>
              <ClientList />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/clients/new" 
          element={
            <PrivateRoute>
              <ClientForm />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/clients/detail/:id" 
          element={
            <PrivateRoute>
              <ClientDetail />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/clients/update/:id" 
          element={
            <PrivateRoute>
              <ClientForm />
            </PrivateRoute>
          } 
        />
        
        {/* Rutas Privadas (Gestión de Productos/Inventario) */}
        <Route 
          path="/products" 
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/products/new" 
          element={
            <PrivateRoute>
              <ProductForm />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/products/detail/:id" 
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/products/update/:id" 
          element={
            <PrivateRoute>
              <ProductForm />
            </PrivateRoute>
          } 
        />
        
        {/* Redirigir cualquier otra ruta al Dashboard o Login */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
