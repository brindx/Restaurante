import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Building, Phone, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Proveedor } from '../types';

const ProveedoresManager: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    contacto: '',
    telefono: '',
  });

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .order('nombre_empresa');

      if (error) throw error;
      setProveedores(data || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProveedor) {
        const { error } = await supabase
          .from('proveedores')
          .update(formData)
          .eq('id_proveedor', editingProveedor.id_proveedor);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('proveedores')
          .insert([formData]);
        
        if (error) throw error;
      }

      setShowModal(false);
      setEditingProveedor(null);
      setFormData({
        nombre_empresa: '',
        contacto: '',
        telefono: '',
      });
      loadProveedores();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre_empresa: proveedor.nombre_empresa,
      contacto: proveedor.contacto || '',
      telefono: proveedor.telefono || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        const { error } = await supabase
          .from('proveedores')
          .delete()
          .eq('id_proveedor', id);
        
        if (error) throw error;
        loadProveedores();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Proveedores</h1>
          <p className="text-gray-600">Gestiona los proveedores de ingredientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Proveedor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proveedores.map((proveedor) => (
          <div
            key={proveedor.id_proveedor}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Building className="w-6 h-6 text-amber-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {proveedor.nombre_empresa}
                  </h3>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(proveedor)}
                  className="p-1 text-amber-600 hover:text-amber-700 transition-colors duration-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(proveedor.id_proveedor)}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {proveedor.contacto && (
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">{proveedor.contacto}</span>
                </div>
              )}
              
              {proveedor.telefono && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{proveedor.telefono}</span>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-3">
                Registrado: {new Date(proveedor.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingProveedor ? 'Editar Proveedor' : 'Agregar Proveedor'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={formData.nombre_empresa}
                  onChange={(e) => setFormData({...formData, nombre_empresa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contacto
                </label>
                <input
                  type="text"
                  value={formData.contacto}
                  onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Nombre del contacto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="555-0123"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {editingProveedor ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProveedor(null);
                    setFormData({
                      nombre_empresa: '',
                      contacto: '',
                      telefono: '',
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

export default ProveedoresManager;