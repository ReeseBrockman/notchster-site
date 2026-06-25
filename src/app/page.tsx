"use client";

import { motion, type Variants } from "framer-motion";
import type { PointerEvent } from "react";

const DOWNLOAD_URL = "https://github.com/ReeseBrockman/rabbitOS/releases/latest";
const SOURCE_URL = "https://github.com/ReeseBrockman/rabbitOS";

const BUNNY = ` (\\_/)
 (o.o)
 (")_(")`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const themeSwatches = [
  { name: "Blue", c: "#5ea2ff" },
  { name: "Red", c: "#ff5c5c" },
  { name: "Green", c: "#4dcc73" },
  { name: "Purple", c: "#a06bff" },
  { name: "Orange", c: "#ff9f43" },
  { name: "Pink", c: "#ff6fae" },
];

function handleSpot(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
}

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      {/* faux notch at the very top of the page */}
      <div
        aria-hidden
        className="fixed left-1/2 top-0 z-50 h-7 w-[180px] -translate-x-1/2 rounded-b-2xl bg-black"
      />

      <Nav />
      <Hero />
      <Statement />
      <Features />
      <Themes />
      <Download />
      <Footer />
    </main>
  );
}

/* ----------------------------------------------------------------- Nav */
function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2.5 font-display font-bold">
          <span className="ascii text-[0.5rem] leading-[0.85] text-accent">{BUNNY}</span>
          <span className="text-lg tracking-tight">Notchster</span>
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a
            href="#features"
            className="hidden text-muted transition-colors hover:text-foreground sm:inline"
          >
            Features
          </a>
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-muted transition-colors hover:text-foreground sm:inline"
          >
            Source
          </a>
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- Hero */
function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-5xl px-6 pt-24 text-center sm:pt-28">
      {/* accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[420px] w-[680px] max-w-[120%] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
      />

      <motion.p
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="font-mono text-xs uppercase tracking-[0.25em] text-accent"
      >
        Notchster for Mac
      </motion.p>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl md:text-8xl"
      >
        Your notch,
        <br />
        but <span className="text-accent">cuter.</span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mx-auto mt-7 max-w-xl text-lg text-muted"
      >
        A playful menu-bar companion. A little ASCII bunny springs down from your
        notch with weather, music, system stats, and on-device AI.
      </motion.p>

      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-black shadow-[0_12px_50px_-12px_var(--accent)] transition-transform hover:scale-[1.03] active:scale-95"
        >
          Download for Mac
        </a>
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/15 px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-white/40"
        >
          View source ›
        </a>
      </motion.div>

      <motion.p
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-5 text-sm text-muted"
      >
        Free &amp; open source · macOS 26.2+ · no API keys, no subscriptions
      </motion.p>

      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-16"
      >
        <MacMockup />
      </motion.div>
    </section>
  );
}

/* --------------------------------------------------- MacBook mockup */
function MacMockup() {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div
        className="group/mac relative flex min-h-[360px] flex-col items-center overflow-hidden rounded-[26px] border-[10px] border-[#0b0b0c] sm:min-h-[460px]"
        style={{
          boxShadow:
            "0 0 0 2px #2b2c2f, 0 60px 120px -40px rgba(0,0,0,0.85), inset 0 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* desktop wallpaper (CSS gradient) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 30% 20%, #1d3b6e 0%, #122a52 35%, #0a1430 70%, #060a18 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 75% 85%, rgba(200,255,61,0.18), transparent 70%)",
          }}
        />

        {/* hover zone: the notch + the panel that drops from it */}
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 cursor-pointer px-8 pb-6">
          {/* the device notch */}
          <div className="relative z-20 mx-auto h-6 w-[130px] rounded-b-[11px] bg-black transition-[filter] duration-300 group-hover/mac:brightness-150 sm:h-[26px] sm:w-[150px]" />

          {/* the drop-down panel (tucked behind the notch by default) */}
          <div
            className="absolute left-1/2 top-0 z-10 w-[min(86vw,440px)] -translate-x-1/2 -translate-y-[102%] rounded-b-[22px] border border-t-0 border-[#131316] bg-black px-2 pb-3 opacity-0 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.9)] transition-all duration-[550ms] ease-[cubic-bezier(0.34,1.4,0.5,1)] group-hover/mac:translate-y-0 group-hover/mac:opacity-100"
            role="img"
            aria-label="Notchster panel preview"
          >
            <PanelContents />
          </div>
        </div>

        {/* hint */}
        <span className="hint-pulse pointer-events-none absolute top-12 left-1/2 z-0 -translate-x-1/2 text-sm font-semibold text-white/80 transition-opacity duration-300 group-hover/mac:opacity-0">
          ↑ Hover the notch
        </span>
      </div>
    </div>
  );
}

function PanelContents() {
  return (
    <>
      {/* top bar: tabs · notch gap · gear */}
      <div className="flex h-[30px] items-center">
        <div className="flex flex-1 items-center justify-end gap-1.5 pr-1.5">
          <span className="rounded-full bg-accent/20 px-2 py-[3px] text-[0.62rem] font-bold text-foreground">
            Notchster
          </span>
          <span className="px-2 py-[3px] text-[0.62rem] font-bold text-white/45">Tray</span>
        </div>
        <div className="w-[130px] shrink-0 sm:w-[150px]" />
        <div className="flex flex-1 items-center pl-1.5 text-white/55">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
            <path d="M8 5.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zm0 1.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
            <path
              d="M6.9.8h2.2l.3 1.8q.6.2 1.1.5l1.6-.9 1.6 1.6-.9 1.6q.3.5.5 1.1l1.8.3v2.2l-1.8.3q-.2.6-.5 1.1l.9 1.6-1.6 1.6-1.6-.9q-.5.3-1.1.5l-.3 1.8H6.9l-.3-1.8q-.6-.2-1.1-.5l-1.6.9-1.6-1.6.9-1.6q-.3-.5-.5-1.1L.4 9.1V6.9l1.8-.3q.2-.6.5-1.1l-.9-1.6 1.6-1.6 1.6.9q.5-.3 1.1-.5z"
              opacity="0.85"
            />
          </svg>
        </div>
      </div>

      {/* bunny scene with twinkling stars */}
      <div className="relative mt-1 flex h-[104px] items-center justify-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 text-accent">
          <span className="twinkle absolute left-[16%] top-3 text-xs">✦</span>
          <span className="twinkle absolute right-[18%] top-2 text-xs" style={{ animationDelay: "0.6s" }}>
            ✧
          </span>
          <span className="twinkle absolute bottom-5 left-[24%] text-xs" style={{ animationDelay: "1.2s" }}>
            ✦
          </span>
          <span className="twinkle absolute left-[44%] top-10 text-xs" style={{ animationDelay: "1.8s" }}>
            ✧
          </span>
          <span className="twinkle absolute bottom-4 right-[26%] text-xs" style={{ animationDelay: "0.3s" }}>
            ✦
          </span>
        </div>
        <pre className="ascii z-[1] m-0 text-center text-base text-white">{BUNNY}</pre>
      </div>

      {/* now playing */}
      <div className="flex items-center gap-3 px-2 pt-2.5 text-left">
        <div
          className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[11px]"
          style={{
            background: "linear-gradient(140deg, #fb5c74 0%, #fa2d48 45%, #b5179e 100%)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-2xl text-white/85">♫</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-bold text-white">The Eliminating Angel</span>
            <span className="flex h-3 shrink-0 items-end gap-[2px]">
              <i className="eqbar w-[2.5px] rounded-sm bg-accent" />
              <i className="eqbar w-[2.5px] rounded-sm bg-accent" style={{ animationDelay: "0.15s" }} />
              <i className="eqbar w-[2.5px] rounded-sm bg-accent" style={{ animationDelay: "0.3s" }} />
              <i className="eqbar w-[2.5px] rounded-sm bg-accent" style={{ animationDelay: "0.45s" }} />
            </span>
          </div>
          <div className="mt-px text-xs text-white/85">Metavoid</div>
          <div className="mt-px text-[0.7rem] text-white/45">Lustmord</div>
          <div className="mt-2">
            <div className="h-[3px] overflow-hidden rounded-full bg-white/20">
              <span className="block h-full w-[34%] rounded-full bg-white" />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[0.6rem] tabular-nums text-white/45">
              <span>1:13</span>
              <span>3:35</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ----------------------------------------------------------- Statement */
function Statement() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-32 text-center sm:py-40">
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
      >
        Everything you love
        <br />
        about your notch.
        <br />
        <span className="text-muted">And a bunny.</span>
      </motion.h2>
    </section>
  );
}

/* ------------------------------------------------------------ Features */
function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
        {/* AI — large */}
        <Card className="sm:col-span-4 sm:row-span-2 flex flex-col">
          <div>
            <Kicker>On-device AI</Kicker>
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ask Bunny
              <br />
              anything.
            </h3>
            <p className="mt-3 max-w-md text-muted">
              A private assistant powered by Apple Intelligence. Runs entirely on your
              Mac — no network, no API keys, no token costs.
            </p>
          </div>
          <div aria-hidden className="mt-auto flex flex-col gap-2.5 pt-7">
            <div className="self-end rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm font-medium text-black">
              What&apos;s the weather looking like?
            </div>
            <div className="self-start rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-2.5 text-sm">
              Clear skies and 68° near you — perfect bunny weather. 🐰
            </div>
            <div className="mt-1.5 rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-muted">
              Ask Bunny anything…
            </div>
          </div>
        </Card>

        {/* Weather */}
        <Card className="sm:col-span-2">
          <Kicker>Local weather</Kicker>
          <h3 className="text-2xl font-bold tracking-tight">Weather, instantly.</h3>
          <p className="mt-2 text-sm text-muted">
            Conditions, feels-like, and the day&apos;s high/low via Open-Meteo. No API key
            required.
          </p>
          <div aria-hidden className="mt-5">
            <div className="text-5xl font-bold leading-none text-foreground">68°</div>
            <div className="mt-1.5 text-sm text-muted">Partly Cloudy · H:72° L:54°</div>
          </div>
        </Card>

        {/* Music */}
        <Card className="sm:col-span-2">
          <Kicker>Apple Music &amp; Spotify</Kicker>
          <h3 className="text-2xl font-bold tracking-tight">Now playing.</h3>
          <p className="mt-2 text-sm text-muted">
            See what&apos;s playing and control it — album art, a live timeline, and
            transport controls, styled like Dynamic Island.
          </p>
          <div aria-hidden className="mt-5 flex h-11 items-end gap-1.5">
            {[0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72].map((d, i) => (
              <i
                key={i}
                className="eqbar w-[7px] rounded-sm"
                style={{
                  background: "linear-gradient(180deg,#fb5c74,#b5179e)",
                  animationDelay: `${d}s`,
                }}
              />
            ))}
          </div>
        </Card>

        {/* System stats */}
        <Card className="sm:col-span-2">
          <Kicker>System stats</Kicker>
          <h3 className="text-2xl font-bold tracking-tight">Vital signs.</h3>
          <p className="mt-2 text-sm text-muted">
            Battery, CPU, and memory at a glance with color-coded load bars.
          </p>
          <div aria-hidden className="mt-5 flex flex-col gap-3">
            <StatBar label="BAT" value="82%" color="#4dcc73" />
            <StatBar label="CPU" value="46%" color="#ff9f43" />
            <StatBar label="MEM" value="67%" color="#ff5c5c" />
          </div>
        </Card>

        {/* Living scene — wide */}
        <Card className="group/scene sm:col-span-4 flex flex-col justify-between">
          <div>
            <Kicker>A living scene</Kicker>
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Alive, day and night.
            </h3>
            <p className="mt-3 max-w-lg text-muted">
              An ASCII bunny that tracks your cursor, drifts past clouds by day,
              twinkles under shooting stars at night, and sleeps with floating z&apos;s —
              themed by your real sunrise and sunset.
            </p>
          </div>
          <pre
            aria-hidden
            className="scene-bunny ascii mt-6 overflow-hidden text-[0.8rem] text-accent sm:text-base"
          >{`    .   *        .       *
  *     (\\_/)   .     *
        (o.o)      .
   .    (")_(")  *    .
  _____________________`}</pre>
        </Card>

        {/* Calm */}
        <Card className="sm:col-span-2">
          <Kicker>Stays out of the way</Kicker>
          <h3 className="text-2xl font-bold tracking-tight">A gentle drop.</h3>
          <p className="mt-2 text-sm text-muted">
            Springs down from the notch when you want it, never steals focus, and tucks
            away the moment your pointer leaves.
          </p>
        </Card>
      </div>
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.article
      onPointerMove={handleSpot}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`group/card relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 transition-colors duration-300 hover:border-white/20 ${className}`}
    >
      <div aria-hidden className="card-glow pointer-events-none absolute inset-0 rounded-3xl" />
      <div className="relative z-[1] flex h-full flex-col">{children}</div>
    </motion.article>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-accent">
      {children}
    </p>
  );
}

