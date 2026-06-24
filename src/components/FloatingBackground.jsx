import { useEffect, useRef } from "react";

const OBJECTS = [
  { type: "balloon", color: "#f472b6", x: 8, y: 12, size: 72, depth: 0.8, delay: 0 },
  { type: "donut", color: "#fbbf24", x: 82, y: 18, size: 64, depth: 1.2, delay: 1.2 },
  { type: "balloon", color: "#60a5fa", x: 72, y: 68, size: 56, depth: 0.6, delay: 2.4 },
  { type: "donut", color: "#a78bfa", x: 15, y: 72, size: 80, depth: 1.0, delay: 0.8 },
  { type: "balloon", color: "#34d399", x: 45, y: 8, size: 48, depth: 0.5, delay: 3.1 },
  { type: "donut", color: "#fb7185", x: 90, y: 45, size: 52, depth: 0.9, delay: 1.8 },
  { type: "balloon", color: "#818cf8", x: 28, y: 42, size: 60, depth: 0.7, delay: 2.0 },
];

function Balloon({ color, size }) {
  return (
    <>
      <div
        className="balloon-body"
        style={{
          width: size,
          height: size * 1.15,
          background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, ${color} 35%, ${color}dd 100%)`,
          boxShadow: `inset -8px -12px 24px rgba(0,0,0,0.12), inset 6px 6px 16px rgba(255,255,255,0.5), 0 16px 40px ${color}55`,
        }}
      />
      <div className="balloon-knot" style={{ background: color }} />
      <div className="balloon-string" style={{ height: size * 0.45 }} />
    </>
  );
}

function Donut({ color, size }) {
  const hole = size * 0.38;
  return (
    <div
      className="donut-ring"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, ${color} 50%, ${color}cc 100%)`,
        boxShadow: `inset -6px -10px 20px rgba(0,0,0,0.15), inset 5px 5px 14px rgba(255,255,255,0.45), 0 14px 36px ${color}44`,
      }}
    >
      <div className="donut-hole" style={{ width: hole, height: hole }} />
      <div className="donut-sprinkle" style={{ top: "22%", left: "58%", background: "#fff" }} />
      <div className="donut-sprinkle" style={{ top: "55%", left: "25%", background: "#fde68a" }} />
      <div className="donut-sprinkle" style={{ top: "70%", left: "62%", background: "#fda4af" }} />
    </div>
  );
}

export default function FloatingBackground() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smooth = useRef({ x: 0, y: 0 });
  const itemRefs = useRef([]);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    let raf;
    const tick = () => {
      smooth.current.x += (mouse.current.x - 0.5 - smooth.current.x) * 0.06;
      smooth.current.y += (mouse.current.y - 0.5 - smooth.current.y) * 0.06;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const obj = OBJECTS[i];
        const px = smooth.current.x * obj.depth * 120;
        const py = smooth.current.y * obj.depth * 90;
        const rx = smooth.current.y * obj.depth * 18;
        const ry = -smooth.current.x * obj.depth * 18;
        el.style.transform = `translate3d(${px}px, ${py}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="floating-scene" aria-hidden="true">
      <div className="scene-sky" />
      <div className="scene-warm-glow" />

      {OBJECTS.map((obj, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="float-object"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: obj.size,
            animationDelay: `${obj.delay}s`,
            zIndex: Math.round(obj.depth * 10),
          }}
        >
          {obj.type === "balloon" ? (
            <Balloon color={obj.color} size={obj.size} />
          ) : (
            <Donut color={obj.color} size={obj.size} />
          )}
        </div>
      ))}
    </div>
  );
}
