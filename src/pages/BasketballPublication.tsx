import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import PublicationLayout from "@/components/publication/PublicationLayout";
import { BibTeX, EASE, Figure, Prose, Reveal, Section, StatGrid, YouTube } from "@/components/publication/primitives";
import { getPublication } from "@/data/publications";
import { cn } from "@/lib/utils";

const pub = getPublication("basketball");
const B = "/media/basketball";

const FRAMES = [
  { wa: "2.5", src: `${B}/wa_2.5.webp`, note: "The play is still developing." },
  { wa: "2.0", src: `${B}/wa_2.0.webp`, note: "The shot goes up." },
  { wa: "1.5", src: `${B}/wa_1.5.webp`, note: "Ball in the air: positioning is the only cue." },
  { wa: "1.0", src: `${B}/wa_1.0.webp`, note: "Players fight for position under the rim." },
  { wa: "0.5", src: `${B}/wa_0.5.webp`, note: "By now the ball has usually hit the rim." },
  { wa: "0.0", src: `${B}/wa_0.0.webp`, note: "Offensive rebound." },
];

const CAMS = [
  { wa: "2.0", src: `${B}/cam_2.0.webp`, frame: "47/48" },
  { wa: "1.5", src: `${B}/cam_1.5.webp`, frame: "53/54" },
  { wa: "1.0", src: `${B}/cam_1.0.webp`, frame: "59/60" },
  { wa: "0.5", src: `${B}/cam_0.5.webp`, frame: "64/66" },
];

// Table IV
const HUMAN_VS_AI = {
  "0.5": { Precision: [0.62, 0.83], Recall: [0.52, 0.56], "F1-score": [0.57, 0.67], Accuracy: [0.6, 0.71] },
  "1.5": { Precision: [0.6, 0.65], Recall: [0.53, 0.38], "F1-score": [0.56, 0.48], Accuracy: [0.59, 0.59] },
} as const;

const AI = "hsl(20 90% 55%)";
const HUMAN = "hsl(0 0% 25%)";

