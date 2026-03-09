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
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: springTransition,
};

function IntroInvitation({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cream px-6"
    >
      <div className="relative flex flex-col items-center text-center">
        {/* Sobre Digital / Sello Dorado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...springTransition, delay: 0.2 }}
          className="mb-8 flex h-32 w-32 items-center justify-center rounded-full border-2 border-gold bg-white shadow-2xl"
        >
          <Heart className="h-12 w-12 text-gold" fill="currentColor" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="serif mb-6 text-2xl font-semibold"
        >
          Adrián & Sara
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="serif group relative flex h-14 items-center justify-center rounded-full bg-deep px-10 text-cream shadow-xl transition-all"
        >
          <span className="relative z-10 text-lg tracking-wide">Abrir Invitación</span>
          <motion.div
            className="absolute inset-0 rounded-full bg-gold/20 opacity-0 group-hover:opacity-100"
            layoutId="glow"
          />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-xs tracking-widest text-gold uppercase"
        >
          Estás cordialmente invitado
        </motion.p>
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
    <div className="w-full min-h-screen bg-cream">
      <AnimatePresence>
        {!isOpen && <IntroInvitation onOpen={handleOpen} />}
      </AnimatePresence>

      <main className={`mx-auto w-full max-w-sm px-4 pb-28 transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 h-screen overflow-hidden"}`}>
        <section className="pt-10 text-center">
          <motion.div {...fadeInUp}>
            <p className="text-xs tracking-[0.3em] text-gold uppercase">Invitación</p>
            <h1 className="serif mt-3 text-3xl font-semibold leading-tight text-deep">
              Adrián Santiago Jaime
              <span className="mx-2 text-gold">&</span>
              Sara Reyes Aranda
            </h1>
            <p className="mt-3 text-sm text-deep/70 tracking-widest">SEVILLA · 04 / 07 / 2026</p>
          </motion.div>

          <motion.div
            className="mt-8 grid grid-cols-4 gap-2"
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
                className="card flex flex-col items-center justify-center py-4 bg-white/50 backdrop-blur-sm"
              >
                <div suppressHydrationWarning className="serif text-2xl text-deep">
                  {mounted ? item.value.toString().padStart(2, "0") : "--"}
                </div>
                <div className="mt-1 text-[10px] tracking-[0.1em] text-gold uppercase font-medium">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mt-16">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="serif text-2xl font-semibold text-deep">Cronograma</h2>
            <div className="mt-2 h-1 w-12 bg-gold mx-auto rounded-full" />
          </motion.div>

          <div className="relative mt-4 px-2">
            {/* Hilo conductor vertical */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/10 via-gold/50 to-gold/10" />

            <div className="space-y-8">
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
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ ...springTransition, delay: idx * 0.1 }}
                  className="relative pl-10"
                >
                  {/* Nodo interactivo */}
                  <motion.div
                    whileInView={{ scale: [1, 1.2, 1], backgroundColor: ["#D4C19C", "#2B2A28", "#D4C19C"] }}
                    viewport={{ once: false, amount: 0.8 }}
                    className="absolute left-[13px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold border border-cream shadow-sm z-10"
                  />
                  
                  <div className="card group relative flex flex-col p-4 bg-white/40 backdrop-blur-sm hover:bg-white/80 transition-all duration-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="serif text-gold font-bold tracking-wider">{ev.time}</span>
                      <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">{ev.icon}</span>
                    </div>
                    <p className="text-sm text-deep/80 leading-relaxed">{ev.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <h2 className="serif text-2xl font-semibold text-deep">Ubicaciones</h2>
            <div className="mt-2 h-1 w-12 bg-gold mx-auto rounded-full" />
          </motion.div>

          <div className="mt-6 space-y-6">
            <motion.article
              className="card overflow-hidden group"
              {...fadeInUp}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="/iglesia.jpeg"
                  alt="Capilla de los Marineros"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 640px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent" />
              </div>
              <div className="px-5 py-4 relative bg-white">
                <h3 className="serif text-xl font-semibold text-deep">Capilla de los Marineros</h3>
                <p className="mt-1 text-sm text-gold font-medium tracking-wide">TRIANA, SEVILLA</p>
                <a
                  href="https://www.google.com/maps?q=37.384,-6.00102"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-deep text-cream text-sm font-medium tracking-wide shadow-lg active:scale-95 transition-transform"
                >
                  Cómo llegar
                </a>
              </div>
            </motion.article>

            <motion.article
              className="card overflow-hidden group"
              {...fadeInUp}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="/hacienda.png"
                  alt="Finca la Caprichosa"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 640px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent" />
              </div>
              <div className="px-5 py-4 relative bg-white">
                <h3 className="serif text-xl font-semibold text-deep">Finca la Caprichosa</h3>
                <p className="mt-1 text-sm text-gold font-medium tracking-wide">GERENA, SEVILLA</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=La+Caprichosa+Gerena+Sevilla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-deep text-cream text-sm font-medium tracking-wide shadow-lg active:scale-95 transition-transform"
                >
                  Cómo llegar
                </a>
              </div>
            </motion.article>
          </div>
        </section>

        <section className="mt-16">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <h2 className="serif text-2xl font-semibold text-deep">Confirmación</h2>
            <div className="mt-2 h-1 w-12 bg-gold mx-auto rounded-full" />
            <p className="mt-3 text-xs text-deep/60 tracking-widest uppercase italic">Nos encantaría que nos acompañaras</p>
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
            className="mt-4 space-y-4"
          >
            <div className="card px-5 py-4 bg-white/60">
              <label className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Nombre y apellidos</label>
              <input
                name="nombre"
                required
                placeholder="Tu nombre completo"
                className="w-full border-b-2 border-gold/30 bg-transparent py-2 text-sm focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <div className="card px-5 py-4 bg-white/60">
              <label className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">¿Asistirás?</label>
              <div className="mt-2 flex gap-6">
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="radio" name="asistiras" value="si" required className="accent-gold h-4 w-4" />
                  Sí, ¡con muchas ganas!
                </label>
              </div>
              <div className="mt-2 flex gap-6">
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="radio" name="asistiras" value="no" className="accent-gold h-4 w-4" />
                  No podré asistir
                </label>
              </div>
            </div>

            <div className="card px-5 py-4 bg-white/60">
              <label className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">¿Necesitas autobús?</label>
              <div className="mt-2 flex gap-6">
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="radio" name="autobus" value="si" required className="accent-gold h-4 w-4" />
                  Sí
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input type="radio" name="autobus" value="no" className="accent-gold h-4 w-4" />
                  No
                </label>
              </div>
            </div>

            <div className="card px-5 py-4 bg-white/60">
              <label className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Observaciones</label>
              <textarea
                name="alergias"
                placeholder="Alergias, intolerancias o cualquier detalle que debamos saber"
                className="mt-2 w-full rounded-xl border border-gold/30 bg-white/50 px-3 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
                rows={3}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-4 h-14 w-full rounded-full bg-deep text-cream text-sm font-bold tracking-widest uppercase shadow-xl"
            >
              Enviar confirmación
            </motion.button>
          </motion.form>
        </section>

        <section className="mt-16 mb-20">
          <motion.div {...fadeInUp} className="text-center mb-6">
            <h2 className="serif text-2xl font-semibold text-deep">Regalo</h2>
            <div className="mt-2 h-1 w-12 bg-gold mx-auto rounded-full" />
          </motion.div>
          
          <motion.div
            className="card mt-4 px-6 py-8 bg-white text-center shadow-inner"
            {...fadeInUp}
          >
            <Mail className="h-8 w-8 text-gold mx-auto mb-4" />
            <p className="text-sm leading-relaxed text-deep/80 mb-6 italic">
              &quot;Tu presencia es nuestro mejor regalo, pero si deseas tener un detalle...&quot;
            </p>
            <div className="space-y-3">
              <p className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Número de cuenta</p>
              <div className="flex flex-col items-center gap-3">
                <span className="serif text-sm font-medium tracking-wider">ES00 0000 0000 0000 0000 0000</span>
                <button
                  type="button"
                  className="rounded-full bg-gold/10 border border-gold/50 px-6 py-2 text-xs font-bold text-gold hover:bg-gold hover:text-deep transition-all active:scale-95"
                  onClick={() => {
                    navigator.clipboard.writeText("ES00 0000 0000 0000 0000 0000");
                    alert("¡IBAN copiado!");
                  }}
                >
                  COPIAR IBAN
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...springTransition, delay: 1 }}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          onClick={togglePlay}
          className="fixed bottom-6 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-deep text-cream shadow-2xl z-50 border border-gold/20"
        >
          {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
          {playing && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gold/20"
            />
          )}
        </motion.button>
      )}
    </div>
  );
}
