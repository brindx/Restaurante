import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, AlertTriangle, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Ingrediente, Proveedor } from '../types';

const InventarioManager: React.FC = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState<Ingrediente | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    stock: 0,
    stock_minimo: 5,
    unidad_medida: 'unidad',
    id_proveedor: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ingredientesResult, proveedoresResult] = await Promise.all([
        supabase
          .from('ingredientes')
          .select(`
            *,
            proveedor:proveedores(*)
          `)
          .order('nombre'),
        supabase
          .from('proveedores')
          .select('*')
          .order('nombre_empresa')
      ]);

      if (ingredientesResult.error) throw ingredientesResult.error;
      if (proveedoresResult.error) throw proveedoresResult.error;

      setIngredientes(ingredientesResult.data || []);
      setProveedores(proveedoresResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        id_proveedor: formData.id_proveedor || null,
      };

      if (editingIngrediente) {
        const { error } = await supabase
          .from('ingredientes')
          .update(dataToSave)
          .eq('id_ingrediente', editingIngrediente.id_ingrediente);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ingredientes')
          .insert([dataToSave]);
        
        if (error) throw error;
      }

      setShowModal(false);
      setEditingIngrediente(null);
      setFormData({
        nombre: '',
        stock: 0,
        stock_minimo: 5,
        unidad_medida: 'unidad',
        id_proveedor: '',
      });
      loadData();
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  const handleEdit = (ingrediente: Ingrediente) => {
    setEditingIngrediente(ingrediente);
    setFormData({
      nombre: ingrediente.nombre,
      stock: ingrediente.stock,
      stock_minimo: ingrediente.stock_minimo,
      unidad_medida: ingrediente.unidad_medida,
      id_proveedor: ingrediente.id_proveedor || '',
    });
    setShowModal(true);
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('ingredientes')
        .update({ stock: newStock })
        .eq('id_ingrediente', id);
      
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const lowStockItems = ingredientes.filter(item => item.stock <= item.stock_minimo);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
          <p className="text-gray-600">Gestiona el stock de ingredientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Ingrediente</span>
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Stock Bajo - {lowStockItems.length} ingrediente(s)
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {lowStockItems.map(item => (
                  <span key={item.id_ingrediente} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 mb-1">
                    {item.nombre}: {item.stock} {item.unidad_medida}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredientes.map((ingrediente) => (
          <div
            key={ingrediente.id_ingrediente}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
              ingrediente.stock <= ingrediente.stock_minimo
                ? 'border-red-500'
                : 'border-green-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  ingrediente.stock <= ingrediente.stock_minimo
                    ? 'bg-red-100'
                    : 'bg-green-100'
                }`}>
                  <Package className={`w-5 h-5 ${
                    ingrediente.stock <= ingrediente.stock_minimo
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {ingrediente.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {ingrediente.proveedor?.nombre_empresa || 'Sin proveedor'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEdit(ingrediente)}
                className="text-amber-600 hover:text-amber-700 p-1"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stock actual:</span>
                <span className="text-sm font-semibold">
                  {ingrediente.stock} {ingrediente.unidad_medida}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stock mínimo:</span>
                <span className="text-sm">
                  {ingrediente.stock_minimo} {ingrediente.unidad_medida}
                </span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => updateStock(ingrediente.id_ingrediente, ingrediente.stock + 1)}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 py-2 px-3 rounded-lg text-sm transition-colors duration-200"
              >
                +1
              </button>
              <button
                onClick={() => updateStock(ingrediente.id_ingrediente, ingrediente.stock + 10)}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 py-2 px-3 rounded-lg text-sm transition-colors duration-200"
              >
                +10
              </button>
              <button
                onClick={() => updateStock(ingrediente.id_ingrediente, Math.max(0, ingrediente.stock - 1))}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-3 rounded-lg text-sm transition-colors duration-200"
              >
                -1
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingIngrediente ? 'Editar Ingrediente' : 'Agregar Ingrediente'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.stock_minimo}
                    onChange={(e) => setFormData({...formData, stock_minimo: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad de Medida
                </label>
                <select
                  value={formData.unidad_medida}
                  onChange={(e) => setFormData({...formData, unidad_medida: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="unidad">Unidad</option>
                  <option value="kg">Kilogramos</option>
                  <option value="litros">Litros</option>
                  <option value="paquetes">Paquetes</option>
                  <option value="cajas">Cajas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <select
                  value={formData.id_proveedor}
                  onChange={(e) => setFormData({...formData, id_proveedor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                      {proveedor.nombre_empresa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {editingIngrediente ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingIngrediente(null);
                    setFormData({
                      nombre: '',
                      stock: 0,
                      stock_minimo: 5,
                      unidad_medida: 'unidad',
                      id_proveedor: '',
                    });
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioManager;