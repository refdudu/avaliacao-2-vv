import { useEffect } from "react";

export const useClickoutSide = (
  condition: boolean,
  callback: () => void,
  ref: React.RefObject<HTMLDivElement | HTMLLIElement | null>
) => {
  useEffect(() => {
    if (!condition || !ref.current) return;

    const handleClickOutside = (event: MouseEvent) => {
      console.log("click outside");
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [condition, callback]);
};
