import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A synthetic football match drawn as the graph TraVIS builds every frame:
 * 22 players + the ball as nodes, and three families of edges
 * (ball interaction, tactical role, spatial proximity).
 * Movements are procedural (not real tracking data).
 */

type Role = "G" | "D" | "M" | "A";
export type EdgeKind = "ball" | "tactical" | "proximity";

const W = 105; // pitch length (m)
const H = 68; // pitch width (m)
const PROXIMITY_M = 11;

// 4-3-3 for a team attacking to the right, in [0,1] pitch units
const FORMATION: { role: Role; x: number; y: number }[] = [
  { role: "G", x: 0.05, y: 0.5 },
  { role: "D", x: 0.22, y: 0.14 },
  { role: "D", x: 0.2, y: 0.38 },
  { role: "D", x: 0.2, y: 0.62 },
  { role: "D", x: 0.22, y: 0.86 },
  { role: "M", x: 0.4, y: 0.27 },
  { role: "M", x: 0.37, y: 0.5 },
  { role: "M", x: 0.4, y: 0.73 },
  { role: "A", x: 0.58, y: 0.18 },
  { role: "A", x: 0.62, y: 0.5 },
  { role: "A", x: 0.58, y: 0.82 },
];

const ADJACENT: Record<Role, Role[]> = {
  G: ["G", "D"],
  D: ["G", "D", "M"],
  M: ["D", "M", "A"],
  A: ["M", "A"],
};

interface Player {
  id: number;
  team: 0 | 1;
  role: Role;
  bx: number;
  by: number;
  // per-player wander parameters
  f1: number;
  f2: number;
  p1: number;
  p2: number;
}

const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const buildPlayers = (): Player[] =>
  [0, 1].flatMap((team) =>
    FORMATION.map((f, i) => {
      const id = team * 11 + i;
      return {
        id,
        team: team as 0 | 1,
        role: f.role,
        bx: team === 0 ? f.x * W : (1 - f.x) * W,
        by: team === 0 ? f.y * H : (1 - f.y) * H,
        f1: 0.25 + rand(id + 1) * 0.35,
        f2: 0.2 + rand(id + 31) * 0.3,
        p1: rand(id + 7) * Math.PI * 2,
        p2: rand(id + 13) * Math.PI * 2,
      };
    }),
  );

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Deterministic sequence of passes so the ball travels between teammates (with some turnovers). */
const buildPasses = (players: Player[]) => {
  const passes: { from: number; to: number; t0: number; dur: number; hold: number }[] = [];
  let holder = 6; // team 0 central midfielder
  let t = 0;
  for (let k = 0; k < 400; k++) {
    const team = players[holder].team;
    const r = rand(k * 3 + 5);
    let candidates = players.filter((p) => p.team === team && p.id !== holder && p.role !== "G");
    if (r < 0.14) candidates = players.filter((p) => p.team !== team && p.role !== "G"); // turnover
    const to = candidates[Math.floor(rand(k * 7 + 11) * candidates.length)].id;
    const hold = 0.7 + rand(k * 5 + 3) * 0.9;
    const dur = 0.7 + rand(k * 11 + 2) * 0.5;
    passes.push({ from: holder, to, t0: t + hold, dur, hold });
    t += hold + dur;
    holder = to;
  }
  return { passes, total: t };
};

const EDGE_STYLE: Record<EdgeKind, { color: string; width: number; opacity: number }> = {
  ball: { color: "#ffffff", width: 0.18, opacity: 0.45 },
  tactical: { color: "hsl(20 90% 60%)", width: 0.28, opacity: 0.75 },
  proximity: { color: "hsl(188 85% 62%)", width: 0.32, opacity: 0.9 },
};

const TEAM_FILL = ["hsl(215 75% 58%)", "hsl(0 72% 62%)"];

interface Props {
  edges: EdgeKind[];
  className?: string;
}

