import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, CreditCard, DollarSign, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Platillo, CartItem } from '../types';

const POS: React.FC = () => {
  const { employee } = useAuth();
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');

  const categorias = ['todos', 'bebidas', 'comidas', 'postres', 'panaderia', 'snacks'];

  useEffect(() => {
    loadPlatillos();
  }, []);

  const loadPlatillos = async () => {
    try {
      const { data, error } = await supabase
        .from('platillos')
        .select('*')
        .eq('disponible', true)
        .order('categoria')
        .order('nombre');

      if (error) throw error;
      setPlatillos(data || []);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlatillos = selectedCategory === 'todos' 
    ? platillos 
    : platillos.filter(p => p.categoria === selectedCategory);

  const addToCart = (platillo: Platillo) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.platillo.id_platillo === platillo.id_platillo);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.platillo.id_platillo === platillo.id_platillo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCart, { platillo, cantidad: 1 }];
      }
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.platillo.id_platillo === id
            ? { ...item, cantidad: newQuantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.platillo.id_platillo !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.platillo.precio * item.cantidad), 0);
  };

  const processSale = async () => {
    if (cart.length === 0 || !employee) return;

    setProcessing(true);
    try {
      const totalVenta = getTotalAmount();

      // Create the sale
      const { data: ventaData, error: ventaError } = await supabase
        .from('ventas')
        .insert([{
          total_venta: totalVenta,
          id_empleado: employee.id_empleado,
          metodo_pago: paymentMethod,
        }])
        .select()
        .single();

      if (ventaError) throw ventaError;

      // Create sale details
      const detalles = cart.map(item => ({
        id_venta: ventaData.id_venta,
        id_platillo: item.platillo.id_platillo,
        cantidad: item.cantidad,
        precio_unitario: item.platillo.precio,
      }));

      const { error: detalleError } = await supabase
        .from('detalle_ventas')
        .insert(detalles);

      if (detalleError) throw detalleError;

      // Clear cart and show success
      clearCart();
      alert('¡Venta procesada exitosamente!');
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error al procesar la venta. Intenta de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Menú</h2>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categorias.map((categoria) => (
                  <button
                    key={categoria}
                    onClick={() => setSelectedCategory(categoria)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === categoria
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                    }`}
                  >
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlatillos.map((platillo) => (
                  <button
                    key={platillo.id_platillo}
                    onClick={() => addToCart(platillo)}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-md transition-all duration-200 text-left"
                  >
                    {platillo.imagen_url && (
                      <img
                        src={platillo.imagen_url}
                        alt={platillo.nombre}
                        className="w-full h-24 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {platillo.nombre}
                    </h3>
                    {platillo.descripcion && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {platillo.descripcion}
                      </p>
                    )}
                    <p className="text-lg font-bold text-amber-600">
                      ${platillo.precio.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Ticket
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Selecciona productos del menú</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.platillo.id_platillo}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.platillo.nombre}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ${item.platillo.precio.toFixed(2)} c/u
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.platillo.id_platillo, item.cantidad - 1)}
                          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        
                        <span className="w-8 text-center font-medium">
                          {item.cantidad}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.platillo.id_platillo, item.cantidad + 1)}
                          className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => removeFromCart(item.platillo.id_platillo)}
                          className="p-1 text-red-600 hover:text-red-700 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-800">
                          ${(item.platillo.precio * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('efectivo')}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors duration-200 ${
                        paymentMethod === 'efectivo'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <DollarSign className="w-5 h-5 mr-2" />
                      Efectivo
                    </button>
                    <button
                      onClick={() => setPaymentMethod('tarjeta')}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors duration-200 ${
                        paymentMethod === 'tarjeta'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Tarjeta
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-2xl font-bold text-gray-800">
                    <span>Total:</span>
                    <span className="text-amber-600">
                      ${getTotalAmount().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Process Sale Button */}
                <button
                  onClick={processSale}
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {processing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Procesar Venta
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;