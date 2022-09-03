import { useEffect, useState } from "react";

export function useToggleFullscreen(element: HTMLElement | null): [boolean, () => void] {
  const [isFullscreen, setIsFullScreen] = useState(false);
  const toggleFullscreen = () => {
    setIsFullScreen((prevState) => !prevState);
  };
  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element?.requestFullscreen().catch((err) => {
        if (err instanceof Error) {
          console.error(err.name, err.message);
        }
      });
    }
  }, [isFullscreen]);

  return [isFullscreen, toggleFullscreen];
}
