"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import FloatingLines from "@/components/floating-lines/FloatingLines";

import "./ui/styles.css";

/* Track whether the site is in dark mode (Fumadocs toggles `.dark` on <html>). */
function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

// CDN base for the remaining illustration assets (folders, lights, icons, etc.)
const A = "https://qclay.design/lovable/sixsense";

/* ---------- Typewriter ---------- */
const PHRASES = [
  "What is a qubit?",
  "How do learning paths work?",
  "Superposition, explained",
  "Getting started guide",
  "Quantum gates basics",
];
function useTypewriter(phrases: string[] = PHRASES) {
  const [text, setText] = useState("");
  useEffect(() => {
    let phraseIdx = 0;
    let i = 0;
    let mode: "type" | "pause" | "delete" = "type";
    let timer: ReturnType<typeof setTimeout>;
    function step() {
      const phrase = phrases[phraseIdx];
      if (mode === "type") {
        i++;
        setText(phrase.slice(0, i));
        if (i >= phrase.length) {
          mode = "pause";
          timer = setTimeout(step, 1400);
          return;
        }
        timer = setTimeout(step, 22 + Math.random() * 25);
      } else if (mode === "pause") {
        mode = "delete";
        timer = setTimeout(step, 14);
      } else {
        i--;
        setText(phrase.slice(0, i));
        if (i <= 0) {
          phraseIdx = (phraseIdx + 1) % PHRASES.length;
          mode = "type";
        }
        timer = setTimeout(step, 14);
      }
    }
    timer = setTimeout(step, 600);
    return () => clearTimeout(timer);
  }, [phrases]);
  return text;
}

