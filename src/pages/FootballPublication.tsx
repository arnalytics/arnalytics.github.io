import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Network, Sparkles } from "lucide-react";
import PublicationLayout from "@/components/publication/PublicationLayout";
import TrackingGraph, { EdgeKind } from "@/components/publication/TrackingGraph";
import { BibTeX, EASE, Figure, Prose, Reveal, Section, StatGrid } from "@/components/publication/primitives";
import { getPublication } from "@/data/publications";
import { cn } from "@/lib/utils";

const pub = getPublication("football");

// Colours follow the paper's figures: tracking = green, vision = blue, fused = orange.
const C = {
  vision: "hsl(215 70% 56%)",
  tracking: "hsl(145 45% 42%)",
  fused: "hsl(20 90% 55%)",
};

// Table 4 (mAP@1s)
const MAIN = [
  { label: "Video only", value: 68.85, color: C.vision },
  { label: "Tracking only", value: 68.05, color: C.tracking },
  { label: "TraVIS (video + tracking)", value: 75.27, color: C.fused },
];

// Table 5 (AP@1s): class, train instances, vision-only, TraVIS
const CLASSES: [string, number, number, number][] = [
  ["Reception", 9054, 79.77, 84.94],
  ["Pass", 9018, 84.95, 86.62],
  ["Tackle", 1718, 36.06, 37.15],
  ["Throw-in", 344, 76.79, 92.75],
  ["Shot at goal", 267, 67.35, 72.69],
  ["Cross", 255, 33.49, 43.85],
  ["Free-kick", 220, 58.89, 74.33],
  ["Goal-kick", 144, 63.94, 74.55],
  ["Corner", 81, 87.69, 87.67],
  ["Kick-off", 46, 99.52, 98.18],
];

// Tables 6 and 7: drop in mAP@1s when a component is removed
const ABLATIONS = [
  {
    group: "TraVIS · 75.27",
    color: C.fused,
    rows: [
      ["Without auxiliary heads", 8.4],
      ["Without temporal attention in the tracking branch", 1.93],
      ["Concatenation instead of max-pooling fusion", 0.65],
    ] as [string, number][],
  },
  {
    group: "Tracking branch alone · 68.05",
    color: C.tracking,
    rows: [
      ["Without tactical edges", 8.51],
      ["Fully connected graph", 2.9],
      ["Without proximity edges", 2.64],
      ["Ball edges only", 55.84],
    ] as [string, number][],
  },
];

// Table 2 (video only, mAP@1s)
const TEMPORAL = [
  { label: "BiGRU (1 layer)", scale: "single", value: 68.3, best: true },
  { label: "TCN", scale: "single", value: 65.78 },
  { label: "Transformer, global", scale: "single", value: 59.84 },
  { label: "Transformer, local", scale: "single", value: 53.95 },
  { label: "TCN (1.8× params)", scale: "multi", value: 68.85, best: true },
  { label: "GRU", scale: "multi", value: 64.48 },
];

const EDGE_INFO: Record<EdgeKind, { name: string; img: string; text: string; impact: string; color: string }> = {
  ball: {
    name: "Ball",
    img: "/media/travis/edge_ball.webp",
    text: "Joins the ball to all 22 players, so its position and motion reach every node in a single message-passing step.",
    impact: "On its own: only 12.21 mAP@1s",
    color: "#ffffff",
  },
  tactical: {
    name: "Tactical",
    img: "/media/travis/edge_tactical.webp",
    text: "Joins teammates with the same or an adjacent role (G–D, D–M, M–A). It encodes each team's shape.",
    impact: "Without it: −8.51 mAP@1s",
    color: "hsl(20 90% 60%)",
  },
  proximity: {
    name: "Proximity",
    img: "/media/travis/edge_proximity.webp",
    text: "Joins any two players closer than a fixed distance, whatever their team or role: local duels and pressure.",
    impact: "Without it: −2.64 mAP@1s",
    color: "hsl(188 85% 62%)",
  },
};

