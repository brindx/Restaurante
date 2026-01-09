'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, X, Heart, ShoppingCart, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ==================== TOAST NOTIFICATION ==================== */
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: -50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -50, x: '-50%' }}
        className="fixed top-24 left-1/2 z-[200] bg-white shadow-2xl rounded-lg px-6 py-4 flex items-center gap-3 min-w-[300px]"
    >
        <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-500' : 'bg-[#d4af37]'}`} />
        <p className="text-[#0a0a0a] font-medium">{message}</p>
        <button onClick={onClose} className="ml-auto text-[#666] hover:text-[#0a0a0a]">
            <X size={16} />
        </button>
    </motion.div>
);

/* ==================== PRELOADER ==================== */
const Preloader = ({ onComplete }) => {
    return (
        <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                onAnimationComplete={() => setTimeout(onComplete, 800)}
                className="flex flex-col items-center"
            >
                <h1 className="text-6xl md:text-9xl font-display text-[#f4f1ea] font-black tracking-tighter">
                    MENÚ
                </h1>
                <div className="h-[1px] w-24 bg-[#d4af37] mt-4" />
            </motion.div>
        </motion.div>
    );
};

/* ==================== NAVBAR ==================== */
const MenuNavbar = ({ cartCount }) => (
    <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="fixed w-full z-50 px-8 py-6 flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-md"
    >
        <Link href="/" className="font-display font-bold text-3xl text-white hover:text-[#d4af37] transition-colors">
            LIT.
        </Link>
        <div className="flex items-center gap-6">
            <div className="relative">
                <ShoppingCart className="text-white hover:text-[#d4af37] transition-colors cursor-pointer" size={24} />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d4af37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartCount}
                    </span>
                )}
            </div>
            <Link href="/" className="flex items-center gap-2 text-white hover:text-[#d4af37] transition-colors text-sm uppercase tracking-wider">
                <ArrowLeft size={20} />
                Volver
            </Link>
        </div>
    </motion.nav>
);