/* ---------- Send Button ---------- */
function SendButton() {
  const [hovered, setHovered] = useState(false);
  const [arrowToggle, setArrowToggle] = useState(0);
  const ringRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const speedRef = useRef(0); // deg/ms
  const lastTRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    function loop(t: number) {
      const dt = Math.min(64, t - lastTRef.current);
      lastTRef.current = t;
      const targetSpeed = hovered ? 360 / 1500 : 0;
      const tau = hovered ? 250 : 700;
      const k = 1 - Math.exp(-dt / tau);
      speedRef.current += (targetSpeed - speedRef.current) * k;
      angleRef.current = (angleRef.current + speedRef.current * dt) % 360;
      if (ringRef.current) {
        ringRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }
      if (Math.abs(speedRef.current) > 0.0005 || hovered) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = 0;
      }
    }
    if (!rafRef.current) {
      lastTRef.current = performance.now();
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [hovered]);

  return (
    <motion.div
      onHoverStart={() => {
        setHovered(true);
        setArrowToggle((v) => v + 1);
      }}
      onHoverEnd={() => setHovered(false)}
      animate={{ scale: hovered ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      style={{
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* halo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 15,
          background: "rgba(151,195,255,0.15)",
          zIndex: 1,
        }}
      />
      {/* inner 36 square */}
      <div
        style={{
          position: "relative",
          width: 36,
          height: 36,
          borderRadius: 12,
          background: "linear-gradient(180deg, #70A8F2 0%, #3D82DE 100%)",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 2,
          boxShadow:
            "inset 0 1px 18px 2px rgba(173,208,255,0.20), inset 0 1px 4px 2px rgba(222,236,255,0.80), 0 42px 107px 0 rgba(61,130,222,0.34), 0 10px 10px 0 rgba(61,130,222,0.20), 0 3.714px 4.846px 0 rgba(61,130,222,0.15)",
        }}
      >
        {/* spinning ring */}
        <div style={{ position: "absolute", inset: -1, borderRadius: 13, pointerEvents: "none" }}>
          <div
            ref={ringRef}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 13,
              padding: 1,
              background:
                "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, #FFFFFF 60deg, #9EC7FF 120deg, rgba(255,255,255,0) 200deg, rgba(255,255,255,0) 360deg)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
            }}
          />
        </div>
        {/* static border fallback */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            border: "1px solid #9EC7FF",
            zIndex: 4,
            pointerEvents: "none",
          }}
        />
        {/* dots overlay */}
        <img
          src={`${A}/dots.svg`}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.7,
            pointerEvents: "none",
          }}
        />
        {/* hover shine */}
        <AnimatePresence>
          {arrowToggle > 0 && (
            <motion.div
              key={`blink-${arrowToggle}`}
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                pointerEvents: "none",
                mixBlendMode: "screen",
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>
        {/* arrow swap */}
        <div style={{ position: "relative", width: 16, height: 16, overflow: "hidden", zIndex: 5 }}>
          <motion.img
            key={`out-${arrowToggle}`}
            src={`${A}/arrow-up.svg`}
            alt=""
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
            style={{ position: "absolute", inset: 0, width: 16, height: 16 }}
          />
          <motion.img
            key={`in-${arrowToggle}`}
            src={`${A}/arrow-up.svg`}
            alt=""
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
            style={{ position: "absolute", inset: 0, width: 16, height: 16 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Floating Cards ---------- */
type CardDef = {
  src: string;
  w: number;
  h: number;
  x: number;
  y: number;
  rot: number;
  start: { x: number; y: number };
};
const CARDS: CardDef[] = [
  { src: "/images/hero/quantum-card-1.jpg", w: 88.55, h: 68.46, x: -82, y: 123, rot: -16, start: { x: -5, y: 7 } },
  { src: "/images/hero/quantum-card-2.jpg", w: 105, h: 87, x: 68, y: 124, rot: 24, start: { x: 35, y: 33 } },
  { src: "/images/hero/quantum-card-3.jpg", w: 105, h: 96, x: -4, y: 148, rot: -4, start: { x: -4, y: 27 } },
];
const FOLDER_CENTER = 113.67 / 2;

function FloatingCards() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const idleAnims = [
    { y: [0, -6, 0, 4, 0], rotOffsets: [0, -2, 0, 2, 0], dur: 6 },
    { y: [0, 5, 0, -5, 0], rotOffsets: [0, 2, 0, -2, 0], dur: 7 },
    { y: [0, -4, 0, 6, 0], rotOffsets: [0, -1.5, 0, 1.5, 0], dur: 8 },
  ];

  return (
    <>
      {CARDS.map((c, i) => {
        const isHovered = hoveredIdx === i;
        const anyHovered = hoveredIdx !== null;
        const finalLeft = FOLDER_CENTER + c.x;
        const startLeft = FOLDER_CENTER + c.start.x;
        const idle = idleAnims[i];

        return (
          <motion.img
            key={i}
            src={c.src}
            alt=""
            initial={{
              opacity: 0,
              width: 20,
              height: 20,
              left: startLeft,
              bottom: c.start.y,
              rotate: 0,
            }}
            animate={
              anyHovered
                ? {
                    opacity: 1,
                    width: c.w,
                    height: c.h,
                    left: finalLeft,
                    bottom: c.y,
                    y: 0,
                    rotate: c.rot,
                    scale: isHovered ? 1.08 : 1,
                  }
                : {
                    opacity: 1,
                    width: c.w,
                    height: c.h,
                    left: finalLeft,
                    bottom: c.y,
                    y: idle.y,
                    rotate: idle.rotOffsets.map((o) => c.rot + o),
                    scale: 1,
                  }
            }
            transition={
              anyHovered
                ? { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                : {
                    opacity: { duration: 1.4, delay: 0.6 + i * 0.25, ease: [0.16, 1, 0.3, 1] },
                    width: { duration: 1.4, delay: 0.6 + i * 0.25, ease: [0.16, 1, 0.3, 1] },
                    height: { duration: 1.4, delay: 0.6 + i * 0.25, ease: [0.16, 1, 0.3, 1] },
                    left: { duration: 1.4, delay: 0.6 + i * 0.25, ease: [0.16, 1, 0.3, 1] },
                    bottom: { duration: 1.4, delay: 0.6 + i * 0.25, ease: [0.16, 1, 0.3, 1] },
                    y: { duration: idle.dur, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: idle.dur, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  }
            }
            onHoverStart={() => setHoveredIdx(i)}
            onHoverEnd={() => setHoveredIdx(null)}
            style={{
              position: "absolute",
              transformOrigin: "50% 100%",
              borderRadius: 10,
              boxShadow: "0 16px 40px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10)",
              objectFit: "cover",
              cursor: "pointer",
              zIndex: isHovered ? 20 : 11 + i,
              translateX: "-50%",
            }}
          />
        );
      })}
    </>
  );
}

/* ---------- Folder Stack ---------- */
type StackItem = {
  src: string;
  bottom: number;
  left: number;
  width: number;
  height: number;
  centered?: boolean;
  enter: { opacity?: number[]; y?: number[]; duration: number; delay: number; ease: number[] | string };
  z: number;
};
const STACK: StackItem[] = [
  { src: `${A}/blue-light-2.svg`, bottom: 50, left: 54.6, width: 104, height: 170, centered: true, enter: { duration: 0.8, delay: 1.0, ease: "easeOut" }, z: 1 },
  { src: `${A}/blue-light.svg`, bottom: 28, left: 54.6, width: 104, height: 170, centered: true, enter: { duration: 0.8, delay: 1.0, ease: "easeOut" }, z: 2 },
  { src: `${A}/light-1.svg`, bottom: 35, left: 57.2, width: 180.5, height: 124.5, centered: true, enter: { duration: 1.0, delay: 1.0, ease: "easeOut" }, z: 3 },
  { src: `${A}/folder-3.svg`, bottom: 60, left: 23.4, width: 69.71, height: 45, enter: { y: [30, 0], duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }, z: 4 },
  { src: `${A}/small-light-2.svg`, bottom: 55, left: 67.6, width: 39, height: 17, centered: true, enter: { duration: 0.6, delay: 1.4, ease: "easeOut" }, z: 5 },
  { src: `${A}/small-light.svg`, bottom: 50, left: 44.2, width: 39, height: 25, centered: true, enter: { duration: 0.6, delay: 1.4, ease: "easeOut" }, z: 6 },
  { src: `${A}/folder-2.svg`, bottom: 45, left: 18.98, width: 79, height: 51, enter: { y: [30, 0], duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }, z: 7 },
  { src: `${A}/light-2.svg`, bottom: 20, left: 57.2, width: 109, height: 162.5, centered: true, enter: { duration: 1.0, delay: 1.1, ease: "easeOut" }, z: 8 },
  { src: `${A}/folder-1.svg`, bottom: 30, left: 13, width: 91, height: 58, enter: { y: [30, 0], duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }, z: 9 },
  { src: `${A}/folder-0.svg?v=2`, bottom: 0, left: 0, width: 113.67, height: 76.5, enter: { y: [30, 0], duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] }, z: 10 },
];

function FolderStack() {
  return (
    <div style={{ position: "relative", width: 113.67, height: 220, overflow: "visible", margin: "0 auto" }}>
      {STACK.map((s, i) => {
        return (
          <motion.img
            key={i}
            src={s.src}
            alt=""
            initial={{
              opacity: 0,
              ...(s.enter.y ? { y: s.enter.y[0] } : {}),
            }}
            animate={{
              opacity: 1,
              ...(s.enter.y ? { y: s.enter.y[1] } : {}),
            }}
            transition={{ duration: s.enter.duration, delay: s.enter.delay, ease: s.enter.ease as never }}
            style={{
              position: "absolute",
              bottom: s.bottom,
              left: s.left,
              width: s.width,
              height: s.height,
              zIndex: s.z,
              transform: s.centered ? "translateX(-50%)" : undefined,
              pointerEvents: "none",
            }}
          />
        );
      })}
      <FloatingCards />
    </div>
  );
}

/* ---------- Main hero ---------- */
type HeroText = {
  headingTop: string;
  headingBottom: string;
  subtitle: string;
  phrases?: string[];
};

function AmeroHero({
  actions,
  text,
}: {
  actions?: ReactNode;
  text?: HeroText;
}) {
  const typed = useTypewriter(text?.phrases);
  const isDark = useIsDark();

  return (
    <div className="amero-hero">
      {/* Animated line background — dark mode only */}
      {isDark && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={8}
            lineDistance={8}
            bendRadius={8}
            bendStrength={-2}
            interactive
            parallax={true}
            animationSpeed={1}
            linesGradient={["#3B82F6", "#6f6f6f", "#6a6a6a"]}
          />
        </div>
      )}

      {/* Main column */}
      <main
        style={{
          position: "relative",
          zIndex: 5,
          paddingTop: 60,
          maxWidth: 760,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FolderStack />

        <motion.h1
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 32,
            fontWeight: 700,
            lineHeight: "34px",
            letterSpacing: "-0.64px",
            color: "var(--amero-heading)",
            width: 385,
            margin: "32px auto 8px",
            textAlign: "center",
          }}
        >
          {text?.headingTop ?? "Learn by doing with"}
          <br />
          {text?.headingBottom ?? "Quanterial"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 400,
            color: "var(--amero-muted)",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {text?.subtitle ??
            "Guides, core concepts, and hands-on lessons to get you started."}
        </motion.p>

        {/* Prompt box */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          style={{
            width: 702,
            maxWidth: "100%",
            padding: 4,
            borderRadius: 24,
            border: "0.5px solid rgba(0,0,0,0.05)",
            background: "var(--amero-prompt-outer)",
            backdropFilter: "blur(50px)",
            WebkitBackdropFilter: "blur(50px)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 116,
              background: "var(--amero-prompt-inner)",
              borderRadius: 20,
              border: "1px solid var(--amero-prompt-border)",
              padding: "14px 14px 12px 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: 32,
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                lineHeight: "22px",
                fontWeight: 400,
                color: "var(--amero-text)",
                paddingBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>{typed}</span>
              <span className="amero-caret" />
            </div>

            <div
              style={{
                marginTop: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, transform: "translateY(35%)" }}>
                {/* Top Expert pill */}
                <div
                  style={{
                    width: 110,
                    height: 28,
                    background: "var(--amero-pill-bg)",
                    borderRadius: 8,
                    padding: "0 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 5,
                      background: "linear-gradient(166deg, #3b82f6 0%, #6366f1 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    <img
                      className="amero-badge-icon"
                      src={`${A}/ai-select.svg`}
                      alt=""
                      style={{ width: 9, height: 9 }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      lineHeight: "16px",
                      color: "var(--amero-pill-text)",
                      whiteSpace: "nowrap",
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    Top Expert
                  </span>
                  <ChevronDown size={12} color="var(--amero-pill-text)" />
                </div>

                <IconBtn src={`${A}/image.svg`} />
                <IconBtn src={`${A}/Capa_1.svg`} />

                <div style={{ width: 1, height: 18, background: "var(--amero-divider)", margin: "0 2px" }} />

                <button
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: "1px solid var(--amero-iconbtn-border)",
                    background: "transparent",
                    color: "var(--amero-muted)",
                    fontSize: 16,
                    lineHeight: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>

                <div
                  style={{
                    height: 28,
                    background: "var(--amero-chip)",
                    borderRadius: 6,
                    padding: "0 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      color: "var(--amero-muted)",
                    }}
                  >
                    UI Design
                  </span>
                  <span style={{ fontSize: 12, color: "var(--amero-muted)", marginLeft: 2, cursor: "pointer" }}>
                    ×
                  </span>
                </div>
              </div>

              <SendButton />
            </div>
          </div>
        </motion.div>

        {actions ? <div style={{ marginTop: 24 }}>{actions}</div> : null}
      </main>
    </div>
  );
}

function IconBtn({ src }: { src: string }) {
  return (
    <button
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        border: "1px solid var(--amero-iconbtn-border)",
        background: "var(--amero-iconbtn-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <img className="amero-btn-icon" src={src} alt="" style={{ width: 14, height: 14 }} />
    </button>
  );
}

export { AmeroHero };
export default AmeroHero;

export const __demoId = "d3f85f703262"
