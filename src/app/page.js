'use client';

import { useEffect, useRef, useState } from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { motion, useScroll, useTransform, useSpring, motionValue } from 'framer-motion';
import { ArrowDown, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';

/* --------------------------------------------------------------------------------
   COMPONENTS
-------------------------------------------------------------------------------- */

const Header = () => (
    <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-start mix-blend-exclusion text-white">
        <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest uppercase">Restaurante</span>
            <span className="text-3xl font-display font-black leading-none">LIT.</span>
        </div>
        <div className="flex gap-2">
            <span className="text-xs uppercase tracking-widest border border-white/30 rounded-full px-3 py-1">CDMX</span>
            <span className="text-xs uppercase tracking-widest border border-white/30 rounded-full px-3 py-1">Est. 2024</span>
        </div>
        <button className="hidden md:block uppercase text-xs font-bold tracking-widest hover:underline">
            Menu
        </button>
    </header>
);

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 500]);
    const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);

    return (
        <section className="h-screen relative overflow-hidden flex items-center justify-center bg-[#f4f1ea] text-[#1a1a1a]">
            <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/10 z-10 transition-opacity duration-1000"></div>
                <Image
                    src="https://images.unsplash.com/photo-1550966871-3ed3c47e7188?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero"
                    fill
                    className="object-cover"
                    priority
                />
            </motion.div>

            <div className="relative z-20 text-center mix-blend-difference text-[#f4f1ea]">
                <div className="overflow-hidden mb-4">
                    <motion.p
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xs md:text-sm uppercase tracking-[0.3em] font-medium"
                    >
                        Cocina de Autor
                    </motion.p>
                </div>
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="text-display-huge font-display uppercase font-black"
                    >
                        LIT
                    </motion.h1>
                </div>
                <div className="overflow-hidden mt-4">
                    <motion.p
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl font-light italic opacity-80"
                    >
                        "El fuego es nuestro único ingrediente secreto"
                    </motion.p>
                </div>
            </div>

            <div className="absolute bottom-12 right-12 z-20 text-white mix-blend-difference flex items-center gap-4 animate-bounce">
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <ArrowDown size={14} />
            </div>
        </section>
    );
};

const Marquee = () => (
    <div className="py-12 bg-[#cd3131] overflow-hidden whitespace-nowrap text-[#f4f1ea]">
        <motion.div
            className="flex gap-12"
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
            {[...Array(10)].map((_, i) => (
                <span key={i} className="text-6xl md:text-8xl font-display uppercase italic">
                    Fuego &middot; Pasión &middot; Sabor &middot;
                </span>
            ))}
        </motion.div>
    </div>
);

const Introduction = () => (
    <section className="py-32 px-4 md:px-12 bg-[#f4f1ea] text-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-display leading-tight mb-12">
                No somos un restaurante. <br />
                <span className="text-[#cd3131] italic">Somos un ritual.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-lg font-light leading-relaxed text-[#666]">
                <p>
                    LIT nace de la necesidad de volver al origen. En un mundo saturado de artificios,
                    elegimos la honestidad del fuego vivo. Cada plato es un diálogo entre el ingrediente
                    y la brasa.
                </p>
                <p>
                    Ubicados en el corazón de Polanco, ofrecemos un refugio para los puristas.
                    Aquí, el tiempo se detiene y los sentidos toman el control.
                </p>
            </div>
        </div>
    </section>
);

const DishGallery = () => {
    // Horizontal scroll section usually requires more setup, simplified here as a refined grid for stability
    const dishes = [
        { name: "Wagyu A5", price: "$120", img: "https://images.unsplash.com/photo-1544025162-d76694265947" },
        { name: "King Crab", price: "$95", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" },
        { name: "Truffle Pasta", price: "$65", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601" }
    ];

    return (
        <section className="py-20 bg-[#1a1a1a] text-[#f4f1ea]">
            <div className="container-fluid mb-16 flex justify-between items-end px-4">
                <h3 className="text-5xl md:text-7xl font-display uppercase opacity-50">Menú</h3>
                <span className="text-xs uppercase tracking-widest border-b border-[#cd3131] pb-1">Ver Carta Completa</span>
            </div>

            <div className="px-4 grid md:grid-cols-3 gap-1">
                {dishes.map((dish, i) => (
                    <motion.div
                        key={i}
                        className="relative h-[60vh] group overflow-hidden bg-gray-900"
                        whileHover="hover"
                    >
                        <Image
                            src={dish.img}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            alt={dish.name}
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <motion.div
                                variants={{ hover: { y: 0, opacity: 1 } }}
                                initial={{ y: 20, opacity: 0 }} // Hidden by default, reveal on hover for clean look? Or visible? Let's make visible but subtle
                                animate={{ y: 0, opacity: 1 }}
                                className="transform transition-all"
                            >
                                <div className="flex justify-between items-baseline border-b border-white/20 pb-4 mb-4">
                                    <h4 className="text-3xl font-display">{dish.name}</h4>
                                    <span className="font-mono text-[#cd3131]">{dish.price}</span>
                                </div>
                                <p className="text-sm uppercase tracking-widest opacity-70">Signature Dish</p>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const Reservation = () => (
    <section className="h-screen flex items-center justify-center bg-[#cd3131] text-[#f4f1ea] relative overflow-hidden">
        <div className="text-center z-10 relative">
            <motion.h2
                className="text-[15vw] leading-[0.8] font-display font-black uppercase mb-8"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Book<br />Table
            </motion.h2>
            <button className="bg-[#f4f1ea] text-[#cd3131] px-12 py-6 rounded-full text-xl uppercase font-bold tracking-widest hover:scale-110 transition-transform duration-300 shadow-2xl">
                Reservar Ahora
            </button>
        </div>

        {/* Decorative big star */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        >
            <Star size={800} />
        </motion.div>
    </section>
);

const Footer = () => (
    <footer className="bg-[#1a1a1a] text-[#666] py-12 px-8 flex justify-between uppercase text-xs tracking-widest">
        <div>&copy; 2024 LIT. Group</div>
        <div className="flex gap-4">
            <a href="#" className="hover:text-white">Insta</a>
            <a href="#" className="hover:text-white">Face</a>
        </div>
    </footer>
);

export default function Home() {
    return (
        <ReactLenis root>
            <main>
                <Header />
                <Hero />
                <Marquee />
                <Introduction />
                <DishGallery />
                <Reservation />
                <Footer />
            </main>
        </ReactLenis>
    );
}
