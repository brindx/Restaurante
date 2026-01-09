'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    Users,
    Check,
    X,
    Search,
    ChevronDown,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

/* ==================== TOAST NOTIFICATION ==================== */
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="fixed top-6 right-6 z-[200] bg-white shadow-lg rounded-lg px-5 py-3 flex items-center gap-3 min-w-[300px] border border-gray-100"
    >
        <div className={`w-1.5 h-1.5 rounded-full ${type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                    'bg-[#d4af37]'
            }`} />
        <p className="text-gray-900 text-sm flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
        </button>
    </motion.div>
);

/* ==================== STATS CARD ==================== */
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
                <Icon size={18} className="text-white" strokeWidth={2} />
            </div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-1">{value}</h3>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
);

/* ==================== RESERVATION CARD ==================== */
const ReservationCard = ({ reservation, onAccept, onReject }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'accepted':
                return {
                    color: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700',
                    dotColor: 'bg-green-500',
                    text: 'Aceptada',
                };
            case 'rejected':
                return {
                    color: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700',
                    dotColor: 'bg-red-500',
                    text: 'Rechazada',
                };
            default:
                return {
                    color: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700',
                    dotColor: 'bg-yellow-500',
                    text: 'Pendiente',
                };
        }
    };

    const statusConfig = getStatusConfig(reservation.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`bg-white rounded-lg border ${statusConfig.borderColor} shadow-sm overflow-hidden`}
        >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">{reservation.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs ${statusConfig.textColor} font-medium`}>
                                    {statusConfig.text}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-400 font-mono">#{reservation.id.slice(-6)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ChevronDown
                            size={18}
                            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Quick Info */}
            <div className="px-5 py-4 grid grid-cols-3 gap-4">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Calendar size={14} className="text-gray-400" />
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">
                        {new Date(reservation.date).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Clock size={14} className="text-gray-400" />
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Hora</p>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{reservation.time}</p>
                </div>

                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Users size={14} className="text-gray-400" />
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Personas</p>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{reservation.guests}</p>
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 space-y-3">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Mail size={14} className="text-gray-400" />
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                    </div>
                                    <p className="text-sm text-gray-700">{reservation.email}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Phone size={14} className="text-gray-400" />
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</p>
                                    </div>
                                    <p className="text-sm text-gray-700">{reservation.phone}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Recibida</p>
                                <p className="text-sm text-gray-700">
                                    {new Date(reservation.createdAt).toLocaleDateString('es-MX', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions */}
            {reservation.status === 'pending' && (
                <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={() => onAccept(reservation.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Check size={16} strokeWidth={2.5} />
                        Aceptar
                    </button>
                    <button
                        onClick={() => onReject(reservation.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <X size={16} strokeWidth={2.5} />
                        Rechazar
                    </button>
                </div>
            )}
        </motion.div>
    );
};

/* ==================== MAIN DASHBOARD ==================== */
export default function AdminReservations() {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Load reservations from localStorage
    useEffect(() => {
        const loadReservations = () => {
            const stored = localStorage.getItem('lit-reservations');
            if (stored) {
                const parsed = JSON.parse(stored);
                setReservations(parsed);
                setFilteredReservations(parsed);
            }
        };

        loadReservations();
        const interval = setInterval(loadReservations, 5000);
        return () => clearInterval(interval);
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...reservations];

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(r => r.status === selectedFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.phone.includes(searchTerm)
            );
        }

        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFilteredReservations(filtered);
    }, [reservations, selectedFilter, searchTerm]);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleAccept = (id) => {
        const updated = reservations.map(r =>
            r.id === id ? { ...r, status: 'accepted' } : r
        );
        setReservations(updated);
        localStorage.setItem('lit-reservations', JSON.stringify(updated));
        showToast('Reservación aceptada exitosamente', 'success');
    };

    const handleReject = (id) => {
        const updated = reservations.map(r =>
            r.id === id ? { ...r, status: 'rejected' } : r
        );
        setReservations(updated);
        localStorage.setItem('lit-reservations', JSON.stringify(updated));
        showToast('Reservación rechazada', 'error');
    };

    const stats = {
        total: reservations.length,
        pending: reservations.filter(r => r.status === 'pending').length,
        accepted: reservations.filter(r => r.status === 'accepted').length,
        rejected: reservations.filter(r => r.status === 'rejected').length,
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                            >
                                <ArrowLeft size={18} className="text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900 mb-0.5">
                                    Panel de Administración
                                </h1>
                                <p className="text-sm text-gray-500">Gestión de Reservaciones · Restaurante LIT</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg px-4 py-2.5 border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Hora Actual</p>
                            <p className="text-base font-semibold text-gray-900 font-mono">
                                {currentTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <StatCard
                            icon={Calendar}
                            label="Total"
                            value={stats.total}
                            color="bg-gray-700"
                        />
                        <StatCard
                            icon={Clock}
                            label="Pendientes"
                            value={stats.pending}
                            color="bg-yellow-500"
                        />
                        <StatCard
                            icon={Check}
                            label="Aceptadas"
                            value={stats.accepted}
                            color="bg-green-500"
                        />
                        <StatCard
                            icon={X}
                            label="Rechazadas"
                            value={stats.rejected}
                            color="bg-red-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, email o teléfono..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#d4af37] focus:bg-white transition-all text-sm text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            {/* Status Filters */}
                            <div className="flex gap-2">
                                {[
                                    { value: 'all', label: 'Todas' },
                                    { value: 'pending', label: 'Pendientes' },
                                    { value: 'accepted', label: 'Aceptadas' },
                                    { value: 'rejected', label: 'Rechazadas' }
                                ].map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setSelectedFilter(filter.value)}
                                        className={`px-4 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wide transition-all ${selectedFilter === filter.value
                                                ? 'bg-[#d4af37] text-white shadow-sm'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        {filteredReservations.length} reservación{filteredReservations.length !== 1 ? 'es' : ''} encontrada{filteredReservations.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Reservations List */}
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredReservations.length > 0 ? (
                            filteredReservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.id}
                                    reservation={reservation}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-lg p-12 text-center border border-gray-200 shadow-sm"
                            >
                                <Calendar size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No hay reservaciones
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {searchTerm || selectedFilter !== 'all'
                                        ? 'No se encontraron reservaciones con los filtros aplicados'
                                        : 'Aún no se han registrado reservaciones'}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </main>
    );
}
