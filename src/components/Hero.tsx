import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

/**
 * Hook determinista para emular cadencia de escritura.
 * Utiliza estado derivado para garantizar inmunidad frente a Strict Mode y HMR.
 */
const useHumanTypewriter = (text: string, minDelay = 30, maxDelay = 150, startDelay = 800) => {
  // Single Source of Truth: Solo controlamos el índice escalar.
  const [currentIndex, setCurrentIndex] = useState(0);

  const graphemes = useMemo(() => {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text)).map((s) => s.segment);
  }, [text]);

  useEffect(() => {
    // Cláusula de guarda: detiene el ciclo de renderizado al consumir el array
    if (currentIndex >= graphemes.length) return;

    // Varianza estocástica
    const baseDelay = Math.random() * (maxDelay - minDelay) + minDelay;

    // Heurística de pausa iterada sobre el grafema *anterior* para simular comportamiento humano
    const previouslyTypedChar = currentIndex > 0 ? graphemes[currentIndex - 1] : "";
    const isPausePoint = /[\.\!\?\n]/.test(previouslyTypedChar);
    const nextDelay = isPausePoint ? baseDelay + 300 : baseDelay;

    const delay = currentIndex === 0 ? startDelay : nextDelay;

    // Aislamiento del timeout para asegurar su destrucción en la fase de cleanup
    const timeoutId = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, graphemes, minDelay, maxDelay, startDelay]);

  // Derivación pura: previene inyecciones de 'undefined' y desincronizaciones
  const displayedText = graphemes.slice(0, currentIndex).join("");
  const isDone = currentIndex >= graphemes.length;

  return { displayedText, isDone };
};

const Hero = () => {
  const FULL_TEXT = "hi! i'm arnau. welcome to my website\n✌🏼😁";
  const { displayedText, isDone } = useHumanTypewriter(FULL_TEXT);

  const renderTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <section className="h-full w-full flex flex-col justify-center items-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12 max-w-lg"
      >
        <p className="text-lg md:text-xl text-foreground leading-relaxed">
          <span className="font-mono tracking-tight">
            <span>{renderTextWithLineBreaks(displayedText)}</span>

            <motion.span
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{
                repeat: Infinity,
                duration: isDone ? 2.5 : 0.8,
                times: [0, 0.5, 0.5, 1]
              }}
              className="inline-block w-[1px] h-[1.1em] bg-foreground ml-1 align-middle"
            />
          </span>
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;