/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, easeOut } from "framer-motion";
import { Play, Pause, Mail } from "lucide-react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

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
  useEffect(() => {
    audioRef.current = typeof window !== "undefined" ? new Audio("/music.mp3") : null;
    audioRef.current && (audioRef.current.loop = true);
    setMounted(true);
  }, []);
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

  return (
    <div className="w-full min-h-screen bg-cream">
      <main className="mx-auto w-full max-w-sm px-4 pb-28">
        <section className="pt-10 text-center">
          <motion.div {...fadeIn} initial="initial" animate="animate" transition={fadeIn.transition}>
            <p className="text-xs tracking-[0.3em] text-gold">Invitación</p>
            <h1 className="serif mt-3 text-3xl font-semibold leading-tight">
              Adrián Santiago Jaime
              <span className="mx-1 text-gold">&</span>
              Sara Reyes Aranda
            </h1>
            <p className="mt-2 text-sm text-deep/70">Sevilla · 04/07/2026</p>
          </motion.div>

          <motion.div
            className="mt-6 grid grid-cols-4 gap-2"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
          >
            {[
              { label: "Días", value: left.days },
              { label: "Horas", value: left.hours },
              { label: "Min", value: left.minutes },
              { label: "Seg", value: left.seconds },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={fadeIn}
                className="card flex flex-col items-center justify-center py-3"
              >
                <div suppressHydrationWarning className="serif text-2xl">
                  {mounted ? item.value.toString().padStart(2, "0") : "--"}
                </div>
                <div className="mt-1 text-[11px] tracking-wide text-deep/70">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mt-10">
          <motion.h2
            className="serif text-xl font-semibold"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={fadeIn.transition}
          >
            Cronograma
          </motion.h2>

          <div className="mt-4 space-y-3">
            {[
              { time: "18:30h", text: "Ceremonia en Capilla de los Marineros." },
              { time: "19:30h", text: "Fin de la ceremonia." },
              { time: "20:00h", text: "Salida de autobuses." },
              { time: "20:30h", text: "Copa de espera." },
              { time: "21:00h", text: "Cóctel." },
              { time: "23:00h", text: "Cena en Finca la Caprichosa." },
            ].map((ev) => (
              <motion.div
                key={ev.time}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                transition={fadeIn.transition}
                className="card flex items-center justify-between px-4 py-3"
              >
                <span className="serif text-lg">{ev.time}</span>
                <span className="ml-3 text-sm">{ev.text}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <motion.h2
            className="serif text-xl font-semibold"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={fadeIn.transition}
          >
            Ubicaciones
          </motion.h2>

          <div className="mt-4 space-y-4">
            <motion.article
              className="card overflow-hidden"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              transition={fadeIn.transition}
            >
              <div className="relative h-40 w-full bg-[#fff]">
                <Image
                  src="/iglesia.jpeg"
                  alt="Capilla de los Marineros"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 640px"
                  priority
                />
              </div>
              <div className="px-4 py-3">
                <h3 className="serif text-lg font-semibold">Capilla de los Marineros</h3>
                <p className="mt-1 text-sm text-deep/70">Triana, Sevilla</p>
                <a
                  href="https://www.google.com/maps?q=37.384,-6.00102"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-gold px-4 text-deep text-sm"
                >
                  Cómo llegar
                </a>
              </div>
            </motion.article>

            <motion.article
              className="card overflow-hidden"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              transition={fadeIn.transition}
            >
              <div className="relative h-40 w-full bg-[#fff]">
                <Image
                  src="/hacienda.png"
                  alt="Finca la Caprichosa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 640px"
                />
              </div>
              <div className="px-4 py-3">
                <h3 className="serif text-lg font-semibold">Finca la Caprichosa</h3>
                <p className="mt-1 text-sm text-deep/70">Gerena, Sevilla</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=La+Caprichosa+Gerena+Sevilla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-gold px-4 text-deep text-sm"
                >
                  Cómo llegar
                </a>
              </div>
            </motion.article>
          </div>
        </section>

        <section className="mt-10">
          <motion.h2
            className="serif text-xl font-semibold"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={fadeIn.transition}
          >
            RSVP
          </motion.h2>
          <motion.form
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={fadeIn.transition}
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
            className="mt-4 space-y-3"
          >
            <div className="card px-4 py-3">
              <label className="text-sm">Nombre y apellidos</label>
              <input
                name="nombre"
                required
                placeholder="Tu nombre completo"
                className="mt-2 w-full rounded-xl border border-gold/50 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="card px-4 py-3">
              <label className="text-sm">¿Asistirás?</label>
              <div className="mt-2 flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="asistiras" value="si" required />
                  Sí
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="asistiras" value="no" />
                  No
                </label>
              </div>
            </div>

            <div className="card px-4 py-3">
              <label className="text-sm">¿Necesitas autobús?</label>
              <div className="mt-2 flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="autobus" value="si" required />
                  Sí
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="autobus" value="no" />
                  No
                </label>
              </div>
            </div>

            <div className="card px-4 py-3">
              <label className="text-sm">Alergias o intolerancias alimenticias</label>
              <textarea
                name="alergias"
                placeholder="Cuéntanos si tienes alguna"
                className="mt-2 w-full rounded-xl border border-gold/50 bg-white px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-full bg-deep text-cream text-sm"
            >
              Enviar respuesta
            </button>
          </motion.form>
        </section>

        <section className="mt-10 mb-20">
          <motion.h2
            className="serif text-xl font-semibold"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={fadeIn.transition}
          >
            Regalo
          </motion.h2>
          <motion.div
            className="card mt-4 px-4 py-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={fadeIn.transition}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gold" />
              <p className="text-sm">
                Tu presencia es nuestro mejor regalo, pero si deseas tener un detalle...
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-gold/50 bg-white px-3 py-2">
              <span className="text-sm">IBAN: ES00 0000 0000 0000 0000 0000</span>
              <button
                type="button"
                className="rounded-full bg-gold px-3 py-1 text-xs text-deep"
                onClick={() => navigator.clipboard.writeText("ES00 0000 0000 0000 0000 0000")}
              >
                Copiar
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <button
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        onClick={togglePlay}
        className="fixed bottom-6 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-deep text-cream shadow-lg"
      >
        {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>
    </div>
  );
}
