import PublicationLayout from "@/components/publication/PublicationLayout";
import BeforeAfter from "@/components/publication/BeforeAfter";
import { BibTeX, Figure, Prose, Reveal, Section, StatGrid } from "@/components/publication/primitives";
import { getPublication } from "@/data/publications";

const pub = getPublication("bioimaging");
const B = "/media/bioimaging";

const Term = ({ w, sub, children }: { w: string; sub?: string; children?: string }) => (
  <span className="whitespace-nowrap">
    {w}
    {sub && <sub>{sub}</sub>}
    {children}
  </span>
);

const BioimagingPublication = () => (
  <PublicationLayout
    pub={pub}
    eyebrow="Optics & Laser Technology · 2025"
    note="Grup d'Òptica, Universitat Autònoma de Barcelona and collaborators — open access (CC BY 4.0)"
    visual={
      <div className="mx-auto max-w-4xl">
        <BeforeAfter
          before={`${B}/heart_before.webp`}
          after={`${B}/heart_after.webp`}
          beforeLabel="P₁ · raw"
          afterLabel="P′₁ · filtered"
          alt="Transverse section of a lamb heart"
          aspect={518 / 456}
          className="shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]"
        />
        <p className="mt-3 text-center text-sm text-text-muted">
          Drag to compare. Lamb heart section before and after the isotropic depolarization filter.
        </p>
      </div>
    }
    toc={[
      { id: "tldr", label: "TL;DR" },
      { id: "method", label: "Method" },
      { id: "heart", label: "Heart" },
      { id: "brain", label: "Brain" },
      { id: "citation", label: "Citation" },
    ]}
  >
    <Section id="tldr" label="TL;DR" title="Removing what blurs the picture to reveal what matters">
      <Prose>
        <p>
          When light crosses biological tissue it becomes partly depolarized. <strong>Isotropic</strong> depolarization
          destroys polarimetric information, while <strong>anisotropic</strong> depolarization is linked to the intrinsic
          structure of the sample — collagen, muscle and nerve fibres. In soft tissues the first often masks the second.
        </p>
        <p>
          We propose the <strong>Isotropic Depolarization Filter (IDF)</strong>: a simple operation on the measured Mueller
          matrix that removes the isotropic part and amplifies the anisotropic one, unveiling structures in heart and brain
          tissue that are invisible in intensity images.
        </p>
      </Prose>
      <div className="mt-12">
        <StatGrid
          items={[
            { value: 2, label: "tissues analysed: lamb heart and cattle brain" },
            { value: 625, suffix: " nm", label: "heart illumination wavelength" },
            { value: 470, suffix: " nm", label: "brain illumination wavelength" },
            { value: 7, label: "white-matter tracts revealed in the brain section", highlight: true },
          ]}
        />
      </div>
    </Section>

    <Section id="method" label="Method" title="One subtraction on the Mueller matrix">
      <Prose>
        <p>
          The characteristic decomposition writes any Mueller matrix <em>M</em> as a weighted sum of four components whose
          weights are given by the <strong>Indices of Polarimetric Purity</strong> (P<sub>1</sub>, P<sub>2</sub>,
          P<sub>3</sub>). The last term is a perfect depolarizer weighted by (1 − P<sub>3</sub>): the isotropic part.
        </p>
      </Prose>

      <Reveal className="my-10 overflow-x-auto rounded-xl border border-foreground/10 bg-white px-6 py-8 text-center font-serif text-lg md:text-2xl text-foreground">
        <div className="whitespace-nowrap">
          <i>M</i> = <Term w="P" sub="1" /> <i>m</i>
          <sub>00</sub>
          <i>M̂</i>
          <sub>J0</sub> + (<Term w="P" sub="2" /> − <Term w="P" sub="1" />) <i>m</i>
          <sub>00</sub>
          <i>M̂</i>
          <sub>1</sub> + (<Term w="P" sub="3" /> − <Term w="P" sub="2" />) <i>m</i>
          <sub>00</sub>
          <i>M̂</i>
          <sub>2</sub> +{" "}
          <span className="rounded bg-accent-orange/15 px-1.5 py-0.5">
            (1 − <Term w="P" sub="3" />) <i>m</i>
            <sub>00</sub>
            <i>M̂</i>
            <sub>3</sub>
          </span>
        </div>
        <div className="mt-6 whitespace-nowrap text-text-secondary">
          <i>M</i>
          <sub>a</sub> = <i>M</i> −{" "}
          <span className="rounded bg-accent-orange/15 px-1.5 py-0.5 text-foreground">
            (1 − <Term w="P" sub="3" />) <i>m</i>
            <sub>00</sub>
            <i>M̂</i>
            <sub>3</sub>
          </span>
          <span className="ml-4 font-sans text-sm text-text-muted">with M̂₃ = diag(1, 0, 0, 0)</span>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          ["01", "Decompose", "Measure the Mueller matrix of each pixel and compute its indices of polarimetric purity."],
          ["02", "Filter", "Subtract the isotropic term (1 − P₃)·m₀₀·M̂₃, the perfect-depolarizer component, from M."],
          [
            "03",
            "Reconstruct",
            "Recompute observables (P₁, diattenuation D, polarizance…) from the filtered matrix. The effect is equivalent to dividing them by P₃, amplifying regions hidden by isotropic depolarization.",
          ],
        ].map(([n, t, d], i) => (
          <Reveal key={n} delay={i * 0.1} className="border-t border-foreground/10">
            <div className="-mt-px mb-4 h-0.5 w-12 bg-accent-orange" />
            <span className="font-mono text-xs text-text-muted">{n}</span>
            <h4 className="mt-1 text-lg font-medium">{t}</h4>
            <p className="mt-2 text-text-secondary leading-relaxed">{d}</p>
          </Reveal>
        ))}
      </div>

      <Figure
        className="mt-14"
        src={`${B}/anatomy.webp`}
        alt="Anatomical drawings of a heart, a coronary vessel and a coronal brain section"
        caption="Anatomical context of the samples: (a, b) transverse section of the heart, (c) a coronary vessel and (d) a coronal section of the brain."
      />
    </Section>

    <Section id="heart" label="Results · heart" title="Myocardium, subendocardium and epicardium, finally apart" wide>
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-start">
        <Reveal>
          <BeforeAfter
            before={`${B}/heart_before.webp`}
            after={`${B}/heart_after.webp`}
            beforeLabel="P₁"
            afterLabel="P′₁ (IDF)"
            alt="Lamb heart polarimetric image"
            aspect={518 / 456}
          />
        </Reveal>
        <div>
          <Prose className="text-base">
            <p>
              In a transverse section of an ex-vivo lamb heart, the filtered image draws clear boundaries between the
              concentric fascicles of the <strong>myocardium</strong> (1) and the loose connective tissue of the{" "}
              <strong>subendocardium</strong> (2). The <strong>epicardium</strong> (dashed line) becomes visible, although it
              was almost invisible in both the intensity and the raw P<sub>1</sub> images.
            </p>
            <p>The filter also allows following subepicardial coronary vessels and separating their walls from their lumen.</p>
          </Prose>
          <Figure
            className="mt-8"
            src={`${B}/heart_purity.webp`}
            alt="Purity space showing two clusters before and after filtering"
            caption="In the Purity Space, myocardial (red) and subendocardial (blue) pixels collapse together before filtering and separate clearly after it — useful for tissue classification."
          />
        </div>
      </div>
    </Section>

    <Section id="brain" label="Results · brain" title="White-matter tracts emerge from the diattenuation channel" wide>
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-start">
        <Reveal>
          <BeforeAfter
            before={`${B}/brain_before.webp`}
            after={`${B}/brain_after.webp`}
            beforeLabel="D"
            afterLabel="D′ (IDF)"
            alt="Coronal section of a cattle brain"
            aspect={581 / 451}
          />
        </Reveal>
        <div>
          <Prose className="text-base">
            <p>
              In a coronal section across the frontal lobe of an ex-vivo cattle brain, applying the IDF to the{" "}
              <strong>diattenuation</strong> channel unveils the architecture of the white matter: long interhemispheric
              fibres and short U-shaped fibres (tracts 3–9) become distinct.
            </p>
            <p>
              This offers an ethically viable, non-destructive proxy to study connectivity, and opens the door to optical
              protocols for the early detection of myocardial changes or neuropathies.
            </p>
          </Prose>
          <Figure
            className="mt-8"
            src={`${B}/brain_cp.webp`}
            alt="CP space showing two fibre-tract clusters before and after filtering"
            caption="Two fibre tracts with different orientation, before and after filtering, in the CP space."
          />
        </div>
      </div>
      <p className="mt-10 text-xs text-text-muted">
        Figures adapted from Canabal-Carbia et al., Optics &amp; Laser Technology 188 (2025) 112956, under CC BY 4.0.
      </p>
    </Section>

    <Section id="citation" label="Citation">
      <BibTeX bibtex={pub.bibtex} />
    </Section>
  </PublicationLayout>
);

export default BioimagingPublication;
