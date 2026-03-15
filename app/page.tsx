"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Heart, 
  Church, 
  CheckCircle2, 
  Bus, 
  GlassWater, 
  UtensilsCrossed, 
  Moon 
} from "lucide-react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// Transición tipo spring para que se sienta más orgánico y premium
const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { ...springTransition, damping: 25 },
};

function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    // 1.2s para abrir la solapa, luego emerge la tarjeta
    setTimeout(() => {
      // La tarjeta termina de emerger después de ~1.5s (total 2.7s)
      setTimeout(() => {
        setIsRevealed(true);
        setTimeout(onOpen, 1000); // 1s de fade out final
      }, 3000); // Tiempo que la tarjeta se queda visible
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden"
    >
      <div className="relative w-full max-w-[340px] aspect-[4/3] perspective-2000">
        {/* Cuerpo del sobre (Trasero) */}
        <div className="absolute inset-0 bg-[#0a0a0a] shadow-2xl z-0" 
             style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }} />

        {/* Tarjeta de Papel Física (Revelación) */}
        <motion.div
          className="absolute inset-x-6 top-4 bottom-4 z-10 bg-[#fdfbf7] shadow-lg flex flex-col items-center justify-center text-center p-8 border-[0.5px] border-black/5"
          initial={{ y: 0, scale: 0.95 }}
          animate={isOpening ? { y: -180, scale: 1.05 } : {}}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
          style={{
            backgroundImage: "radial-gradient(#00000005 1px, transparent 0)",
            backgroundSize: "4px 4px",
          }}
        >
          {/* Borde Gofrado Sutil */}
          <div className="absolute inset-2 border border-black/10 pointer-events-none" />
          <div className="absolute inset-3 border-[0.5px] border-black/5 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={isOpening ? { opacity: 1 } : {}}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <h2 className="serif text-[14px] font-light tracking-[0.3em] uppercase text-black mb-6">
              Sara Reyes Aranda
              <span className="block my-2 text-black/30 italic font-serif lowercase tracking-normal">&</span>
              Adrián Santiago Jaime
            </h2>
            
            <div className="w-8 h-px bg-black/20 mx-auto mb-6" />
            
            <p className="serif text-[10px] tracking-[0.4em] uppercase text-black/60 mb-8 font-light italic">
              Os invitan a su boda
            </p>

            <p className="serif text-[11px] tracking-[0.2em] uppercase text-black font-medium">
              Sevilla
              <span className="mx-3 text-black/20">|</span>
              04 / 07 / 2026
            </p>
          </motion.div>
        </motion.div>

        {/* Cuerpo del sobre (Delantero/Laterales) */}
        <div 
          className="absolute inset-0 bg-[#141414] z-20"
          style={{ clipPath: "polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)" }}
        />

        {/* Solapa superior */}
        <motion.div
          className="absolute inset-0 bg-[#1a1a1a] z-30 origin-top shadow-xl"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%)" }}
          animate={isOpening ? { rotateX: -160, zIndex: 5 } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Sello / Monograma */}
        <AnimatePresence>
          {!isOpening && (
            <motion.div
              key="seal"
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleOpen}
            >
              <div className="relative h-20 w-20 rounded-full bg-white p-1 shadow-2xl flex items-center justify-center border border-black/5 overflow-hidden">
                <Image 
                  src="/image_3.png" 
                  alt="Sello A&S" 
                  fill 
                  className="object-contain p-2"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  const targetDate = useMemo(() => new Date("2026-07-04T18:30:00"), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    
    // Forzar visibilidad tras 1 segundo por seguridad
    const forceTimer = setTimeout(() => setForceShow(true), 1000);

    const tick = () => {
      const now = new Date();
      const diff = Math.max(targetDate.getTime() - now.getTime(), 0);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => {
      clearInterval(timer);
      clearTimeout(forceTimer);
    };
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <motion.div
      className="mt-16 grid grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={forceShow ? { opacity: 1, y: 0 } : {}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ staggerChildren: 0.1, duration: 0.8 }}
    >
      {[
        { label: "Días", value: timeLeft.days },
        { label: "Horas", value: timeLeft.hours },
        { label: "Minutos", value: timeLeft.minutes },
        { label: "Segundos", value: timeLeft.seconds },
      ].map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={forceShow ? { opacity: 1, y: 0 } : {}}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center bg-transparent border-x border-black/5"
        >
          <span className="serif text-4xl font-light text-black tracking-tighter">
            {item.value.toString().padStart(2, "0")}
          </span>
          <span className="mt-2 text-[7px] tracking-[0.4em] text-black/40 uppercase font-medium">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function RSVPForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    nombre: "",
    asistencia: "si",
    bus: "no",
    alergias: "",
    mensaje: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzP-5iFFVvdmgzj-HVYQYOWrwcIV7-5DOUMRGkrKoJgup_Ag-SpPHyl1dzkTvK59-LH/exec", {
        method: "POST",
        mode: "no-cors", // Necesario para Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      setStatus("success");
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-center py-12 px-6"
      >
        <p className="serif text-lg text-black leading-relaxed tracking-wide">
          ¡Gracias! Tu respuesta ha sido recibida.<br/>
          <span className="text-black/40 text-sm mt-4 block">Tenemos muchas ganas de compartir este día con vosotros.</span>
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 mt-12 mb-16 px-2">
      <div className="space-y-2 group">
        <label className="serif text-[10px] tracking-[0.3em] uppercase text-black/40 block transition-colors group-focus-within:text-black">Nombre y Apellidos</label>
        <input
          required
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          className="w-full bg-transparent border-b border-black/10 py-3 text-sm tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-black/10"
          placeholder="Escribe tu nombre completo"
        />
      </div>

      <div className="space-y-4">
        <label className="serif text-[10px] tracking-[0.3em] uppercase text-black/40 block">¿Podrás asistir?</label>
        <div className="flex gap-10">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="asistencia" 
              value="si" 
              checked={formData.asistencia === "si"}
              onChange={() => setFormData({...formData, asistencia: "si"})}
              className="appearance-none w-3 h-3 border border-black/20 rounded-full checked:bg-black checked:border-black transition-all"
            />
            <span className="text-[11px] tracking-widest uppercase text-black/60 group-hover:text-black">Sí, allí estaré</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="asistencia" 
              value="no"
              checked={formData.asistencia === "no"}
              onChange={() => setFormData({...formData, asistencia: "no"})}
              className="appearance-none w-3 h-3 border border-black/20 rounded-full checked:bg-black checked:border-black transition-all"
            />
            <span className="text-[11px] tracking-widest uppercase text-black/60 group-hover:text-black">No podré ir</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <label className="serif text-[10px] tracking-[0.3em] uppercase text-black/40 block">¿Necesitas plaza en el autobús?</label>
        <div className="flex gap-10">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="bus" 
              value="si"
              checked={formData.bus === "si"}
              onChange={() => setFormData({...formData, bus: "si"})}
              className="appearance-none w-3 h-3 border border-black/20 rounded-full checked:bg-black checked:border-black transition-all"
            />
            <span className="text-[11px] tracking-widest uppercase text-black/60 group-hover:text-black">Sí</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="bus" 
              value="no"
              checked={formData.bus === "no"}
              onChange={() => setFormData({...formData, bus: "no"})}
              className="appearance-none w-3 h-3 border border-black/20 rounded-full checked:bg-black checked:border-black transition-all"
            />
            <span className="text-[11px] tracking-widest uppercase text-black/60 group-hover:text-black">No</span>
          </label>
        </div>
      </div>

      <div className="space-y-2 group">
        <label className="serif text-[10px] tracking-[0.3em] uppercase text-black/40 block transition-colors group-focus-within:text-black">Alergias o Intolerancias</label>
        <input
          type="text"
          value={formData.alergias}
          onChange={(e) => setFormData({...formData, alergias: e.target.value})}
          className="w-full bg-transparent border-b border-black/10 py-3 text-sm tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-black/10"
          placeholder="Ej: Gluten, Frutos secos..."
        />
      </div>

      <div className="space-y-2 group">
        <label className="serif text-[10px] tracking-[0.3em] uppercase text-black/40 block transition-colors group-focus-within:text-black">Mensaje para los novios</label>
        <textarea
          rows={2}
          value={formData.mensaje}
          onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
          className="w-full bg-transparent border-b border-black/10 py-3 text-sm tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-black/10 resize-none"
          placeholder="Escribe algo bonito o una canción..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-black text-white py-5 text-[11px] tracking-[0.5em] uppercase serif hover:bg-black/90 disabled:bg-black/40 transition-all duration-300"
      >
        {status === "submitting" ? "Enviando..." : "ENVIAR"}
      </button>

      {status === "error" && (
        <p className="text-[10px] text-red-500 text-center tracking-widest uppercase">Hubo un error al enviar. Por favor, inténtalo de nuevo.</p>
      )}
    </form>
  );
}

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/music.mp3");
      audio.loop = true;
      audioRef.current = audio;
    }
    const raf = requestAnimationFrame(() => setMounted(true));

    return () => {
      cancelAnimationFrame(raf);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Bloquear scroll mientras el sobre esté cerrado
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Opcional: Iniciar música automáticamente al abrir (requiere interacción previa del usuario)
    togglePlay();
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <AnimatePresence>
        {!isOpen && <EnvelopeIntro onOpen={handleOpen} />}
      </AnimatePresence>

      <main className={`mx-auto w-full max-w-sm px-4 pb-28 transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 h-screen overflow-hidden"}`}>
        <section className="pt-16 text-center">
          <motion.div {...fadeInUp}>
            <p className="text-[10px] tracking-[0.4em] text-black/40 uppercase font-medium">Invitación</p>
            <h1 className="serif mt-6 text-4xl font-light leading-tight text-black tracking-[0.1em] uppercase">
              Sara
              <span className="block my-2 text-2xl text-black/20 italic font-serif leading-none tracking-normal">&</span>
              Adrián
            </h1>
            <p className="mt-8 text-[11px] text-black/60 tracking-[0.3em] font-light uppercase">Sevilla · 04 / 07 / 2026</p>
          </motion.div>

          {/* Nueva Sección: Nuestra Historia con Foto de la Pareja */}
          <motion.section 
            className="mt-10 mb-10 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springTransition, delay: 0.2 }}
          >
            <p className="serif text-[9px] tracking-[0.5em] text-black/40 uppercase mb-6">Nuestra historia</p>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-md grayscale transition-all duration-700 hover:grayscale-0">
              <Image
                src="/foto-pareja-costa.jpg"
                alt="Sara & Adrián"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </div>
          </motion.section>

          <Countdown />
        </section>

        <section className="mt-24">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="serif text-2xl font-light text-black tracking-[0.2em] uppercase">Cronograma</h2>
          </motion.div>

          <div className="relative mt-4 px-4">
            {/* Hilo conductor vertical animado */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 -translate-x-1/2" />
            
            <div className="space-y-16">
              {[
                { time: "18:30h", text: "Ceremonia en Capilla de los Marineros.", icon: Church },
                { time: "19:30h", text: "Fin de la ceremonia.", icon: CheckCircle2 },
                { time: "20:00h", text: "Salida de autobuses.", icon: Bus },
                { time: "20:30h", text: "Copa de espera.", icon: GlassWater },
                { time: "21:00h", text: "Cóctel.", icon: UtensilsCrossed },
                { time: "23:00h", text: "Cena en Finca la Caprichosa.", icon: Moon },
              ].map((ev, idx) => (
                <motion.div
                  key={ev.time}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ ...springTransition, delay: idx * 0.05 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Nodo interactivo con Icono */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false, amount: 0.8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute left-1/2 -top-4 h-10 w-10 -translate-x-1/2 rounded-full border border-black/5 bg-white z-10 flex items-center justify-center shadow-sm"
                  >
                    <ev.icon className="h-4 w-4 text-black" strokeWidth={1.2} />
                  </motion.div>
                  
                  <div className="mt-10">
                    <span className="serif text-black text-xs tracking-[0.2em] font-medium block mb-2">{ev.time}</span>
                    <p className="text-[11px] text-black/60 leading-relaxed font-light uppercase tracking-widest px-8">{ev.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="serif text-2xl font-light text-black tracking-[0.2em] uppercase">Ubicaciones</h2>
          </motion.div>

          <div className="mt-8 space-y-12">
            <motion.article
              className="group"
              {...fadeInUp}
            >
              <div className="relative h-64 w-full grayscale hover:grayscale-0 transition-all duration-1000">
                <Image
                  src="/iglesia.jpeg"
                  alt="Capilla de los Marineros"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 640px"
                  priority
                />
              </div>
              <div className="pt-6 text-center">
                <h3 className="serif text-lg font-light text-black tracking-widest uppercase">Capilla de los Marineros</h3>
                <p className="mt-2 text-[10px] text-black/40 tracking-[0.2em] uppercase">TRIANA, SEVILLA</p>
                <a
                  href="https://maps.app.goo.gl/TcRACKVzVKZNLEHt9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-12 w-3/4 items-center justify-center border border-black text-black text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors"
                >
                  Ver mapa
                </a>
              </div>
            </motion.article>

            <motion.article
              className="group"
              {...fadeInUp}
            >
              <div className="relative h-64 w-full grayscale hover:grayscale-0 transition-all duration-1000">
                <Image
                  src="/hacienda.png"
                  alt="Finca la Caprichosa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 640px"
                />
              </div>
              <div className="pt-6 text-center">
                <h3 className="serif text-lg font-light text-black tracking-widest uppercase">Finca la Caprichosa</h3>
                <p className="mt-2 text-[10px] text-black/40 tracking-[0.2em] uppercase">GERENA, SEVILLA</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=La+Caprichosa+Gerena+Sevilla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-12 w-3/4 items-center justify-center border border-black text-black text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors"
                >
                  Ver mapa
                </a>
              </div>
            </motion.article>
          </div>
        </section>

        <section className="mt-24">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="serif text-2xl font-light text-black tracking-[0.2em] uppercase">Confirmación</h2>
            <p className="mt-4 text-[10px] text-black/40 tracking-[0.2em] uppercase font-light">Se ruega confirmación antes del 1 de Junio</p>
          </motion.div>
          
          <motion.div {...fadeInUp}>
            <RSVPForm />
          </motion.div>
        </section>

        <section className="mt-24 mb-32">
          <motion.div
            className="text-center px-8"
            {...fadeInUp}
          >
            <p className="text-[11px] leading-relaxed text-black/60 tracking-widest font-light italic mb-10">
              &quot;Vuestra compañía es nuestro mejor regalo, pero si desean tener un detalle con nosotros...&quot;
            </p>
            <div className="space-y-6">
              <p className="text-[8px] font-bold tracking-[0.4em] text-black/30 uppercase">Número de cuenta (IBAN)</p>
              <div className="flex flex-col items-center gap-6">
                <span className="serif text-xs font-light tracking-[0.2em] text-black">ES54 2100 7273 0002 0030 4414</span>
                <span className="text-[9px] text-black/40 tracking-[0.1em] uppercase font-light">Sara Reyes & Adrián Santiago</span>
                <button
                  type="button"
                  className="border-b border-black/20 pb-1 text-[9px] tracking-[0.3em] uppercase text-black hover:text-black/40 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText("ES54 2100 7273 0002 0030 4414");
                    alert("Copiado al portapapeles");
                  }}
                >
                  Copiar IBAN
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        <footer className="mt-32 text-center pb-12">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="space-y-4"
          >
            <div className="w-12 h-px bg-black/10 mx-auto mb-8" />
            <p className="serif text-[12px] tracking-[0.4em] uppercase text-black/60">
              Sara & Adrián
            </p>
            <p className="text-[8px] tracking-[0.2em] uppercase text-black/20 font-light">
              04 . 07 . 2026
            </p>
          </motion.div>
        </footer>
      </main>

      {isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          aria-label={playing ? "Silenciar" : "Música"}
          onClick={togglePlay}
          className="fixed bottom-8 left-8 flex items-center gap-3 z-50 group"
        >
          <div className="h-8 w-8 flex items-center justify-center border border-black/10 rounded-full group-hover:border-black transition-colors">
            {playing ? <Pause className="h-3 w-3 text-black" /> : <Play className="h-3 w-3 text-black ml-0.5" />}
          </div>
          <span className="text-[8px] tracking-[0.3em] uppercase text-black/40 group-hover:text-black transition-colors">
            {playing ? "Música On" : "Música Off"}
          </span>
        </motion.button>
      )}
    </div>
  );
}
