import { useEffect, useState } from "react";


export function useFontsReady() {

  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    // already loaded
    if (document.fonts.status === "loaded") {
      setFontsReady(true);
      return;
    }

    // wait for all fonts to finish loading
    document.fonts.ready.then(() => {
      setFontsReady(true);
    });
  }, []);

  return fontsReady;
  
}