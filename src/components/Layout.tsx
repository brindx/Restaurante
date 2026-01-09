import React from 'react';
import { Coffee, LogOut, User, BarChart3, Package, Users, ShoppingCart, Truck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { employee, isManager } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const managerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'empleados', label: 'Empleados', icon: Users },
    { id: 'inventario', label: 'Inventario', icon: Package },
    { id: 'menu', label: 'Menú', icon: Coffee },
    { id: 'proveedores', label: 'Proveedores', icon: Truck },
    { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
  ];

  const cashierMenuItems = [
    { id: 'pos', label: 'Punto de Venta', icon: ShoppingCart },
  ];

  const menuItems = isManager ? managerMenuItems : cashierMenuItems;

  return (
    <div className="min-h-screen bg-amber-50">
      <nav className="bg-white shadow-lg border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Coffee className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-800">El Buen Sabor</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-5 h-5" />
                <span className="font-medium">{employee?.nombre}</span>
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {employee?.puesto}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onPageChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        currentPage === item.id
                          ? 'bg-amber-600 text-white'
                          : 'text-gray-700 hover:bg-amber-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;