/* ==================== DISH DETAIL MODAL ==================== */
const DishModal = ({ dish, onClose, onAddToCart, onToggleFavorite, isFavorite }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
            <div className="relative h-96">
                <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                    <X className="text-[#0a0a0a]" size={24} />
                </button>
                <button
                    onClick={() => onToggleFavorite(dish.name)}
                    className="absolute top-4 left-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                    <Heart
                        className={isFavorite ? "text-red-500 fill-red-500" : "text-[#0a0a0a]"}
                        size={24}
                    />
                </button>
            </div>

            <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block bg-[#0a0a0a] text-white px-4 py-1 rounded-full text-xs uppercase tracking-wider mb-3">
                            {dish.category}
                        </span>
                        <h2 className="text-4xl font-display font-bold text-[#0a0a0a]">{dish.name}</h2>
                    </div>
                    <span className="text-4xl font-bold text-[#d4af37]">{dish.price}</span>
                </div>

                <p className="text-[#666] text-lg mb-8 leading-relaxed">{dish.description}</p>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#0a0a0a] mb-4">Ingredientes Principales</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                        {dish.ingredients.map((ing, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[#f4f1ea] px-4 py-3 rounded-lg">
                                <span className="text-[#333]">{ing.item}</span>
                                <span className="text-[#d4af37] font-mono font-bold">{ing.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {dish.allergens && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-[#0a0a0a] mb-4">Alérgenos</h3>
                        <p className="text-[#666]">{dish.allergens}</p>
                    </div>
                )}

                <button
                    onClick={() => onAddToCart(dish)}
                    className="w-full bg-[#d4af37] text-white py-4 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-[#0a0a0a] transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                    Agregar al Carrito
                </button>
            </div>
        </motion.div>
    </motion.div>
);

/* ==================== MENU SECTION ==================== */
const MenuSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedDish, setSelectedDish] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState(null);

    const menuItems = [
        {
            name: "Wagyu al Carbón",
            category: "Carnes",
            description: "Corte premium sellado a fuego directo con vegetales asados",
            image: "/images/wagyu.png",
            price: "$850",
            allergens: "Contiene: Ninguno",
            ingredients: [
                { item: "Wagyu importado", quantity: "250g" },
                { item: "Vegetales de temporada", quantity: "120g" },
                { item: "Reducción de vino tinto", quantity: "30ml" },
                { item: "Mantequilla de hierbas", quantity: "20g" }
            ]
        },
        {
            name: "Pulpo a la Brasa",
            category: "Mar",
            description: "Tentáculo de pulpo mediterráneo con chimichurri de cilantro",
            image: "/images/octopus.png",
            price: "$420",
            allergens: "Contiene: Mariscos",
            ingredients: [
                { item: "Pulpo fresco", quantity: "200g" },
                { item: "Tomates cherry", quantity: "80g" },
                { item: "Chimichurri casero", quantity: "40ml" },
                { item: "Aceite de oliva", quantity: "15ml" }
            ]
        },
        {
            name: "Risotto de Hongos Salvajes",
            category: "Tierra",
            description: "Arroz arborio con trufa negra y parmesano reggiano",
            image: "/images/risotto.png",
            price: "$380",
            allergens: "Contiene: Lácteos, Gluten",
            ingredients: [
                { item: "Arroz arborio", quantity: "150g" },
                { item: "Hongos porcini y shiitake", quantity: "100g" },
                { item: "Trufa negra", quantity: "5g" },
                { item: "Parmesano reggiano", quantity: "40g" },
                { item: "Caldo de vegetales", quantity: "200ml" }
            ]
        },
        {
            name: "Salmón Glaseado",
            category: "Mar",
            description: "Filete de salmón noruego con espárragos y mantequilla cítrica",
            image: "/images/salmon.png",
            price: "$520",
            allergens: "Contiene: Pescado, Lácteos",
            ingredients: [
                { item: "Salmón noruego", quantity: "220g" },
                { item: "Espárragos verdes", quantity: "100g" },
                { item: "Mantequilla de limón", quantity: "30g" },
                { item: "Hierbas frescas", quantity: "10g" }
            ]
        },
        {
            name: "Rack de Cordero",
            category: "Carnes",
            description: "Costillar con costra de hierbas y papas confitadas",
            image: "/images/lamb.png",
            price: "$680",
            allergens: "Contiene: Ninguno",
            ingredients: [
                { item: "Rack de cordero", quantity: "300g" },
                { item: "Costra de romero y tomillo", quantity: "25g" },
                { item: "Papas baby", quantity: "150g" },
                { item: "Zanahorias glaseadas", quantity: "80g" }
            ]
        },
        {
            name: "Volcán de Chocolate",
            category: "Postres",
            description: "Bizcocho caliente con centro líquido y helado de vainilla bourbon",
            image: "/images/dessert.png",
            price: "$250",
            allergens: "Contiene: Lácteos, Huevo, Gluten",
            ingredients: [
                { item: "Chocolate belga 70%", quantity: "80g" },
                { item: "Helado de vainilla", quantity: "60g" },
                { item: "Coulis de frutos rojos", quantity: "30ml" },
                { item: "Lámina de oro comestible", quantity: "1 pieza" }
            ]
        }
    ];

    const categories = ['Todos', 'Carnes', 'Mar', 'Tierra', 'Postres'];

    // Load favorites from localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('lit-favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Filter dishes
    const filteredDishes = menuItems.filter(dish => {
        const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || dish.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFavorite = (dishName) => {
        const newFavorites = favorites.includes(dishName)
            ? favorites.filter(f => f !== dishName)
            : [...favorites, dishName];

        setFavorites(newFavorites);
        localStorage.setItem('lit-favorites', JSON.stringify(newFavorites));

        showToast(
            favorites.includes(dishName)
                ? 'Eliminado de favoritos'
                : '¡Agregado a favoritos!',
            'success'
        );
    };

    const addToCart = (dish) => {
        setCart([...cart, dish]);
        setSelectedDish(null);
        showToast(`${dish.name} agregado al carrito`, 'success');
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <section className="min-h-screen py-32 bg-[#f4f1ea]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <p className="text-[#d4af37] text-sm uppercase tracking-[0.4em] mb-4 font-bold">
                        Menú Degustación
                    </p>
                    <h1 className="text-5xl md:text-7xl font-display text-[#0a0a0a] mb-6 font-black">
                        Nuestra Carta
                    </h1>
                    <div className="w-32 h-[2px] bg-[#d4af37] mx-auto mb-6" />
                    <p className="text-[#666] text-lg max-w-2xl mx-auto">
                        Cada platillo es una experiencia única, elaborado con ingredientes de la más alta calidad
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.6 }}
                    className="max-w-4xl mx-auto mb-12"
                >
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar platillos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-full border-2 border-transparent focus:border-[#d4af37] outline-none transition-all text-[#0a0a0a]"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium text-sm uppercase tracking-wider transition-all ${selectedCategory === category
                                        ? 'bg-[#d4af37] text-white shadow-lg'
                                        : 'bg-white text-[#666] hover:bg-[#0a0a0a] hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Results Count */}
                <p className="text-center text-[#666] mb-8">
                    {filteredDishes.length} platillo{filteredDishes.length !== 1 ? 's' : ''} encontrado{filteredDishes.length !== 1 ? 's' : ''}
                </p>

                {/* Menu Grid */}
                <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    <AnimatePresence>
                        {filteredDishes.map((item, index) => (
                            <motion.div
                                key={item.name}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                onClick={() => setSelectedDish(item)}
                            >
                                {/* Image */}
                                <div className="relative h-80 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute top-4 right-4 bg-[#d4af37] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                        {item.price}
                                    </div>
                                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs uppercase tracking-wider">
                                        {item.category}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(item.name);
                                        }}
                                        className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full hover:bg-white transition-colors"
                                    >
                                        <Heart
                                            className={favorites.includes(item.name) ? "text-red-500 fill-red-500" : "text-[#0a0a0a]"}
                                            size={20}
                                        />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <h3 className="text-3xl font-display text-[#0a0a0a] mb-3 font-bold">
                                        {item.name}
                                    </h3>
                                    <p className="text-[#666] text-base mb-6 leading-relaxed">
                                        {item.description}
                                    </p>

                                    {/* Ingredients Preview */}
                                    <div className="border-t border-[#d4af37]/20 pt-6">
                                        <h4 className="text-sm uppercase tracking-wider text-[#d4af37] mb-4 font-bold">
                                            Ingredientes Principales
                                        </h4>
                                        <div className="space-y-2">
                                            {item.ingredients.slice(0, 3).map((ing, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span className="text-[#333] font-light">{ing.item}</span>
                                                    <span className="text-[#d4af37] font-mono font-medium">{ing.quantity}</span>
                                                </div>
                                            ))}
                                            {item.ingredients.length > 3 && (
                                                <p className="text-xs text-[#999] italic">+{item.ingredients.length - 3} más...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Line Effect */}
                                <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* No Results */}
                {filteredDishes.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-[#666] text-2xl mb-4">No se encontraron platillos</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('Todos');
                            }}
                            className="text-[#d4af37] underline hover:text-[#0a0a0a] transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="text-center mt-20"
                >
                    <p className="text-[#666] mb-6 text-lg">¿Listo para una experiencia inolvidable?</p>
                    <Link href="/#contacto">
                        <button className="bg-[#0a0a0a] text-white px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-[#d4af37] transition-all duration-300 rounded-full shadow-lg hover:shadow-2xl">
                            Reservar Mesa
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Dish Detail Modal */}
            <AnimatePresence>
                {selectedDish && (
                    <DishModal
                        dish={selectedDish}
                        onClose={() => setSelectedDish(null)}
                        onAddToCart={addToCart}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={favorites.includes(selectedDish.name)}
                    />
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </section>
    );
};

/* ==================== MAIN ==================== */
export default function MenuPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState([]);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {!isLoading && (
                <main className="w-full overflow-hidden bg-[#f4f1ea]">
                    <MenuNavbar cartCount={cart.length} />
                    <MenuSection />
                </main>
            )}
        </>
    );
}
