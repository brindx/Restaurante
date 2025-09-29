import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Platillo } from '../types';

const MenuManager: React.FC = () => {
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlatillo, setEditingPlatillo] = useState<Platillo | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'general',
    disponible: true,
    imagen_url: '',
  });

  const categorias = ['general', 'bebidas', 'comidas', 'postres', 'panaderia', 'snacks'];

  useEffect(() => {
    loadPlatillos();
  }, []);

  const loadPlatillos = async () => {
    try {
      const { data, error } = await supabase
        .from('platillos')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nombre', { ascending: true });

      if (error) throw error;
      setPlatillos(data || []);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlatillo) {
        const { error } = await supabase
          .from('platillos')
          .update(formData)
          .eq('id_platillo', editingPlatillo.id_platillo);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('platillos')
          .insert([formData]);
        
        if (error) throw error;
      }

      setShowModal(false);
      setEditingPlatillo(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: 'general',
        disponible: true,
        imagen_url: '',
      });
      loadPlatillos();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (platillo: Platillo) => {
    setEditingPlatillo(platillo);
    setFormData({
      nombre: platillo.nombre,
      descripcion: platillo.descripcion || '',
      precio: platillo.precio,
      categoria: platillo.categoria,
      disponible: platillo.disponible,
      imagen_url: platillo.imagen_url || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este platillo?')) {
      try {
        const { error } = await supabase
          .from('platillos')
          .delete()
          .eq('id_platillo', id);
        
        if (error) throw error;
        loadPlatillos();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const toggleAvailability = async (platillo: Platillo) => {
    try {
      const { error } = await supabase
        .from('platillos')
        .update({ disponible: !platillo.disponible })
        .eq('id_platillo', platillo.id_platillo);
      
      if (error) throw error;
      loadPlatillos();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const groupedPlatillos = platillos.reduce((acc, platillo) => {
    const categoria = platillo.categoria;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(platillo);
    return acc;
  }, {} as Record<string, Platillo[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Menú</h1>
          <p className="text-gray-600">Gestiona los productos de la cafetería</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Platillo</span>
        </button>
      </div>

      {Object.entries(groupedPlatillos).map(([categoria, items]) => (
        <div key={categoria} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 capitalize border-b-2 border-amber-200 pb-2">
            {categoria}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((platillo) => (
              <div
                key={platillo.id_platillo}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  !platillo.disponible ? 'opacity-60' : ''
                }`}
              >
                {platillo.imagen_url && (
                  <img
                    src={platillo.imagen_url}
                    alt={platillo.nombre}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {platillo.nombre}
                    </h3>
                    <span className="text-lg font-bold text-amber-600">
                      ${platillo.precio.toFixed(2)}
                    </span>
                  </div>
                  
                  {platillo.descripcion && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {platillo.descripcion}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      platillo.disponible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {platillo.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => toggleAvailability(platillo)}
                        className={`p-1 rounded transition-colors duration-200 ${
                          platillo.disponible
                            ? 'text-gray-500 hover:text-red-600'
                            : 'text-gray-500 hover:text-green-600'
                        }`}
                      >
                        {platillo.disponible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(platillo)}
                        className="p-1 text-amber-600 hover:text-amber-700 transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(platillo.id_platillo)}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingPlatillo ? 'Editar Platillo' : 'Agregar Platillo'}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({...formData, imagen_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="disponible"
                  checked={formData.disponible}
                  onChange={(e) => setFormData({...formData, disponible: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                />
                <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
                  Disponible para la venta
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {editingPlatillo ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPlatillo(null);
                    setFormData({
                      nombre: '',
                      descripcion: '',
                      precio: 0,
                      categoria: 'general',
                      disponible: true,
                      imagen_url: '',
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

export default MenuManager;