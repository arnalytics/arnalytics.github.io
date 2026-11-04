export interface Author {
  name: string;
  /** Marks the site owner so it can be highlighted. */
  me?: boolean;
  /** Equal contribution. */
  equal?: boolean;
}

export interface PublicationLink {
  label: string;
  href: string;
  kind: "pdf" | "doi" | "arxiv" | "code" | "video" | "poster";
}

export interface Publication {
  slug: string;
  title: string;
  shortTitle: string;
  authors: Author[];
  venue: string;
  venueShort: string;
  year: number;
  /** Month the work was published / presented, used to sort. */
  date: string;
  type: "Conference workshop" | "Journal article" | "Preprint";
  tags: string[];
  summary: string;
  thumbnail: string;
  thumbnailAlt: string;
  links: PublicationLink[];
  bibtex: string;
}

export const publications: Publication[] = [
  {
    slug: "football",
    title: "TraVIS: Combining Player Tracking and Video for Football Action Spotting",
    shortTitle: "TraVIS",
    authors: [
      { name: "Javier García Arias", equal: true },
      { name: "Artur Xarles", equal: true },
      { name: "Arnau Barrera-Roy", me: true },
      { name: "Sergio Escalera" },
      { name: "Thomas B. Moeslund" },
      { name: "Albert Clapés" },
    ],
    venue: "9th Int. Workshop on Multimedia Content Analysis in Sports (MMSports '26) at ACM Multimedia 2026",
    venueShort: "MMSports '26 · ACM MM",
    year: 2026,
    date: "2026-11",
    type: "Conference workshop",
    tags: ["action spotting", "multimodal fusion", "graph neural networks", "football"],
    summary:
      "Fusing panoramic video with a graph of player and ball tracking data improves football action spotting by +6.42 mAP@1s over a video-only model.",
    thumbnail: "/media/travis/edge_tactical.webp",
    thumbnailAlt: "Players on a pitch linked by tactical graph edges",
    links: [
      { label: "Paper", href: "/media/travis/TraVIS_MMSports26.pdf", kind: "pdf" },
      { label: "DOI", href: "https://doi.org/10.1145/3841455.3841521", kind: "doi" },
    ],
    bibtex: `@inproceedings{garcia2026travis,
  title     = {TraVIS: Combining Player Tracking and Video for Football Action Spotting},
  author    = {Garc{\\'i}a Arias, Javier and Xarles, Artur and Barrera-Roy, Arnau and
               Escalera, Sergio and Moeslund, Thomas B. and Clap{\\'e}s, Albert},
  booktitle = {Proceedings of the 9th International Workshop on Multimedia Content
               Analysis in Sports (MMSports '26)},
  year      = {2026},
  publisher = {ACM},
  address   = {Rio de Janeiro, Brazil},
  doi       = {10.1145/3841455.3841521}
}`,
  },
  {
    slug: "basketball",
    title: "See It Before You Grab It: Deep Learning-based Action Anticipation in Basketball",
    shortTitle: "See It Before You Grab It",
    authors: [{ name: "Arnau Barrera-Roy", me: true }, { name: "Albert Clapés" }],
    venue: "arXiv preprint arXiv:2512.15386",
    venueShort: "arXiv preprint",
    year: 2025,
    date: "2025-12",
    type: "Preprint",
    tags: ["action anticipation", "video understanding", "basketball", "dataset"],
    summary:
      "A 100K-clip NBA broadcast dataset and the first deep-learning baselines for anticipating who will win a rebound, before the ball is grabbed.",
    thumbnail: "/media/basketball/wa_1.0.webp",
    thumbnailAlt: "Broadcast frame of a basketball shot, one second before the rebound",
    links: [
      { label: "Paper", href: "https://arxiv.org/pdf/2512.15386", kind: "pdf" },
      { label: "arXiv", href: "https://arxiv.org/abs/2512.15386", kind: "arxiv" },
      { label: "Code", href: "https://github.com/arnalytics/labeled_plays_NBA", kind: "code" },
    ],
    bibtex: `@article{barrera2025seeitbeforeyougrabit,
  title   = {See It Before You Grab It: Deep Learning-based Action Anticipation in Basketball},
  author  = {Barrera-Roy, Arnau and Clap{\\'e}s, Albert},
  journal = {arXiv preprint arXiv:2512.15386},
  year    = {2025}
}`,
  },
  {
    slug: "bioimaging",
    title: "Revealing hidden bioimaging information by isotropic depolarization filtering",
    shortTitle: "Isotropic Depolarization Filtering",
    authors: [
      { name: "Mónica Canabal-Carbia" },
      { name: "Irene Estévez" },
      { name: "Emilio González-Arnay" },
      { name: "Ivan Montes-Gonzalez" },
      { name: "Jose J. Gil" },
      { name: "Arnau Barrera", me: true },
      { name: "Enrique García-Caurel" },
      { name: "Razvigor Ossikovski" },
      { name: "Ignacio Moreno" },
      { name: "Juan Campos" },
      { name: "Angel Lizana" },
    ],
    venue: "Optics & Laser Technology, vol. 188, 112956",
    venueShort: "Optics & Laser Technology",
    year: 2025,
    date: "2025-04",
    type: "Journal article",
    tags: ["polarimetry", "biomedical imaging", "Mueller matrices"],
    summary:
      "A polarimetric filter that removes isotropic depolarization and amplifies the anisotropic signal, unveiling hidden structures in heart and brain tissue.",
    thumbnail: "/media/bioimaging/heart_after.webp",
    thumbnailAlt: "Filtered polarimetric image of a lamb heart section",
    links: [
      { label: "Paper", href: "/1-s2.0-S003039922500547X-main.pdf", kind: "pdf" },
      { label: "DOI", href: "https://doi.org/10.1016/j.optlastec.2025.112956", kind: "doi" },
    ],
    bibtex: `@article{canabal2025revealing,
  title     = {Revealing hidden bioimaging information by isotropic depolarization filtering},
  author    = {Canabal-Carbia, M{\\'o}nica and Est{\\'e}vez, Irene and Gonz{\\'a}lez-Arnay, Emilio and
               Montes-Gonzalez, Ivan and Gil, Jose J. and Barrera, Arnau and Garc{\\'i}a-Caurel, Enrique and
               Ossikovski, Razvigor and Moreno, Ignacio and Campos, Juan and Lizana, Angel},
  journal   = {Optics \\& Laser Technology},
  volume    = {188},
  pages     = {112956},
  year      = {2025},
  publisher = {Elsevier},
  doi       = {10.1016/j.optlastec.2025.112956}
}`,
  },
];

export const getPublication = (slug: string) => publications.find((p) => p.slug === slug)!;