const Bar = ({ value, max, color, delay = 0, className }: { value: number; max: number; color: string; delay?: number; className?: string }) => (
  <div className={cn("relative h-full w-full", className)}>
    <motion.div
      className="absolute inset-y-0 left-0 rounded-md"
      style={{ backgroundColor: color }}
      initial={{ width: 0 }}
      whileInView={{ width: `${(value / max) * 100}%` }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    />
  </div>
);

const LiveGraph = () => {
  const [edges, setEdges] = useState<EdgeKind[]>(["tactical", "proximity"]);
  const toggle = (k: EdgeKind) => setEdges((e) => (e.includes(k) ? e.filter((x) => x !== k) : [...e, k]));
  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-[hsl(152_28%_20%)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]">
      <TrackingGraph edges={edges} />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-white/10 px-4 py-3 md:px-5">
        <p className="text-xs md:text-sm text-white/60">
          Every frame is a graph: 22 players + the ball. Toggle the edge types TraVIS uses.
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(EDGE_INFO) as EdgeKind[]).map((k) => {
            const on = edges.includes(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggle(k)}
                aria-pressed={on}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  on ? "border-white/50 bg-white/15 text-white" : "border-white/15 text-white/50 hover:text-white/80",
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: EDGE_INFO[k].color, opacity: on ? 1 : 0.4 }} />
                {EDGE_INFO[k].name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FootballPublication = () => {
  const [edgeTab, setEdgeTab] = useState<EdgeKind>("tactical");
  const sortedClasses = [...CLASSES].sort((a, b) => b[3] - b[2] - (a[3] - a[2]));
  const lo = 30;
  const hi = 100;
  const pct = (v: number) => ((v - lo) / (hi - lo)) * 100;

  return (
    <PublicationLayout
      pub={pub}
      eyebrow={
        <span className="inline-flex items-center gap-2">
          <img src="/media/travis/travis_logo.svg" alt="" className="h-5 w-5" />
          MMSports '26 · ACM Multimedia · Rio de Janeiro
        </span>
      }
      note="Universitat de Barcelona · Computer Vision Center · Aalborg University — * equal contribution"
      visual={<LiveGraph />}
      toc={[
        { id: "tldr", label: "TL;DR" },
        { id: "motivation", label: "Motivation" },
        { id: "method", label: "Method" },
        { id: "graph", label: "The graph" },
        { id: "results", label: "Results" },
        { id: "ablations", label: "Ablations" },
        { id: "citation", label: "Citation" },
      ]}
    >
      <Section id="tldr" label="TL;DR" title={<>Video tells you <em>what</em> happens. Tracking tells you <em>where</em> and <em>when</em>. TraVIS uses both.</>}>
        <Prose>
          <p>
            Action spotting asks a model to find the <strong>single frame</strong> at which each action happens in a full
            match. Video-only models must infer player positions, team shape and ball dynamics implicitly from pixels.
            TraVIS gives them that structure explicitly: it encodes player and ball tracking as a{" "}
            <strong>graph</strong> and fuses it with panoramic video, improving the video-only model by{" "}
            <strong>+6.42 mAP@1s</strong>.
          </p>
        </Prose>
        <div className="mt-12">
          <StatGrid
            items={[
              { value: 6.42, decimals: 2, prefix: "+", label: "mAP@1s over the video-only model", highlight: true },
              { value: 75.27, decimals: 2, label: "mAP@1s on PanoTrack" },
              { value: 15, label: "professional matches · 22.5 h, 2×4K panoramic, 25 fps" },
              { value: 10, label: "ball-related action classes, ~2,350 per match" },
            ]}
          />
        </div>
      </Section>

      <Section id="motivation" label="Motivation" title="Is one modality enough?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal className="rounded-2xl border border-foreground/10 p-5 md:p-6">
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: C.vision }}>
              <Eye className="w-4 h-4" /> Video
            </div>
            <img src="/media/travis/pano_gs.webp" alt="Grayscale panoramic frame of a football match" loading="lazy" className="mt-4 w-full rounded-lg" />
            <p className="mt-4 text-text-secondary leading-relaxed">
              Sees posture and ball contact — <strong className="text-foreground">what</strong> happens — but players and the
              ball are often small, occluded or far from the camera.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-foreground/10 p-5 md:p-6">
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: C.tracking }}>
              <Network className="w-4 h-4" /> Tracking
            </div>
            <img src="/media/travis/quiz.webp" alt="Three consecutive tracking frames of player positions on a pitch" loading="lazy" className="mt-4 w-full rounded-lg" />
            <p className="mt-4 text-text-secondary leading-relaxed">
              Gives full-pitch context — <strong className="text-foreground">where and when</strong> — but from dots alone it is
              hard to tell a pass from a shot.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="mt-6 flex items-start gap-3 rounded-2xl bg-accent-orange/10 p-5 md:p-6">
          <Sparkles className="w-5 h-5 mt-0.5 shrink-0 text-accent-orange" />
          <p className="text-text-secondary leading-relaxed">
            <strong className="text-foreground">TraVIS</strong> fuses both: precise visual cues from the panoramic video with the
            full tactical context of 2D player and ball tracking. Video is shown in grayscale for anonymisation only.
          </p>
        </Reveal>
      </Section>

      <Section id="method" label="Method" title="Two branches, one graph, one temporal model" wide>
        <Figure
          src="/media/travis/arch.webp"
          alt="TraVIS architecture diagram"
          caption="TraVIS architecture. The tracking branch builds a graph per frame and encodes it with a GIN and temporal self-attention; the vision branch encodes both panoramic halves with RegNetY-200MF + GSM. Features are fused by element-wise max-pooling and contextualised by a temporal module before classification. Auxiliary heads (training only) keep each branch discriminative."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              n: "01",
              t: "Vision branch",
              d: "Left and right panoramic views go through a RegNetY-200MF backbone with Gated Shift Modules to capture local appearance and motion.",
              c: C.vision,
            },
            {
              n: "02",
              t: "Tracking branch",
              d: "Each frame becomes a graph of 23 nodes (position, motion, team and role). A Graph Isomorphism Network plus temporal self-attention encodes it.",
              c: C.tracking,
            },
            {
              n: "03",
              t: "Fusion + temporal model",
              d: "Max-pooling keeps the strongest signal of each modality. A single-layer bidirectional GRU adds temporal context and a head predicts actions per frame.",
              c: C.fused,
            },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="border-t border-foreground/10">
              <div style={{ backgroundColor: s.c }} className="-mt-px mb-4 h-0.5 w-12" />
              <span className="font-mono text-xs text-text-muted">{s.n}</span>
              <h4 className="mt-1 text-lg font-medium">{s.t}</h4>
              <p className="mt-2 text-text-secondary leading-relaxed">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="graph" label="The graph" title="Three kinds of edges add football-specific inductive biases">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div className="flex flex-col gap-2" role="tablist" aria-label="Edge types">
            {(Object.keys(EDGE_INFO) as EdgeKind[]).map((k) => {
              const e = EDGE_INFO[k];
              const on = edgeTab === k;
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setEdgeTab(k)}
                  className={cn(
                    "text-left rounded-xl border p-5 transition-all duration-300",
                    on ? "border-foreground/30 bg-foreground/[0.03]" : "border-foreground/10 opacity-60 hover:opacity-100",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg font-medium">{e.name} edges</span>
                    <span className="font-mono text-xs text-text-muted">{e.impact}</span>
                  </div>
                  <motion.p
                    initial={false}
                    animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden text-text-secondary leading-relaxed"
                  >
                    <span className="block pt-2">{e.text}</span>
                  </motion.p>
                </button>
              );
            })}
          </div>
          <div className="relative overflow-hidden rounded-2xl aspect-[550/381] bg-[#76c043]">
            {(Object.keys(EDGE_INFO) as EdgeKind[]).map((k) => (
              <motion.img
                key={k}
                src={EDGE_INFO[k].img}
                alt={`${EDGE_INFO[k].name} edges on a pitch`}
                initial={false}
                animate={{ opacity: edgeTab === k ? 1 : 0, scale: edgeTab === k ? 1 : 1.03 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ))}
          </div>
        </div>
        <Reveal className="mt-8">
          <p className="text-text-secondary leading-relaxed max-w-3xl">
            Semantically meaningful connections beat indiscriminate ones: the proposed graph reaches 68.05 mAP@1s with tracking
            alone, versus 65.15 for a fully connected graph — at a lower computational cost.
          </p>
        </Reveal>
      </Section>

      <Section id="results" label="Results" title="Better together">
        <div className="space-y-5">
          {MAIN.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <div className="flex items-baseline justify-between text-sm md:text-base">
                <span className={i === 2 ? "font-medium text-foreground" : "text-text-secondary"}>{m.label}</span>
                <span className="font-mono tabular-nums" style={{ color: i === 2 ? C.fused : undefined }}>
                  {m.value.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 h-3 rounded-md bg-foreground/[0.06]">
                <Bar value={m.value} max={80} color={m.color} delay={0.1 + i * 0.12} />
              </div>
            </Reveal>
          ))}
          <p className="pt-2 text-sm text-text-muted">mAP@1s on the PanoTrack test set. Scale from 0 to 80.</p>
        </div>

        <Reveal className="mt-16">
          <h4 className="text-xl font-medium">Where tracking helps most</h4>
          <p className="mt-2 text-text-secondary leading-relaxed max-w-3xl">
            AP@1s per action class, sorted by gain. The largest gains come from restarts defined by their spatial layout:
            throw-ins near the touchline and free-kicks with the ball still and players arranged around it.
          </p>
          <div className="mt-6 flex items-center gap-5 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.vision }} /> Video only
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.fused }} /> TraVIS
            </span>
          </div>
        </Reveal>
        <div className="mt-4 divide-y divide-foreground/[0.06]">
          {sortedClasses.map(([name, n, v, t], i) => {
            const gain = t - v;
            const a = pct(Math.min(v, t));
            const b = pct(Math.max(v, t));
            return (
              <Reveal key={name} delay={i * 0.04} y={10}>
                <div className="grid grid-cols-[7.5rem_1fr_4rem] md:grid-cols-[10rem_1fr_5rem] items-center gap-3 py-2.5">
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-[11px] text-text-muted tabular-nums">{n.toLocaleString("en-US")} train</div>
                  </div>
                  <div className="relative h-6">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-foreground/10" />
                    <motion.div
                      className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full"
                      style={{ left: `${a}%`, backgroundColor: gain >= 0 ? C.fused : C.vision, opacity: 0.35 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b - a}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.04, ease: EASE }}
                    />
                    <span
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background"
                      style={{ left: `${pct(v)}%`, backgroundColor: C.vision }}
                      title={`Video only: ${v}`}
                    />
                    <motion.span
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background"
                      style={{ backgroundColor: C.fused }}
                      initial={{ left: `${pct(v)}%` }}
                      whileInView={{ left: `${pct(t)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.04, ease: EASE }}
                      title={`TraVIS: ${t}`}
                    />
                  </div>
                  <div
                    className={cn("text-right font-mono text-sm tabular-nums", gain >= 10 ? "text-accent-orange font-semibold" : "text-text-muted")}
                  >
                    {gain >= 0 ? "+" : "−"}
                    {Math.abs(gain).toFixed(2)}
                  </div>
                </div>
              </Reveal>
            );
          })}
          <div className="grid grid-cols-[7.5rem_1fr_4rem] md:grid-cols-[10rem_1fr_5rem] gap-3 pt-2 text-[11px] text-text-muted font-mono">
            <span />
            <div className="relative h-4">
              {[30, 50, 70, 90, 100].map((t) => (
                <span key={t} className="absolute -translate-x-1/2" style={{ left: `${pct(t)}%` }}>
                  {t}
                </span>
              ))}
            </div>
            <span className="text-right">gain</span>
          </div>
        </div>
      </Section>

      <Section id="ablations" label="Ablations" title="Every piece matters">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {ABLATIONS.map((g) => (
            <div key={g.group}>
              <Reveal>
                <h4 className="text-sm font-medium" style={{ color: g.color }}>
                  {g.group}
                </h4>
                <p className="text-xs text-text-muted mt-1">Drop in mAP@1s when a component is removed or changed</p>
              </Reveal>
              <div className="mt-5 space-y-4">
                {g.rows.map(([label, drop], i) => {
                  const capped = Math.min(drop, 10);
                  return (
                    <Reveal key={label} delay={i * 0.06} y={10}>
                      <div className="flex items-baseline justify-between gap-4 text-sm">
                        <span className="text-text-secondary">{label}</span>
                        <span className="font-mono tabular-nums text-foreground">−{drop.toFixed(2)}</span>
                      </div>
                      <div className="mt-1.5 h-2 rounded bg-foreground/[0.06] relative overflow-hidden">
                        <Bar value={capped} max={10} color={g.color} delay={0.1 + i * 0.08} />
                        {drop > 10 && (
                          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white">//</span>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Reveal className="mt-16">
          <h4 className="text-xl font-medium">Simple temporal models are enough</h4>
          <p className="mt-2 text-text-secondary leading-relaxed max-w-3xl">
            Ball actions are brief. In video-only experiments a single-layer bidirectional GRU (68.30) is almost as good as a
            multi-scale TCN (68.85) with 1.8× more parameters — and with tracking, the BiGRU version of TraVIS wins 75.27 vs 70.99.
          </p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
          {TEMPORAL.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.05} y={8}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-text-secondary">
                  {t.label} <span className="text-text-faded text-xs">· {t.scale}-scale</span>
                </span>
                <span className={cn("font-mono tabular-nums", t.best && "text-foreground font-medium")}>{t.value.toFixed(2)}</span>
              </div>
              <div className="mt-1.5 h-2 rounded bg-foreground/[0.06]">
                <Bar value={t.value - 50} max={20} color={t.best ? C.vision : "hsl(215 30% 75%)"} delay={i * 0.05} />
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-muted">Video only, mAP@1s, axis from 50 to 70.</p>
      </Section>

      <Section id="citation" label="Citation">
        <BibTeX bibtex={pub.bibtex} />
      </Section>
    </PublicationLayout>
  );
};

export default FootballPublication;
