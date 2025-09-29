import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    dailySales: 0,
    monthlySales: 0,
    lowStockItems: 0,
    totalEmployees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];

      // Daily sales
      const { data: dailySalesData } = await supabase
        .from('ventas')
        .select('total_venta')
        .gte('fecha_venta', today);

      const dailySales = dailySalesData?.reduce((sum, venta) => sum + venta.total_venta, 0) || 0;

      // Monthly sales
      const { data: monthlySalesData } = await supabase
        .from('ventas')
        .select('total_venta')
        .gte('fecha_venta', startOfMonth);

      const monthlySales = monthlySalesData?.reduce((sum, venta) => sum + venta.total_venta, 0) || 0;

      // Low stock items
      const { data: lowStockData } = await supabase
        .from('ingredientes')
        .select('*')
        .lt('stock', 'stock_minimo');

      // Total employees
      const { data: employeesData } = await supabase
        .from('empleados')
        .select('id_empleado');

      setStats({
        dailySales,
        monthlySales,
        lowStockItems: lowStockData?.length || 0,
        totalEmployees: employeesData?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen de la actividad del café</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
              <p className="text-3xl font-bold text-gray-800">
                ${stats.dailySales.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas del Mes</p>
              <p className="text-3xl font-bold text-gray-800">
                ${stats.monthlySales.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.lowStockItems}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Empleados</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalEmployees}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Sistema iniciado correctamente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Base de datos conectada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>Esperando primera venta del día</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Estado del Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Base de Datos</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Conectada
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sistema POS</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Operativo
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Inventario</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                {stats.lowStockItems > 0 ? 'Revisar Stock' : 'Normal'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;