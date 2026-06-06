import React, { useState, useEffect, useRef } from 'react';
import { Utensils, Truck, Phone, Mail, Facebook, Instagram, Menu, X } from 'lucide-react';

import logoTeoCr from './assets/LOGO TEO (CR).png';
import img1 from './assets/IMAGENES TEO/1.png';
import img2 from './assets/IMAGENES TEO/2.png';
import img3 from './assets/IMAGENES TEO/3.png';
import img4 from './assets/IMAGENES TEO/4.png';
const dishImagesGlob = import.meta.glob('./assets/FOTOS PLATILLOS/*.{png,jpg,jpeg}', { eager: true });

const getDishImage = (dishName) => {
  const normalizedName = dishName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  for (const path in dishImagesGlob) {
    const filename = path.split('/').pop().replace(/\.(png|jpg|jpeg)$/i, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    // Comprobamos si coinciden exactamente o si una cadena incluye a la otra (para errores de ortografía menores como 'molcagete' vs 'molcajete')
    if (filename === normalizedName || filename.includes(normalizedName) || normalizedName.includes(filename)) {
      return dishImagesGlob[path].default;
    }
  }
  return null;
};

const MenuDigital = () => {
  const [activeCategory, setActiveCategory] = useState('Botanas');
  const categoryRefs = useRef({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [resName, setResName] = useState('');
  const [resBranch, setResBranch] = useState('Centro');
  const [resDay, setResDay] = useState('');
  const [resTime, setResTime] = useState('');

  // Get local today string YYYY-MM-DD
  const todayStr = React.useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Format date to friendly Spanish string
  const formatResDay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString('es-ES', options);
  };

  // Generate available times depending on selected day of the week
  const availableTimes = React.useMemo(() => {
    if (!resDay) return [];
    
    const list = [];
    for (let h = 2; h <= 7; h++) {
      list.push(`${h}:00 PM`, `${h}:30 PM`);
    }
    list.push("8:00 PM");

    return list;
  }, [resDay]);

  // Keep resTime in sync when date changes
  useEffect(() => {
    if (availableTimes.length > 0) {
      if (!availableTimes.includes(resTime)) {
        setResTime(availableTimes[0]);
      }
    } else {
      setResTime('');
    }
  }, [availableTimes, resTime]);

  const handleSendReservation = (e) => {
    e.preventDefault();
    const formattedDay = formatResDay(resDay);
    const text = `Hola, me gustaría hacer una reservación:\n` +
      `Nombre: ${resName}\n` +
      `Sucursal: ${resBranch}\n` +
      `Día: ${formattedDay}\n` +
      `Horario: ${resTime}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/526145304495?text=${encodedText}`, '_blank');
    setReservationOpen(false);
    setResName('');
    setResDay('');
    setResTime('');
  };

  const carouselImages = [img1, img2, img3, img4];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, carouselImages.length]);

  const categories = [
    "Botanas", "Pa La Bola", "Pal Come Solo", "Comida Corrida", "Postres", "Cervezas", "Coctelería", "Sin Alcohol", "Shots", "Servicios", "Destilados y Licores"
  ];

  const menuData = {
    "Botanas": [
      { name: "Cacahuates Preparados", price: "$75.00", desc: "50 gr. Salados o enchilados, limón, salsa negra de la casa, valentina, clamato." },
      { name: "Cacahuates", price: "$55.00", desc: "50 gr. Salados o enchilados." },
      { name: "Chicharrones", price: "$99.00", desc: "100 gr. Limón, salsa negra de la casa, valentina, y tajín." },
      { name: "Papas Caseras", price: "$105.00", desc: "100 gr. Limón, salsa negra de la casa, valentina y tajín." },
      { name: "Carne Seca", price: "$119.00", desc: "65 gr. Limón, salsas negra de la casa, valentina y clamato." },
      { name: "Aceitunas Preparadas", price: "$99.00", desc: "45 gr. Sin hueso, limón, salsa de la casa, valentina, clamato." }
    ],
    "Pa La Bola": [
      { name: "Queso Fundido", price: "$165.00", desc: "200 g de queso Chihuahua. Extra: camarón, chistorra, champiñones por $40." },
      { name: "Nacho Teofilitos", price: "$165.00", desc: "Totopos con queso cheddar, cotija, frijoles en grano y chile curtido." },
      { name: "Molcajete de Chicharrones", price: "$290.00", desc: "200 gr de papada de cerdo y 200 gr de res." },
      { name: "Guacamole", price: "$165.00", desc: "180 gr. Con pico de gallo, acompañado de totopos." },
      { name: "Frijoles Puercos", price: "$119.00", desc: "Como los de tu mamá, con totopos y tortilla de harina." },
      { name: "Esquite", price: "$120.00", desc: "Cazuela de elote con mantequilla, chile picoso, queso, crema y tuétano." }
    ],
    "Pal Come Solo": [
      { name: "Skillet de Tripitas", price: "$289.00", desc: "350 gr de tripitas con tortillas, cebolla curtida y cilantro." },
      { name: "Tacos de Papa", price: "$135.00", desc: "4 piezas. Tacos dorados de papa con lechuga, tomate y crema." },
      { name: "Burrito 'H'", price: "$170.00", desc: "180 gr de carne deshebrada, lechuga, tomate, y chiles toreados." },
      { name: "Tacos de Hueso", price: "$199.00", desc: "3 piezas. Montados sobre una cecina de picaña." },
      { name: "Tacos de Picaña", price: "$190.00", desc: "3 piezas. Picaña asada con el sazón Teofilitos." },
      { name: "Tacos Ramos", price: "$180.00", desc: "3 piezas. Crujiente papada de cerdo en una cama de guacamole." },
      { name: "Aguachile de Picaña", price: "$249.00", desc: "200 gr de láminas de picaña, bañadas en salsa negra y cebolla morada." },
      { name: "Hamburguesa Mermelada", price: "$199.00", desc: "200 gr de carne, queso cheddar, verdura, papas francesas." },
      { name: "Quesadilla de Machaca", price: "$155.00", desc: "En tortilla de maíz o harina, y guacamole." },
      { name: "Alitas", price: "$190.00", desc: "Deliciosas alitas con la receta de Teofilitos." },
      { name: "Tacos California", price: "$190.00", desc: "3 piezas. Camarón capeado, ensalada de col y aderezo chipotle." },
      { name: "Aguachile de Camarón", price: "$180.00", desc: "280 gr rojo o negro. Pídelo cocido, crudo o mixto." },
      { name: "Tacos Chicharrón Picaña", price: "$185.00", desc: "3 piezas. 300 gr, cama de aguacate, pico de gallo y cilantro." },
      { name: "Caldito de Res", price: "$135.00", desc: "Tradicional caldito reconfortante." },
      { name: "Skillet de Carne Asada", price: "$249.00", desc: "280 gr de carne asada, salchicha, frijoles puercos, toreados y quesadilla." },
      { name: "Elote Chorreado", price: "$135.00", desc: "Con aderezos de la casa, crema, mayonesa y tostitos." }
    ],
    "Comida Corrida": [
      { name: "Comida Corrida del Día", price: "$185.00", desc: "Entrada, plato fuerte, bebida y postre. Lunes a Jueves 1:00 pm - 5:00 pm." }
    ],
    "Postres": [
      { name: "Cookie de la Casa", price: "$165.00", desc: "Galleta chips de chocolate con nieve de vainilla." },
      { name: "Pan de Elote", price: "$119.00", desc: "Con nieve de vainilla." },
      { name: "Quesadillas Glorias", price: "$119.00", desc: "Deliciosas quesadillas dulces." }
    ],
    "Cervezas": [
      { name: "Cerveza Nacional", price: "$45.00", desc: "355 ml. Carta blanca, Tecate light/roja/0.0, Indio." },
      { name: "Cerveza Cuartitos", price: "$28.00", desc: "210 ml. Tecate light, XX, Indio." },
      { name: "XX Lager / XX Ambar", price: "$48.00 / $50.00", desc: "355 ml." },
      { name: "XX Ultra / Heineken", price: "$55.00", desc: "355 ml. (Amstel, Heineken 0.0, Silver)." },
      { name: "Miller High Life / Lite", price: "$56.00", desc: "355 ml." },
      { name: "Bohemia", price: "$55.00", desc: "355 ml. Clásica, Cristal, Oscura, Weizen." },
      { name: "Caguamón / Miller", price: "$119.00", desc: "1.2 L. (Miller $125.00)." }
    ],
    "Coctelería": [
      { name: "Sotolita", price: "$145.00", desc: "350 ml. Spicy pepino, fresa o mango." },
      { name: "Nixtarindo", price: "$120.00", desc: "Tequila reposado, licor de maíz, jugo cítrico." },
      { name: "Mojitos", price: "$145.00", desc: "350 ml. Tradicional, mango, fresa, blueberry, kiwi." },
      { name: "Teofilitos Beer", price: "$145.00", desc: "350 ml. Sangrita, salsa, refresco toronja, cerveza." },
      { name: "Tropicalísimo", price: "$120.00", desc: "Hypnotic, cítricos, refresco de lima." },
      { name: "Margarita", price: "$145.00", desc: "350 ml. Tradicional, fresa, mango." },
      { name: "Mezcalindas", price: "$120.00", desc: "Mezcal de la casa: mango, piña, jamaica, fresa, tamarindo." },
      { name: "Romerita", price: "$145.00", desc: "Sotol, jugo de piña, miel de agave, limón, romero." },
      { name: "Piña Colada", price: "$145.00", desc: "350 ml. Ron, jugo de piña, crema de coco." },
      { name: "Cantarito / Cantarindo", price: "$105.00", desc: "400 ml. Tequila o Sotol con cítricos. (Cantarindo $145.00)." },
      { name: "Isabel", price: "$145.00", desc: "350 ml. Mezcal, limón, jugo de piña, miel, chilaca." },
      { name: "Carajillo Clásico / Teofilito", price: "$145.00", desc: "300 ml. Opciones: Cremoso ($160), Teofilito ($180)." },
      { name: "Agua de Calzón", price: "$235.00", desc: "1 Lt. Toronja, fresa, limón, vodka." },
      { name: "La Chula", price: "$235.00", desc: "1 Lt. Mango, jugo de naranja, limón, vodka." },
      { name: "Mula Prieta", price: "$130.00", desc: "Jack Daniel's Honey, cítricos, café espresso." },
      { name: "Berry-co", price: "$120.00", desc: "Ginebra de la casa, berries, crema coco, hierbabuena." }
    ],
    "Sin Alcohol": [
      { name: "Michelado Clamato", price: "$55.00", desc: "200 ml. Tarro michelado con un chorrito de clamato." },
      { name: "Limonadas", price: "$49.00", desc: "400 ml. Natural, Mineral, de Mango o de Fresa." },
      { name: "Clamato Coqueto", price: "$88.00", desc: "400 ml. Limón, salsa, clamato, apio, y camarón." },
      { name: "Refresco", price: "$35.00", desc: "355 ml. Coca Cola, Sprite, Squirt, Agua mineral." },
      { name: "Café Expresso / Americano", price: "$44.00", desc: "88 ml / 295 ml." },
      { name: "Agua Natural", price: "$28.00", desc: "500 ml." },
      { name: "Chelado / Michelado", price: "$22.00", desc: "Mezcla preparada para tu bebida." }
    ],
    "Shots": [
      { name: "Baby Mango / Perla Negra", price: "$120.00", desc: "Tequila o Jägermeister." },
      { name: "Bufanda Azul / Rosa", price: "$120.00", desc: "Boost, Hypnotic / Hypnotic rosa." },
      { name: "Tumbaburros", price: "$105.00", desc: "Whiskey bourbon, licor de durazno, strongbow." },
      { name: "Revolver", price: "$130.00", desc: "1 oz. Tequila, licor de fruta." },
      { name: "ABC", price: "$145.00", desc: "1 oz. Amaretto, Baileys, Cognac." }
    ],
    "Servicios": [
      { name: "Red Bull / Boost", price: "$130.00", desc: "250 ml / 235 ml." },
      { name: "Servicio 5 Refrescos", price: "$165.00", desc: "355 ml c/u. Coca Cola, Sprite, Squirt, Agua mineral." }
    ],
    "Destilados y Licores": [
      { name: "Sotoles (Plata / Oro / Crema)", price: "$95.00 - $115.00", desc: "Copa 1.5 oz. Disponibles en Litro y Botella." },
      { name: "Tequila Maestro Dobel / 1800", price: "$120.00", desc: "Copa 1.5 oz. Litro: $240 | Botella: $1,900" },
      { name: "Tequila Don Julio 70", price: "$130.00", desc: "Copa 1.5 oz. Litro: $260 | Botella: $2,100" },
      { name: "Whisky Buchanan's 12 / Black Label", price: "$115.00", desc: "Copa 1.5 oz. Litro: $230 | Botella: $1,850" },
      { name: "Whisky Macallan 12", price: "$209.00", desc: "Copa 1.5 oz. Litro: $418 | Botella: $3,369" },
      { name: "Mezcal 400 Conejos / Creyente", price: "$99.00 - $125.00", desc: "Copa 1.5 oz. Disponibles en Litro y Botella." },
      { name: "Ginebra Hendricks", price: "$170.00", desc: "Copa 1.5 oz. Litro: $340 | Botella: $2,200" },
      { name: "Vodka Grey Goose", price: "$110.00", desc: "Copa 1.5 oz. Litro: $220 | Botella: $1,750" },
      { name: "Ron Zacapa 23", price: "$170.00", desc: "Copa 1.5 oz. Litro: $340 | Botella: $2,750" },
      { name: "Cognac Rémy Martin / Hennesy", price: "$160.00", desc: "Copa 1.5 oz. Disponibles en Litro y Botella." },
      { name: "Digestivo Jägermeister / Licor 43", price: "$95.00", desc: "Copa 1.5 oz. Litro: $190 | Botella: $1,450" },
      { name: "Brandy Torres 10 / Azteca", price: "$65.00", desc: "Copa 1.5 oz. Disponibles en Litro y Botella." }
    ]
  };

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    const element = categoryRefs.current[cat];
    if (element) {
      const yOffset = -120; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const category of categories) {
        const element = categoryRefs.current[category];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.pageYOffset;
          const elementBottom = bottom + window.pageYOffset;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveCategory(category);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  return (
    <div className="font-sans text-[#2b1d14] min-h-screen" style={{
      backgroundColor: '#d8c3a5',
      backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")',
    }}>
      {/* Estilos tipográficos inyectados */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Rye&family=Great+Vibes&display=swap');
          
          .font-rye { font-family: 'Rye', serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-courier { font-family: 'Courier Prime', monospace; }
          .font-script { font-family: 'Great Vibes', cursive; }
          
          /* Ocultar barra de desplazamiento en el menú navegable */
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

          /* Estilos personalizados para el formulario de reservaciones */
          .teo-input {
            font-family: 'Courier Prime', monospace;
            background-color: #fcf9f2;
            border: 2px solid #2b1d14;
            color: #2b1d14;
            padding: 0.625rem 0.75rem;
            border-radius: 2px;
            font-size: 0.875rem;
            width: 100%;
            transition: all 0.2s ease;
          }
          .teo-input:focus {
            outline: none;
            border-color: #a68a6d;
            box-shadow: 0 0 0 2px rgba(166, 138, 109, 0.3);
          }
          .teo-input::placeholder {
            color: #a68a6d;
            opacity: 0.7;
          }
          .teo-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Date picker personalizado */
          input[type="date"].teo-input {
            appearance: none;
            -webkit-appearance: none;
            position: relative;
            cursor: pointer;
          }
          input[type="date"].teo-input::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            filter: invert(10%) sepia(40%) saturate(600%) hue-rotate(350deg);
            transition: opacity 0.2s ease;
          }
          input[type="date"].teo-input::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
          }

          /* Select personalizado */
          select.teo-input {
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232b1d14' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            padding-right: 2.5rem;
            cursor: pointer;
          }
        `}
      </style>

      {/* WRAPPER STICKY PARA HEADER Y NAVEGACIÓN */}
      <div className="sticky top-0 z-50 w-full flex flex-col shadow-lg">
        {/* ENCABEZADO VINTAGE (Estilo Imagen) */}
        <header className="bg-[#2b1d14] text-[#d8c3a5] w-full border-b-4 border-[#1a110c] py-2 px-6 flex flex-col md:flex-row items-center justify-center min-h-[64px] md:min-h-[80px] relative z-20">
        {/* Logo de Teofilitos */}
        <div 
          className="md:absolute md:left-6 flex items-center cursor-pointer select-none mb-1 md:mb-0"
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src={logoTeoCr}
            alt="Logo Teofilitos"
            className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-all duration-300"
          />
        </div>

        {/* Texto de Cantina & Cocina Centrado en el header */}
        <div className="flex items-center justify-center text-center md:absolute md:left-1/2 md:-translate-x-1/2 max-w-[70%] md:max-w-[50%] mt-1 md:mt-0">
          <span className="font-playfair text-[9px] sm:text-xs md:text-sm lg:text-base font-bold tracking-widest uppercase text-[#a68a6d] leading-tight block">
            Cantina & Cocina Tradicional Mexicana
          </span>
        </div>

        {/* Botón de Reservaciones en el extremo derecho */}
        <button
          onClick={() => setReservationOpen(true)}
          className="absolute right-2 sm:right-4 md:right-6 border border-[#a68a6d] text-[#a68a6d] hover:bg-[#a68a6d] hover:text-[#2b1d14] px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-1.5 text-[8px] sm:text-[10px] md:text-xs font-playfair font-bold uppercase tracking-wide transition-colors duration-300 rounded-sm cursor-pointer z-50"
        >
          Reservaciones
        </button>
      </header>

      {/* MODAL DE RESERVACIONES */}
      {reservationOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#d8c3a5] border-4 border-[#2b1d14] rounded-md shadow-2xl max-w-md w-full p-6 text-[#2b1d14] relative animate-fade-in">
            {/* Botón de cerrar */}
            <button
              onClick={() => setReservationOpen(false)}
              className="absolute right-4 top-4 text-[#2b1d14] hover:text-[#a68a6d] transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            <h3 className="font-rye text-3xl uppercase tracking-wider mb-6 text-center border-b-2 border-[#2b1d14] pb-2">
              Reservar
            </h3>

            <form onSubmit={handleSendReservation} className="space-y-4">
              <div>
                <label className="block font-playfair font-bold text-sm uppercase mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="teo-input"
                />
              </div>

              <div>
                <label className="block font-playfair font-bold text-sm uppercase mb-1">Sucursal</label>
                <select
                  value={resBranch}
                  onChange={(e) => setResBranch(e.target.value)}
                  className="teo-input"
                >
                  <option value="Centro">Sucursal Centro</option>
                  <option value="Cantera">Sucursal Cantera</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-playfair font-bold text-sm uppercase mb-1">Día</label>
                  <input
                    type="date"
                    required
                    value={resDay}
                    onChange={(e) => setResDay(e.target.value)}
                    min={todayStr}
                    className="teo-input"
                  />
                </div>
                <div>
                  <label className="block font-playfair font-bold text-sm uppercase mb-1">Horario</label>
                  <select
                    value={resTime}
                    onChange={(e) => setResTime(e.target.value)}
                    required
                    disabled={!resDay}
                    className="teo-input"
                  >
                    {!resDay ? (
                      <option value="">Elige día</option>
                    ) : (
                      availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReservationOpen(false)}
                  className="w-1/2 border-2 border-[#2b1d14] py-2.5 font-playfair font-bold text-sm uppercase hover:bg-[#2b1d14] hover:text-[#d8c3a5] transition-colors rounded-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#2b1d14] text-[#d8c3a5] py-2.5 font-playfair font-bold text-sm uppercase hover:bg-[#3b271d] transition-colors rounded-sm cursor-pointer"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MENÚ NAVEGABLE STICKY (Estilo Humo Bar Culinario) */}
      <nav className="border-b-2 border-[#2b1d14] relative z-10" style={{
        backgroundColor: '#d8c3a5',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")',
      }}>
        <div className="max-w-5xl mx-auto px-2 overflow-x-auto no-scrollbar">
          <ul className="flex items-end">
            {categories.map((cat) => (
              <li key={cat} className="flex-shrink-0">
                <button
                  onClick={() => scrollToCategory(cat)}
                  className={`font-albertson text-sm md:text-base px-5 py-3 md:py-4 transition-all duration-300 uppercase tracking-wider whitespace-nowrap rounded-t-md border-r border-[#2b1d14]/10 last:border-r-0
                    ${activeCategory === cat
                      ? 'bg-[#3b271d] text-[#d8c3a5]'
                      : 'text-[#3b271d] hover:bg-[#3b271d]/10'}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      </div>

      {/* CARRUSEL AUTOMÁTICO DE IMÁGENES */}
      <div
        className="w-full relative overflow-hidden bg-[#2b1d14] h-[240px] sm:h-[380px] md:h-[480px] lg:h-[550px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative overflow-hidden h-full group">
          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((img, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={img}
                  alt={`Teofilitos slide ${index + 1}`}
                  className="w-full h-full object-cover select-none"
                />
                {/* Subtle dark gradient overlay at the bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Indicadores (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer
                  ${currentSlide === index ? 'bg-[#d8c3a5] scale-125' : 'bg-[#d8c3a5]/50 hover:bg-[#d8c3a5]/80'}`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CONTENIDO DEL MENÚ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {categories.map((category) => (
          <div
            key={category}
            ref={(el) => categoryRefs.current[category] = el}
            className="mb-16 pt-4 scroll-mt-32"
          >
            {/* Título de la Categoría */}
            <div className="mb-8 text-center relative">
              <h2 className="font-albertson text-4xl md:text-5xl inline-block bg-[#3b271d] text-[#d8c3a5] px-8 py-2 uppercase tracking-wider relative z-10">
                {category}
              </h2>
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#3b271d] -z-0"></div>
            </div>

            {/* Lista de Platillos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {menuData[category].map((item, index) => (
                <div key={index} className="flex flex-col h-full">
                  
                  {/* Foto del platillo si existe en la carpeta FOTOS PLATILLOS */}
                  {(() => {
                    const dishImg = getDishImage(item.name);
                    return dishImg ? (
                      <div className="w-full mb-4 rounded-sm border-2 border-[#2b1d14] overflow-hidden bg-[#2b1d14] shadow-sm">
                        <img src={dishImg} alt={item.name} className="w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : null;
                  })()}

                  <div className="flex flex-col md:flex-row gap-4 group flex-grow">
                    {/* Si el platillo tiene imagen (Estilo destacado) */}
                    {item.img && (
                      <div className="w-full md:w-48 h-32 md:h-full bg-[#3b271d] rounded-sm flex items-center justify-center p-2 border-2 border-[#2b1d14] flex-shrink-0">
                        <div className="w-full h-full border border-dashed border-[#d8c3a5] flex items-center justify-center text-center p-2">
                          <span className="font-courier text-[#d8c3a5] text-xs leading-tight">
                            {item.img}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Detalles del Platillo */}
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-baseline border-b-2 border-dotted border-[#2b1d14] pb-1 mb-2">
                        <h3 className="font-playfair font-bold text-xl md:text-2xl uppercase tracking-wide text-[#2b1d14]">
                          {item.name}
                        </h3>
                        <span className="font-courier font-bold text-lg md:text-xl whitespace-nowrap ml-4 text-[#2b1d14]">
                          {item.price}
                        </span>
                      </div>
                      <p className="font-sans text-sm md:text-base leading-relaxed text-[#4a3627]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

        {/* Sección Especial Estilo "FRESH Water" de la imagen */}
        <div className="mt-12 bg-[#3b271d] text-[#d8c3a5] p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-center border-4 border-[#1a110c]">
          <div className="absolute opacity-10 font-rye text-[120px] -top-10 -left-10 tracking-widest pointer-events-none">
            DRINKS
          </div>
          <h2 className="font-rye text-5xl md:text-7xl z-10 relative">
            BEBIDAS
          </h2>
          <div className="mt-6 md:mt-0 z-10 text-right">
            <p className="font-courier text-lg">Consulta por nuestra</p>
            <p className="font-playfair font-bold text-2xl uppercase">Coctelería de Autor</p>
          </div>
        </div>
      </main>

      {/* NUEVO PIE DE PÁGINA (Estilo Bloque Sólido 4 Columnas) */}
      <footer className="bg-[#2b1d14] text-[#d8c3a5] mt-16 py-16 px-6 w-full border-t-[8px] border-[#1a110c]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Columna 1: Marca y Teléfono */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <img src={logoTeoCr} alt="Logo Teofilitos" className="h-24 md:h-28 w-auto object-contain mb-4" />
            </div>
            <div className="mt-12 lg:mt-auto">
              <p className="font-rye text-xl uppercase tracking-widest text-[#a68a6d]">Llámanos</p>
              <p className="font-courier text-3xl font-bold mt-2 text-[#d8c3a5]">614 530 4495</p>
            </div>
          </div>

          {/* Columna 2: Horarios */}
          <div>
            <h3 className="font-rye text-2xl uppercase tracking-widest mb-6 text-[#d8c3a5]">Horario</h3>
            <ul className="font-courier text-sm md:text-base space-y-3 text-[#d8c3a5]">
              <li className="flex justify-between w-full max-w-[260px]">
                <span className="text-[#a68a6d]">LUNES</span> <span>12 pm - 12 am</span>
              </li>
              <li className="flex justify-between w-full max-w-[260px]">
                <span className="text-[#a68a6d]">MARTES</span> <span>12 pm - 12 am</span>
              </li>
              <li className="flex justify-between w-full max-w-[260px]">
                <span className="text-[#a68a6d]">MIÉRCOLES</span> <span>12 pm - 2 am</span>
              </li>
              <li className="flex justify-between w-full max-w-[260px]">
                <span className="text-[#a68a6d]">JUEVES</span> <span>12 pm - 2 am</span>
              </li>
              <li className="flex justify-between w-full max-w-[260px]">
                <span className="text-[#a68a6d]">VIERNES</span> <span>12 pm - 2 am</span>
              </li>
              <li className="flex justify-between w-full max-w-[260px]">
                <span className="text-[#a68a6d]">SÁBADO</span> <span>12 pm - 2 am</span>
              </li>
              <li className="flex justify-between w-full max-w-[260px]">
                <span className="text-[#a68a6d]">DOMINGO</span> <span>12 pm - 12 am</span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Direcciones */}
          <div className="text-left lg:text-center flex flex-col items-start lg:items-center justify-start lg:justify-center relative">
            {/* Elemento decorativo de fondo (Asemejando la figura abstracta de la imagen) */}
            <div className="hidden lg:flex absolute opacity-[0.03] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Utensils size={240} />
            </div>

            <div className="mb-10 z-10 relative w-full">
              <p className="font-playfair font-bold text-sm tracking-[0.2em] uppercase mb-2 text-[#a68a6d]">Sucursal Centro</p>
              <p className="font-courier text-sm uppercase lg:max-w-[260px] lg:mx-auto leading-relaxed">
                Blvd. Gustavo Díaz Ordaz 101,<br />Chihuahua
              </p>
            </div>
            <div className="z-10 relative w-full">
              <p className="font-playfair font-bold text-sm tracking-[0.2em] uppercase mb-2 text-[#a68a6d]">Sucursal Cantera</p>
              <p className="font-courier text-sm uppercase lg:max-w-[260px] lg:mx-auto leading-relaxed">
                Av. La Cantera 5900, Plaza Rayuela,<br />Chihuahua
              </p>
            </div>
          </div>

          {/* Columna 4: Redes y Botones */}
          <div className="flex flex-col items-start lg:items-end justify-between h-full">
            <div className="flex space-x-6 mb-12 lg:mb-0">
              <a href="https://www.facebook.com/Teofilitoscuu/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="text-[#d8c3a5] hover:text-[#a68a6d] transition-colors">
                <Facebook size={28} strokeWidth={1.5} />
              </a>
              <a href="https://www.instagram.com/teofilitos_cantina?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-[#d8c3a5] hover:text-[#a68a6d] transition-colors">
                <Instagram size={28} strokeWidth={1.5} />
              </a>
              <a href="tel:+526145304495" className="text-[#d8c3a5] hover:text-[#a68a6d] transition-colors">
                <Phone size={28} strokeWidth={1.5} />
              </a>
            </div>

            <div className="flex flex-col w-full lg:max-w-[220px] space-y-4">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full border border-[#d8c3a5] rounded-[4px] py-3 font-rye text-xl uppercase tracking-wider hover:bg-[#d8c3a5] hover:text-[#2b1d14] transition-colors">
                Menú
              </button>
              <button onClick={() => setReservationOpen(true)} className="w-full border border-[#d8c3a5] rounded-[4px] py-3 font-rye text-xl uppercase tracking-wider hover:bg-[#d8c3a5] hover:text-[#2b1d14] transition-colors">
                Reservaciones
              </button>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default MenuDigital;
