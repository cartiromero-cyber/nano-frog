'use client';
import { useEffect, useState } from "react";

/** Returns true once the image at `src` has loaded successfully; false otherwise.
 *  Loading-safe: never throws, never shows a broken image — callers render the
 *  procedural fallback until this flips true. */
export function useAssetReady(src?: string): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!src) { setOk(false); return; }
    let live = true;
    const img = new Image();
    img.onload = () => { if (live) setOk(true); };
    img.onerror = () => { if (live) setOk(false); };
    img.src = src;
    return () => { live = false; };
  }, [src]);
  return ok;
}