function StatBar({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-9 font-mono text-[0.7rem] text-muted">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
        <span
          className="block h-full w-0 rounded-full transition-[width] duration-700 ease-out group-hover/card:w-[var(--w)]"
          style={{ "--w": value, background: color } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Themes */
function Themes() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-36 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Make it yours.
      </motion.h2>
      <p className="mt-4 text-lg text-muted">Six accent themes, tuned for day and night.</p>
      <div className="mt-10 flex justify-center gap-4">
        {themeSwatches.map((t, i) => (
          <motion.span
            key={t.name}
            title={t.name}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.2 }}
            className="h-10 w-10 rounded-full ring-2 ring-white/10"
            style={{ background: t.c }}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Download */
function Download() {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <pre className="ascii mx-auto text-center text-sm text-accent">{BUNNY}</pre>
        <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Get Notchster.</h2>
        <p className="mt-4 text-lg text-muted">
          Free and open source. Bring your notch to life in seconds.
        </p>
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-accent px-9 py-4 text-lg font-semibold text-black shadow-[0_12px_50px_-12px_var(--accent)] transition-transform hover:scale-[1.03] active:scale-95"
        >
          Download for Mac
        </a>
        <ul className="mx-auto mt-11 inline-block space-y-2.5 text-left text-muted">
          {[
            "macOS 26.2 or later",
            "Apple Silicon recommended (required for AI)",
            "Location & Automation permissions for weather & music",
          ].map((req) => (
            <li key={req} className="relative pl-7">
              <span className="absolute left-0 font-bold text-accent">✓</span>
              {req}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-7 max-w-md text-sm text-muted">
          Grab <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-xs">Notchster.dmg</code>{" "}
          from the latest release. If Gatekeeper blocks an unsigned build, open{" "}
          <strong className="text-foreground/80">System Settings → Privacy &amp; Security</strong> and click{" "}
          <strong className="text-foreground/80">Open Anyway</strong>.
        </p>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------- Footer */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-8 text-center text-sm text-muted">
      <p>
        <span className="ascii mr-2 inline-block align-middle text-accent">{`(\\_/)`}</span>
        Made with care by{" "}
        <a
          href="https://github.com/ReeseBrockman"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Reese Brockman
        </a>
        . MIT licensed.
      </p>
    </footer>
  );
}