/** Plays the last frame a model would see for each anticipation time, like a short clip. */
const AnticipationScrubber = () => {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    FRAMES.forEach((f) => {
      const img = new Image();
      img.src = f.src;
    });
  }, []);

  useEffect(() => {
    if (!playing || reduce || !inView) return;
    const t = setTimeout(() => setI((v) => (v + 1) % FRAMES.length), i === FRAMES.length - 1 ? 2600 : 1500);
    return () => clearTimeout(t);
  }, [i, playing, reduce, inView]);

  const f = FRAMES[i];
  const last = i === FRAMES.length - 1;

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl bg-black shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
      <div className="relative aspect-video">
        <AnimatePresence initial={false}>
          <motion.img
            key={f.src}
            src={f.src}
            alt={`Broadcast frame ${f.wa} seconds before the rebound`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="flex items-baseline justify-between gap-4 px-4 pt-4 md:px-6 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={f.wa}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
          >
            <span className="font-mono text-xl md:text-2xl tracking-tight">
              {last ? (
                <span className="text-accent-orange">rebound!</span>
              ) : (
                <>
                  ω<sub className="text-sm">a</sub> = {f.wa}s
                </>
              )}
            </span>
            <span className="text-sm md:text-base text-white/70">{f.note}</span>
          </motion.div>
        </AnimatePresence>
        <span className="hidden md:block shrink-0 text-xs text-white/40">last frame the model sees</span>
      </div>
      <div className="flex items-center gap-3 px-4 pb-3 pt-1 md:px-6">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
        </button>
        <div className="flex flex-1 gap-1.5">
          {FRAMES.map((fr, k) => (
            <button
              key={fr.wa}
              type="button"
              onClick={() => {
                setI(k);
                setPlaying(false);
              }}
              className="group flex-1 py-2"
              aria-label={k === FRAMES.length - 1 ? "Moment of the rebound" : `${fr.wa} seconds before the rebound`}
            >
              <span className="relative block h-1 overflow-hidden rounded-full bg-white/15">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: k === FRAMES.length - 1 ? AI : "white" }}
                  animate={{ width: k <= i ? "100%" : "0%" }}
                  transition={{ duration: k === i && playing ? 1.2 : 0.2, ease: "linear" }}
                />
              </span>
              <span className={cn("mt-1.5 block text-[10px] font-mono transition-colors", k === i ? "text-white" : "text-white/40 group-hover:text-white/70")}>
                {k === FRAMES.length - 1 ? "0s" : `−${fr.wa}s`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const HumanVsAI = () => {
  const [wa, setWa] = useState<"0.5" | "1.5">("1.5");
  const data = HUMAN_VS_AI[wa];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-foreground/15 p-1" role="tablist">
          {(["0.5", "1.5"] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={wa === k}
              onClick={() => setWa(k)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-mono transition-colors",
                wa === k ? "bg-foreground text-background" : "text-text-muted hover:text-foreground",
              )}
            >
              ω<sub>a</sub> = {k}s
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: AI }} /> AI model
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: HUMAN }} /> 5 human experts
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(data).map(([metric, [ai, human]]) => (
          <div key={metric}>
            <div className="flex h-44 items-end gap-2 border-b border-foreground/15">
              {[
                { v: ai, c: AI, who: "AI" },
                { v: human, c: HUMAN, who: "Humans" },
              ].map((b) => (
                <div key={b.who} className="flex flex-1 flex-col items-center justify-end h-full">
                  <span className="mb-1 font-mono text-xs tabular-nums">{b.v.toFixed(2)}</span>
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{ backgroundColor: b.c }}
                    initial={{ height: 0 }}
                    animate={{ height: `${b.v * 100}%` }}
                    transition={{ duration: 0.8, ease: EASE }}
                    aria-label={`${b.who} ${metric}: ${b.v}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-baseline justify-between text-sm">
              <span className="font-medium">{metric}</span>
              <span className={cn("font-mono text-xs", ai - human >= 0 ? "text-accent-orange" : "text-text-muted")}>
                {ai - human >= 0 ? "+" : "−"}
                {Math.abs(ai - human).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={wa}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-8 text-text-secondary leading-relaxed max-w-3xl"
        >
          {wa === "0.5"
            ? "Half a second before the rebound the ball has usually bounced off the rim, and experts read its trajectory very well: humans clearly win."
            : "1.5 seconds before, both reach the same accuracy (0.59), but humans fall back on their prior — defensive rebounds are 2–3× more frequent — while the model stays balanced and gets a higher F1-score."}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

const CamSwitcher = () => {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <AnimatePresence initial={false}>
          <motion.img
            key={CAMS[i].src}
            src={CAMS[i].src}
            alt={`LayerCAM activation map for the model trained with anticipation time ${CAMS[i].wa} seconds`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {CAMS.map((c, k) => (
          <button
            key={c.wa}
            type="button"
            onClick={() => setI(k)}
            aria-pressed={i === k}
            className={cn(
              "rounded-lg border px-2 py-2 text-left transition-colors",
              i === k ? "border-foreground/40 bg-foreground/[0.04]" : "border-foreground/10 hover:border-foreground/25",
            )}
          >
            <span className="block font-mono text-sm">
              ω<sub>a</sub> = {c.wa}s
            </span>
            <span className="block text-[11px] text-text-muted">peak at frame {c.frame}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const BasketballPublication = () => (
  <PublicationLayout
    pub={pub}
    eyebrow="arXiv preprint · 2025 · Master's thesis"
    note="Universitat de Barcelona · Computer Vision Center"
    visual={<AnticipationScrubber />}
    toc={[
      { id: "tldr", label: "TL;DR" },
      { id: "task", label: "The task" },
      { id: "method", label: "Method" },
      { id: "humans", label: "AI vs humans" },
      { id: "interpretability", label: "Interpretability" },
      { id: "videos", label: "Videos" },
      { id: "citation", label: "Citation" },
    ]}
  >
    <Section id="tldr" label="TL;DR" title="Can a model tell who will grab the rebound before it happens?">
      <Prose>
        <p>
          Rebounds are one of the most chaotic moments in basketball: many players contest a tight space, occlusions are
          constant and the ball bounces unpredictably off the rim. This work introduces <strong>rebound anticipation</strong>{" "}
          in broadcast video — predicting whether the offence or the defence will win the ball — together with a new
          large-scale dataset and the first deep-learning baselines for the task.
        </p>
      </Prose>
      <div className="mt-12">
        <StatGrid
          items={[
            { value: 100000, label: "broadcast video clips", suffix: "", highlight: true },
            { value: 300, suffix: "+ h", label: "of NBA footage" },
            { value: 2000, suffix: "+", label: "manually annotated rebounds" },
            { value: 0.59, decimals: 2, label: "accuracy 1.5s ahead — same as human experts" },
          ]}
        />
      </div>
    </Section>

    <Section id="task" label="The task" title="Offensive or defensive rebound?" wide>
      <div className="grid grid-cols-1 gap-8">
        <Figure
          src={`${B}/seq_dreb.webp`}
          alt="Three frames of a defensive rebound"
          framed={false}
          caption={<><strong className="text-foreground font-medium">Defensive rebound (DREB).</strong> The team that defended the shot secures the ball.</>}
        />
        <Figure
          src={`${B}/seq_oreb.webp`}
          alt="Three frames of an offensive rebound"
          framed={false}
          caption={<><strong className="text-foreground font-medium">Offensive rebound (OREB).</strong> The shooting team gets the ball back — rarer and harder to predict.</>}
        />
      </div>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <Prose>
          <p>
            Two anticipation settings are studied. In the <strong>offline</strong> setting the video is cut ω<sub>a</sub>{" "}
            seconds before the rebound and the model predicts what comes next. In the <strong>online</strong> setting it
            sees a short fixed-length clip and must decide whether a rebound is about to happen, without knowing when.
          </p>
          <p>
            The dataset also supports two complementary tasks — <strong>rebound classification</strong> and{" "}
            <strong>rebound spotting</strong> — for which no comparable basketball datasets existed.
          </p>
        </Prose>
        <Figure src={`${B}/tasks.webp`} alt="Diagram of the four tasks: classification, spotting, offline and online anticipation" />
      </div>
    </Section>

    <Section id="method" label="Method" title="TEAM: a Transformer-Encoder Anticipation Model" wide>
      <Figure
        src={`${B}/team_arch.webp`}
        alt="TEAM architecture: X3D backbone, positional encoding and CLS token, Transformer encoder, MLP head"
        caption="A 3D CNN (X3D-M) extracts spatio-temporal features; a CLS token and positional encodings are added and a 2-layer Transformer encoder enriches the CLS token, which an MLP turns into OREB / DREB / background probabilities."
      />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          ["01", "3D CNN backbone", "A pre-trained X3D network extracts local spatio-temporal features from the clip efficiently."],
          ["02", "Temporal module", "A Transformer encoder with multi-head self-attention models long-range dependencies; a learnable CLS token aggregates them."],
          ["03", "Prediction head", "An MLP maps the refined CLS token to the probability of offensive rebound, defensive rebound or no rebound."],
        ].map(([n, t, d], i) => (
          <Reveal key={n} delay={i * 0.1} className="border-t border-foreground/10">
            <div className="-mt-px mb-4 h-0.5 w-12 bg-accent-orange" />
            <span className="font-mono text-xs text-text-muted">{n}</span>
            <h4 className="mt-1 text-lg font-medium">{t}</h4>
            <p className="mt-2 text-text-secondary leading-relaxed">{d}</p>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section id="humans" label="AI vs humans" title="How does the model compare with basketball experts?">
      <Reveal>
        <HumanVsAI />
      </Reveal>
    </Section>

    <Section id="interpretability" label="Interpretability" title="Where does the model look?">
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10 items-start">
        <Reveal>
          <CamSwitcher />
        </Reveal>
        <Prose className="text-base">
          <p>
            LayerCAM activation maps of models trained with different anticipation times, at the frame where each one
            peaks. Whatever ω<sub>a</sub> is, the strongest activations appear in the <strong>last two or three frames</strong>{" "}
            of the context: in such a fast game the final state matters most.
          </p>
          <p>
            Interestingly, the models do <strong>not track the ball</strong>. They focus on the shooter and on the players
            fighting for position — the same cues experts mention: shot distance, players inside the arc, box-outs and
            momentum towards the rim.
          </p>
        </Prose>
      </div>
    </Section>

    <Section id="videos" label="Videos" title="See it in motion" wide>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Reveal>
          <YouTube id="wOyMdw9xFMg" title="LayerCAM activation maps over a full sequence" />
        </Reveal>
        <Reveal delay={0.08}>
          <YouTube id="hCz_hlabfGc" title="Offensive rebound after multiple tips" />
        </Reveal>
        <Reveal delay={0.12}>
          <YouTube id="T1gsvP9BDuQ" title="Isolated defensive rebound" />
        </Reveal>
        <Reveal delay={0.16}>
          <YouTube id="KohsPS7Etyc" title="Box-out: the cue experts rely on" />
        </Reveal>
      </div>
    </Section>

    <Section id="citation" label="Citation">
      <BibTeX bibtex={pub.bibtex} />
    </Section>
  </PublicationLayout>
);

export default BasketballPublication;