const TrackingGraph = ({ edges, className }: Props) => {
  const players = useMemo(buildPlayers, []);
  const { passes, total } = useMemo(() => buildPasses(players), [players]);
  const reduce = useReducedMotion();
  const [time, setTime] = useState(3.2);
  const ref = useRef<SVGSVGElement>(null);
  const visible = useRef(true);
  // smoothed team block movement: horizontal shift and who is attacking (+1 team 0 … -1 team 1)
  const block = useRef({ shift: 0, poss: 1 });

  const stateAt = (t: number) => {
    let pi = passes.findIndex((p) => t < p.t0 + p.dur);
    if (pi < 0) pi = passes.length - 1;
    const pass = passes[pi];
    const inFlight = t >= pass.t0;
    const holder = inFlight ? pass.to : pass.from;
    return { pass, inFlight, holder };
  };

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible.current && !document.hidden) {
        setTime((t) => {
          const nt = (t + dt) % total;
          const { holder } = stateAt(nt);
          const targetShift = (players[holder].bx / W - 0.5) * 18;
          const targetPoss = players[holder].team === 0 ? 1 : -1;
          const k = Math.min(1, dt * 0.9);
          block.current.shift += (targetShift - block.current.shift) * k;
          block.current.poss += (targetPoss - block.current.poss) * k;
          return nt;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, total]);

  // --- ball + possession at time t
  const { pass, inFlight, holder } = stateAt(time);
  const { shift, poss } = block.current;

  const pos = players.map((p) => {
    // team 0 pushes right when it has the ball; team 1 pushes left
    const push = p.role === "G" ? 0 : 5 * poss;
    const gk = p.role === "G" ? 0.25 : 1;
    const x = p.bx + gk * (shift + push + Math.sin(time * p.f1 + p.p1) * 3.2);
    const y = p.by + gk * Math.cos(time * p.f2 + p.p2) * 3.4;
    return { x: Math.max(1, Math.min(W - 1, x)), y: Math.max(1, Math.min(H - 1, y)) };
  });

  let ball: { x: number; y: number };
  if (inFlight) {
    const k = smooth(Math.min(1, (time - pass.t0) / pass.dur));
    const a = pos[pass.from];
    const b = pos[pass.to];
    ball = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
  } else {
    const h = pos[pass.from];
    const dir = players[pass.from].team === 0 ? 1 : -1;
    ball = { x: h.x + 1.2 * dir, y: h.y + 0.6 };
  }

  // --- edges
  const lines: { x1: number; y1: number; x2: number; y2: number; kind: EdgeKind; key: string }[] = [];
  if (edges.includes("tactical")) {
    for (let i = 0; i < 22; i++)
      for (let j = i + 1; j < 22; j++) {
        const a = players[i];
        const b = players[j];
        if (a.team === b.team && ADJACENT[a.role].includes(b.role)) {
          // keep it readable: only link players that are reasonably close in the formation
          const d = Math.hypot(a.bx - b.bx, a.by - b.by);
          if (d < 30) lines.push({ x1: pos[i].x, y1: pos[i].y, x2: pos[j].x, y2: pos[j].y, kind: "tactical", key: `t${i}-${j}` });
        }
      }
  }
  if (edges.includes("proximity")) {
    for (let i = 0; i < 22; i++)
      for (let j = i + 1; j < 22; j++) {
        const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
        if (d < PROXIMITY_M) lines.push({ x1: pos[i].x, y1: pos[i].y, x2: pos[j].x, y2: pos[j].y, kind: "proximity", key: `p${i}-${j}` });
      }
  }
  if (edges.includes("ball")) {
    for (let i = 0; i < 22; i++) lines.push({ x1: ball.x, y1: ball.y, x2: pos[i].x, y2: pos[i].y, kind: "ball", key: `b${i}` });
  }

  const line = "rgba(255,255,255,0.28)";
  const M = 3; // margin around the pitch

  return (
    <svg
      ref={ref}
      viewBox={`${-M} ${-M} ${W + 2 * M} ${H + 2 * M}`}
      className={cn("w-full h-auto block", className)}
      role="img"
      aria-label="Animated football pitch where 22 players and the ball are linked by graph edges"
    >
      <rect x={-M} y={-M} width={W + 2 * M} height={H + 2 * M} fill="hsl(152 28% 20%)" />
      {/* mowing stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={(i * W) / 10} y={0} width={W / 10} height={H} fill={i % 2 ? "rgba(255,255,255,0.025)" : "transparent"} />
      ))}
      {/* pitch markings */}
      <g fill="none" stroke={line} strokeWidth={0.25}>
        <rect x={0} y={0} width={W} height={H} />
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} />
        <circle cx={W / 2} cy={H / 2} r={9.15} />
        <rect x={0} y={H / 2 - 20.16} width={16.5} height={40.32} />
        <rect x={W - 16.5} y={H / 2 - 20.16} width={16.5} height={40.32} />
        <rect x={0} y={H / 2 - 9.16} width={5.5} height={18.32} />
        <rect x={W - 5.5} y={H / 2 - 9.16} width={5.5} height={18.32} />
        <path d={`M16.5 ${H / 2 - 7.3} A9.15 9.15 0 0 1 16.5 ${H / 2 + 7.3}`} />
        <path d={`M${W - 16.5} ${H / 2 - 7.3} A9.15 9.15 0 0 0 ${W - 16.5} ${H / 2 + 7.3}`} />
      </g>

      {lines.map((l) => {
        const s = EDGE_STYLE[l.kind];
        return (
          <line
            key={l.key}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={s.color}
            strokeWidth={s.width}
            strokeOpacity={s.opacity}
            strokeLinecap="round"
          />
        );
      })}

      {players.map((p, i) => (
        <g key={p.id} transform={`translate(${pos[i].x} ${pos[i].y})`}>
          {i === holder && !inFlight && <circle r={2.6} fill="none" stroke="white" strokeOpacity={0.6} strokeWidth={0.25} />}
          <circle r={1.75} fill={TEAM_FILL[p.team]} stroke="white" strokeWidth={0.3} />
          <text y={0.62} textAnchor="middle" fontSize={1.7} fontWeight={700} fill="white" fontFamily="Inter, sans-serif">
            {p.role}
          </text>
        </g>
      ))}

      <circle cx={ball.x} cy={ball.y} r={0.95} fill="white" stroke="hsl(0 0% 10%)" strokeWidth={0.2} />
    </svg>
  );
};

export default TrackingGraph;
