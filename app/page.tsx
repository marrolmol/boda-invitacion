/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, easeOut, AnimatePresence } from "framer-motion";
import { Play, Pause, Mail, Heart } from "lucide-react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// Transición tipo spring para que se sienta más orgánico y premium
const springTransition = {
  type: "spring",
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

function IntroInvitation({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white px-6"
    >
      <div className="relative flex flex-col items-center text-center">
        {/* Sello Minimalista B&W */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...springTransition, delay: 0.2 }}
          className="mb-12 flex h-32 w-32 items-center justify-center rounded-full border border-black bg-white"
        >
          <Heart className="h-10 w-10 text-black" strokeWidth={1} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="serif mb-10 text-3xl tracking-[0.2em] font-light uppercase"
        >
          Adrián & Sara
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          className="serif group relative flex h-14 items-center justify-center border border-black bg-black px-12 text-white transition-all"
        >
          <span className="relative z-10 text-sm tracking-[0.3em] uppercase font-light">Abrir</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

function useCountdown(target: Date) {
  const [left, setLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => setLeft(calcLeft(target));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [target]);
  return left;
}

function calcLeft(target: Date): TimeLeft {
  const now = new Date();
  const diff = Math.max(target.getTime() - now.getTime(), 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easeOut },
};

export default function Home() {
  const targetDate = useMemo(() => new Date("2026-07-04T18:30:00"), []);
  const left = useCountdown(targetDate);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/music.mp3");
      audioRef.current.loop = true;
    }
    setMounted(true);
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
        {!isOpen && <IntroInvitation onOpen={handleOpen} />}
      </AnimatePresence>

      <main className={`mx-auto w-full max-w-sm px-4 pb-28 transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 h-screen overflow-hidden"}`}>
        <section className="pt-16 text-center">
          <motion.div {...fadeInUp}>
            <p className="text-[10px] tracking-[0.4em] text-black/40 uppercase font-medium">Invitación</p>
            <h1 className="serif mt-6 text-4xl font-light leading-tight text-black tracking-[0.1em] uppercase">
              Adrián
              <span className="block my-2 text-2xl text-black/20 italic font-serif leading-none tracking-normal">&</span>
              Sara
            </h1>
            <p className="mt-8 text-[11px] text-black/60 tracking-[0.3em] font-light uppercase">Sevilla · 04 / 07 / 2026</p>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-4 gap-px bg-black/5 border border-black/5"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {[
              { label: "Días", value: left.days },
              { label: "Horas", value: left.hours },
              { label: "Min", value: left.minutes },
              { label: "Seg", value: left.seconds },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={fadeInUp}
                className="flex flex-col items-center justify-center py-6 bg-white"
              >
                <div suppressHydrationWarning className="serif text-xl text-black font-light">
                  {mounted ? item.value.toString().padStart(2, "0") : "--"}
                </div>
                <div className="mt-2 text-[8px] tracking-[0.2em] text-black/40 uppercase">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mt-24">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="serif text-2xl font-light text-black tracking-[0.2em] uppercase">Cronograma</h2>
          </motion.div>

          <div className="relative mt-4 px-4">
            {/* Hilo conductor vertical animado */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 -translate-x-1/2" />
            
            <div className="space-y-12">
              {[
                { time: "18:30h", text: "Ceremonia en Capilla de los Marineros.", icon: "⛪" },
                { time: "19:30h", text: "Fin de la ceremonia.", icon: "✨" },
                { time: "20:00h", text: "Salida de autobuses.", icon: "🚌" },
                { time: "20:30h", text: "Copa de espera.", icon: "🥂" },
                { time: "21:00h", text: "Cóctel.", icon: "🍸" },
                { time: "23:00h", text: "Cena en Finca la Caprichosa.", icon: "🍽️" },
              ].map((ev, idx) => (
                <motion.div
                  key={ev.time}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ ...springTransition, delay: idx * 0.05 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Nodo interactivo */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false, amount: 0.8 }}
                    className="absolute left-1/2 -top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border border-black bg-white z-10 transition-transform active:scale-150"
                  />
                  
                  <div className="mt-6">
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
                  href="https://www.google.com/maps?q=37.384,-6.00102"
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
          
          <motion.form
            {...fadeInUp}
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const payload = {
                nombre: data.get("nombre"),
                asistiras: data.get("asistiras") === "si",
                autobus: data.get("autobus") === "si",
                alergias: data.get("alergias"),
              };
              try {
                localStorage.setItem("rsvp", JSON.stringify(payload));
                alert("¡Gracias! Hemos registrado tu respuesta.");
                form.reset();
              } catch {}
            }}
            className="mt-8 space-y-8"
          >
            <div className="border-b border-black/10 pb-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 block mb-3">Nombre Completo</label>
              <input
                name="nombre"
                required
                placeholder="Introduzca su nombre"
                className="w-full bg-transparent py-2 text-xs tracking-widest focus:outline-none placeholder:text-black/20"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 block">Asistencia</label>
              <div className="space-y-3">
                <label className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase cursor-pointer group">
                  <input type="radio" name="asistiras" value="si" required className="accent-black h-3 w-3" />
                  Confirmar asistencia
                </label>
                <label className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase cursor-pointer group">
                  <input type="radio" name="asistiras" value="no" className="accent-black h-3 w-3" />
                  Lamentablemente no podré asistir
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 block">Transporte</label>
              <div className="flex gap-12">
                <label className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase cursor-pointer">
                  <input type="radio" name="autobus" value="si" required className="accent-black h-3 w-3" />
                  Sí
                </label>
                <label className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase cursor-pointer">
                  <input type="radio" name="autobus" value="no" className="accent-black h-3 w-3" />
                  No
                </label>
              </div>
            </div>

            <div className="border-b border-black/10 pb-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 block mb-3">Observaciones</label>
              <textarea
                name="alergias"
                placeholder="Indique alergias o intolerancias"
                className="w-full bg-transparent py-2 text-xs tracking-widest focus:outline-none placeholder:text-black/20 min-h-[60px]"
              />
            </div>

            <motion.button
              whileHover={{ backgroundColor: "#000", color: "#fff" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-8 h-14 w-full border border-black bg-white text-black text-[10px] tracking-[0.4em] uppercase font-medium transition-colors"
            >
              Enviar
            </motion.button>
          </motion.form>
        </section>

        <section className="mt-24 mb-32">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="serif text-2xl font-light text-black tracking-[0.2em] uppercase">Presente</h2>
          </motion.div>
          
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
                <span className="serif text-xs font-light tracking-[0.2em] text-black">ES00 0000 0000 0000 0000 0000</span>
                <span className="text-[9px] text-black/40 tracking-[0.1em] uppercase font-light">Adrián Santiago Jaime & Sara Reyes Aranda</span>
                <button
                  type="button"
                  className="border-b border-black/20 pb-1 text-[9px] tracking-[0.3em] uppercase text-black hover:text-black/40 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText("ES00 0000 0000 0000 0000 0000");
                    alert("Copiado al portapapeles");
                  }}
                >
                  Copiar IBAN
                </button>
              </div>
            </div>
          </motion.div>
        </section>
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
