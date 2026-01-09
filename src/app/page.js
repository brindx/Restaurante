'use client';

import { useEffect, useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDown, Flame, Award, Users, Menu, X, Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

/* ==================== CURSOR ==================== */
const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", updatePosition);
        return () => window.removeEventListener("mousemove", updatePosition);
    }, []);

    return (
        <motion.div
            className="fixed w-8 h-8 rounded-full border border-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
            style={{ left: 0, top: 0 }}
            animate={{ x: position.x - 16, y: position.y - 16 }}
            transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        >
            <div className="w-1 h-1 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
    );
};

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
                onAnimationComplete={() => setTimeout(onComplete, 1000)}
                className="flex flex-col items-center"
            >
                <h1 className="text-6xl md:text-9xl font-display text-[#f4f1ea] font-black tracking-tighter">
                    LIT
                </h1>
                <div className="h-[1px] w-24 bg-[#d4af37] mt-4" />
            </motion.div>
        </motion.div>
    );
};

/* ==================== RESERVATION MODAL ==================== */
const ReservationModal = ({ onClose, showToast }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2'
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Teléfono inválido';
        if (!formData.date) newErrors.date = 'Fecha requerida';
        if (!formData.time) newErrors.time = 'Hora requerida';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            // Save reservation to localStorage
            const reservation = {
                id: Date.now().toString(),
                ...formData,
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            const existingReservations = JSON.parse(localStorage.getItem('lit-reservations') || '[]');
            localStorage.setItem('lit-reservations', JSON.stringify([...existingReservations, reservation]));

            showToast('¡Reserva confirmada! Te enviaremos un correo de confirmación', 'success');
            onClose();
            setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '2' });
        } else {
            setErrors(newErrors);
        }
    };

    return (
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
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-4xl font-display font-bold text-[#0a0a0a]">Reservar Mesa</h2>
                        <button onClick={onClose} className="text-[#666] hover:text-[#0a0a0a]">
                            <X size={28} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-[#0a0a0a] mb-2 uppercase tracking-wider">
                                Nombre Completo *
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={20} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-[#d4af37]'
                                        }`}
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#0a0a0a] mb-2 uppercase tracking-wider">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={20} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#d4af37]'
                                        }`}
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#0a0a0a] mb-2 uppercase tracking-wider">
                                Teléfono *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={20} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-[#d4af37]'
                                        }`}
                                    placeholder="55 1234 5678"
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-[#0a0a0a] mb-2 uppercase tracking-wider">
                                    Fecha *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={20} />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition-all ${errors.date ? 'border-red-500' : 'border-gray-200 focus:border-[#d4af37]'
                                            }`}
                                    />
                                </div>
                                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#0a0a0a] mb-2 uppercase tracking-wider">
                                    Hora *
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={20} />
                                    <select
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition-all ${errors.time ? 'border-red-500' : 'border-gray-200 focus:border-[#d4af37]'
                                            }`}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option>18:00</option>
                                        <option>19:00</option>
                                        <option>20:00</option>
                                        <option>21:00</option>
                                        <option>22:00</option>
                                    </select>
                                </div>
                                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#0a0a0a] mb-2 uppercase tracking-wider">
                                Número de Personas
                            </label>
                            <select
                                value={formData.guests}
                                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#d4af37] transition-all"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#d4af37] text-white py-4 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-[#0a0a0a] transition-all duration-300 shadow-lg hover:shadow-2xl"
                        >
                            Confirmar Reserva
                        </button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ==================== NAVBAR ==================== */
const Navbar = ({ onOpenReservation }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="fixed w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-exclusion text-white"
            >
                <span className="font-display font-bold text-3xl cursor-pointer">LIT.</span>
                <div className="hidden md:flex gap-10 text-sm uppercase tracking-widest font-medium">
                    <a href="#inicio" className="hover:text-[#d4af37] transition-colors">Inicio</a>
                    <a href="#nosotros" className="hover:text-[#d4af37] transition-colors">Nosotros</a>
                    <Link href="/menu" className="hover:text-[#d4af37] transition-colors">Menú</Link>
                    <a href="#contacto" className="hover:text-[#d4af37] transition-colors">Contacto</a>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onOpenReservation}
                        className="hidden md:block bg-white text-black px-6 py-2 text-sm uppercase tracking-wider font-bold hover:bg-[#d4af37] hover:text-white transition-all rounded"
                    >
                        Reservar
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden text-white"
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 right-0 z-[200] w-full md:w-96 bg-[#0a0a0a] p-8"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-display text-4xl text-[#d4af37]">LIT.</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                                <X size={32} />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-6">
                            <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-display hover:text-[#d4af37] transition-colors">
                                Inicio
                            </a>
                            <a href="#nosotros" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-display hover:text-[#d4af37] transition-colors">
                                Nosotros
                            </a>
                            <Link href="/menu" className="text-white text-2xl font-display hover:text-[#d4af37] transition-colors">
                                Menú
                            </Link>
                            <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-display hover:text-[#d4af37] transition-colors">
                                Contacto
                            </a>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onOpenReservation();
                                }}
                                className="bg-[#d4af37] text-white px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wider mt-8"
                            >
                                Reservar Mesa
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

/* ==================== HERO SECTION (BIG TOP) ==================== */
const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 400]);

    return (
        <section id="inicio" className="h-screen relative overflow-hidden flex items-center justify-center bg-[#0a0a0a]">
            {/* Background Image with Parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative w-full h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
                        alt="Restaurant Ambiance"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-5xl">
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                    className="text-[#d4af37] text-sm md:text-base uppercase tracking-[0.5em] mb-6 font-bold"
                >
                    Bienvenido a LIT
                </motion.p>

                <div className="overflow-hidden mb-4">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 2.3, duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="text-6xl md:text-[12rem] leading-none font-display font-black text-[#f4f1ea]"
                    >
                        EXPERIENCIA
                    </motion.h1>
                </div>

                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 2.4, duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="text-6xl md:text-[12rem] leading-none font-display font-black text-transparent mb-8"
                        style={{ WebkitTextStroke: "2px rgba(255,255,255,0.6)" }}
                    >
                        CULINARIA
                    </motion.h1>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8, duration: 1 }}
                    className="text-[#f4f1ea]/90 text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed"
                >
                    Donde cada platillo cuenta una historia y cada bocado es una obra de arte.
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/80 flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <ArrowDown size={20} />
            </motion.div>
        </section>
    );
};

/* ==================== 3-CARD GRID (BOTTOM) ==================== */
const ThreeCardSection = () => {
    const cards = [
        {
            icon: Flame,
            title: "Cocina al Fuego Vivo",
            description: "Nuestro chef domina el arte ancestral del fuego directo. Cada ingrediente alcanza su máxima expresión a través de técnicas tradicionales y sabor ahumado único.",
            image: "/images/fire.png",
            fallback: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=800"
        },
        {
            icon: Award,
            title: "Ingredientes de Excelencia",
            description: "Seleccionamos rigurosamente cada producto de proveedores locales comprometidos con la calidad superior y la sostenibilidad en cada cosecha.",
            image: "/images/plating.png",
            fallback: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800"
        },
        {
            icon: Users,
            title: "Ambiente Excepcional",
            description: "Un espacio diseñado para celebrar. Iluminación íntima, música envolvente y servicio impecable crean momentos que permanecen en tu memoria.",
            image: "/images/interior.png",
            fallback: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800"
        }
    ];

    return (
        <section id="nosotros" className="py-24 md:py-32 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <p className="text-[#d4af37] text-sm uppercase tracking-[0.4em] mb-4 font-bold">
                        Nuestra Pasión
                    </p>
                    <h2 className="text-5xl md:text-7xl font-display text-[#f4f1ea] mb-6 font-black">
                        Lo Que Nos Define
                    </h2>
                    <div className="w-32 h-[2px] bg-[#d4af37] mx-auto" />
                </motion.div>

                {/* 3-Column Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 shadow-2xl"
                        >
                            {/* Image */}
                            <div className="relative h-80 overflow-hidden">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    onError={(e) => {
                                        e.currentTarget.src = card.fallback;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                                {/* Icon */}
                                <div className="absolute top-6 left-6 p-4 bg-[#d4af37]/20 backdrop-blur-sm rounded-full">
                                    <card.icon size={32} className="text-[#d4af37]" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="text-3xl font-display text-[#f4f1ea] mb-4 font-bold">
                                    {card.title}
                                </h3>
                                <p className="text-[#999] font-light leading-relaxed text-base">
                                    {card.description}
                                </p>
                            </div>

                            {/* Hover Border Effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#d4af37]/30 transition-all duration-500 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ==================== MENU SECTION ==================== */
const MenuSection = () => {
    const menuItems = [
        {
            name: "Wagyu al Carbón",
            category: "Carnes",
            description: "Corte premium sellado a fuego directo con vegetales asados",
            image: "/images/wagyu.png",
            price: "$850",
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
            ingredients: [
                { item: "Chocolate belga 70%", quantity: "80g" },
                { item: "Helado de vainilla", quantity: "60g" },
                { item: "Coulis de frutos rojos", quantity: "30ml" },
                { item: "Lámina de oro comestible", quantity: "1 pieza" }
            ]
        }
    ];

    return (
        <section id="menu" className="py-32 bg-[#f4f1ea]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <p className="text-[#d4af37] text-sm uppercase tracking-[0.4em] mb-4 font-bold">
                        Menú Degustación
                    </p>
                    <h2 className="text-5xl md:text-7xl font-display text-[#0a0a0a] mb-6 font-black">
                        Nuestra Carta
                    </h2>
                    <div className="w-32 h-[2px] bg-[#d4af37] mx-auto" />
                </motion.div>

                {/* Menu Grid */}
                <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
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
                                <div className="absolute top-4 right-4 bg-[#d4af37] text-white px-4 py-2 rounded-full font-bold text-lg">
                                    {item.price}
                                </div>
                                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs uppercase tracking-wider">
                                    {item.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="text-3xl font-display text-[#0a0a0a] mb-3 font-bold">
                                    {item.name}
                                </h3>
                                <p className="text-[#666] text-base mb-6 leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Ingredients */}
                                <div className="border-t border-[#d4af37]/20 pt-6">
                                    <h4 className="text-sm uppercase tracking-wider text-[#d4af37] mb-4 font-bold">
                                        Ingredientes Principales
                                    </h4>
                                    <div className="space-y-2">
                                        {item.ingredients.map((ing, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="text-[#333] font-light">{ing.item}</span>
                                                <span className="text-[#d4af37] font-mono font-medium">{ing.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Line Effect */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <p className="text-[#666] mb-6 text-lg">¿Listo para una experiencia inolvidable?</p>
                    <button className="bg-[#0a0a0a] text-white px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-[#d4af37] transition-all duration-300 rounded-full shadow-lg hover:shadow-2xl">
                        Reservar Mesa
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

/* ==================== FOOTER WITH CONTACT FORM ==================== */
const Footer = ({ showToast }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});

    const handleContactSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.message.trim()) newErrors.message = 'Mensaje requerido';

        if (Object.keys(newErrors).length === 0) {
            showToast('¡Mensaje enviado! Te contactaremos pronto', 'success');
            setFormData({ name: '', email: '', message: '' });
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <footer id="contacto" className="bg-black text-[#f4f1ea] py-16 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 mb-16">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="font-display text-4xl mb-6 text-[#d4af37]">Contáctanos</h3>
                        <p className="text-[#888] mb-8">¿Tienes alguna pregunta? Envíanos un mensaje</p>

                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nombre"
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg outline-none text-white placeholder:text-[#666] transition-all ${errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                                        }`}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Email"
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg outline-none text-white placeholder:text-[#666] transition-all ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                                        }`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Mensaje"
                                    rows={5}
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg outline-none text-white placeholder:text-[#666] resize-none transition-all ${errors.message ? 'border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                                        }`}
                                />
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#d4af37] text-white py-3 rounded-lg font-bold hover:bg-white hover:text-[#0a0a0a] transition-all uppercase tracking-wider"
                            >
                                Enviar Mensaje
                            </button>
                        </form>
                    </motion.div>

                    {/* Info */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm uppercase tracking-wider mb-6 text-[#d4af37] font-bold">Horarios</h4>
                            <ul className="space-y-3 text-[#888] font-light">
                                <li>Martes - Jueves: 18:00 - 23:00</li>
                                <li>Viernes - Sábado: 18:00 - 00:00</li>
                                <li>Domingo: 13:00 - 17:00</li>
                                <li className="text-[#d4af37] pt-2 font-medium">Lunes: Cerrado</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm uppercase tracking-wider mb-6 text-[#d4af37] font-bold">Contacto</h4>
                            <ul className="space-y-3 text-[#888] font-light">
                                <li>info@restaurantelit.mx</li>
                                <li>+52 55 1234 5678</li>
                                <li className="pt-4">
                                    Av. Masaryk 123<br />
                                    Polanco, CDMX 11560
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <h3 className="font-display text-4xl text-[#d4af37]">LIT.</h3>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-[#888] hover:text-[#d4af37] transition-colors">Instagram</a>
                            <a href="#" className="text-[#888] hover:text-[#d4af37] transition-colors">Facebook</a>
                            <a href="#" className="text-[#888] hover:text-[#d4af37] transition-colors">TripAdvisor</a>
                        </div>
                    </div>
                    <p className="text-sm text-[#555] text-center">© 2024 LIT Restaurant. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

/* ==================== MAIN ==================== */
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [reservationOpen, setReservationOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const router = useRouter();

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Keyboard shortcut: Ctrl+Shift+A to open Admin Dashboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                router.push('/admin/reservations');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return (
        <ReactLenis root>
            <AnimatePresence mode="wait">
                {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {!isLoading && (
                <>
                    <CustomCursor />
                    <main className="w-full overflow-hidden">
                        <Navbar onOpenReservation={() => setReservationOpen(true)} />
                        <Hero />
                        <ThreeCardSection />
                        <Footer showToast={showToast} />
                    </main>

                    {/* Reservation Modal */}
                    <AnimatePresence>
                        {reservationOpen && (
                            <ReservationModal
                                onClose={() => setReservationOpen(false)}
                                showToast={showToast}
                            />
                        )}
                    </AnimatePresence>

                    {/* Toast Notification */}
                    <AnimatePresence>
                        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                    </AnimatePresence>
                </>
            )}
        </ReactLenis>
    );
}
