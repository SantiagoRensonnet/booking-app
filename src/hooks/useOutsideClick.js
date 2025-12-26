import { useEffect, useRef } from "react";

/**
 * Custom React hook that triggers a callback when a click occurs
 * either outside or inside a referenced element.
 *
 * @param {Object} options
 * Hook configuration options.
 *
 * @param {Function} options.close
 * Callback function executed when the closing condition is met.
 *
 * @param {"self" | "outside"} [options.mode="outside"]
 * Determines what click should trigger `close`:
 * - `"outside"` (default): close when clicking outside the referenced element
 * - `"self"`: close when clicking directly on the referenced element itself
 *   (not on its children; useful for overlays/backdrops)
 *
 * @param {HTMLElement | React.RefObject<HTMLElement> | null} [options.triggerRef=null]
 * Optional element or ref that triggers the referenced element to appear
 * (e.g. a button opening a dropdown).
 * Clicks on this element will NOT trigger `close` when mode is `"outside"`.
 *
 * @returns {{ ref: React.RefObject<HTMLElement> }}
 * Object containing a `ref` to attach to the element being observed.
 *
 * Important:
 * - The component using this hook **must be mounted only when active**.
 *   This is especially relevant for nested components inside tables or lists.
 * - The hook registers a global `document` click listener (capture phase)
 *   and cleans it up automatically on unmount.
 */
export function useOutsideClick({
  close,
  mode = "outside",
  triggerRef = null,
}) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      const element = ref.current;
      if (!element) return;

      const clickedOnSelf = element === e.target;
      const clickedInside = element.contains(e.target);

      const triggerEl = triggerRef?.current ?? triggerRef;
      const clickedTrigger = triggerEl?.contains?.(e.target);

      if (
        (mode === "self" && clickedOnSelf) ||
        (mode === "outside" && !clickedInside && !clickedTrigger)
      ) {
        close();
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [close, mode, triggerRef]);

  return { ref };
}
