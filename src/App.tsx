import React, { useState } from 'react';
import AuthGuard from './components/AuthGuard';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmpleadosManager from './components/EmpleadosManager';
import InventarioManager from './components/InventarioManager';
import MenuManager from './components/MenuManager';
import ProveedoresManager from './components/ProveedoresManager';
import VentasManager from './components/VentasManager';
import POS from './components/POS';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isManager } = useAuth();
  const [currentPage, setCurrentPage] = useState(isManager ? 'dashboard' : 'pos');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'empleados':
        return <EmpleadosManager />;
      case 'inventario':
        return <InventarioManager />;
      case 'menu':
        return <MenuManager />;
      case 'proveedores':
        return <ProveedoresManager />;
      case 'ventas':
        return <VentasManager />;
      case 'pos':
        return <POS />;
      default:
        return isManager ? <Dashboard /> : <POS />;
    }
  };

  return (
    <AuthGuard requireManager={currentPage !== 'pos'}>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AuthGuard>
  );
}

export default App;