import { useEffect } from "react";

const SITE = "Arnau Barrera-Roy";

/** Sets the document title and meta description for the current page. */
export const usePageMeta = (title?: string, description?: string) => {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} · PhD student in AI`;
    if (description) {
      const tag = document.querySelector('meta[name="description"]');
      tag?.setAttribute("content", description);
    }
  }, [title, description]);
};
