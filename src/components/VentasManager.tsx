import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Venta } from '../types';

const VentasManager: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalAmount: 0,
    averageTicket: 0,
  });

  useEffect(() => {
    loadVentas();
  }, [dateFilter]);

  const loadVentas = async () => {
    try {
      const startDate = new Date(dateFilter);
      const endDate = new Date(dateFilter);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          empleado:empleados(nombre),
          detalles:detalle_ventas(
            *,
            platillo:platillos(nombre)
          )
        `)
        .gte('fecha_venta', startDate.toISOString())
        .lte('fecha_venta', endDate.toISOString())
        .order('fecha_venta', { ascending: false });

      if (error) throw error;

      const ventasData = data || [];
      setVentas(ventasData);

      // Calculate stats
      const totalAmount = ventasData.reduce((sum, venta) => sum + venta.total_venta, 0);
      const totalSales = ventasData.length;
      const averageTicket = totalSales > 0 ? totalAmount / totalSales : 0;

      setStats({
        totalSales,
        totalAmount,
        averageTicket,
      });
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
          <p className="text-gray-600">Historial y estadísticas de ventas</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Ventas</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalSales}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monto Total</p>
              <p className="text-3xl font-bold text-gray-800">${stats.totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
              <p className="text-3xl font-bold text-gray-800">${stats.averageTicket.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Ventas del {new Date(dateFilter).toLocaleDateString()}
          </h2>
        </div>

        {ventas.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay ventas registradas para esta fecha</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {ventas.map((venta) => (
              <div key={venta.id_venta} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        Venta #{venta.id_venta.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {venta.empleado?.nombre || 'N/A'} • {' '}
                        {new Date(venta.fecha_venta).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${venta.total_venta.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {venta.metodo_pago}
                    </p>
                  </div>
                </div>

                {venta.detalles && venta.detalles.length > 0 && (
                  <div className="ml-10">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
                    <div className="space-y-1">
                      {venta.detalles.map((detalle) => (
                        <div
                          key={detalle.id_detalle}
                          className="flex justify-between items-center text-sm text-gray-600"
                        >
                          <span>
                            {detalle.cantidad}x {detalle.platillo?.nombre || 'Producto'}
                          </span>
                          <span>${(detalle.precio_unitario * detalle.cantidad).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VentasManager;