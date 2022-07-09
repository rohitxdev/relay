import { useRef } from "react";

export default function useAvatar() {
  const srcRef = useRef<string | null>(null);
  if (!srcRef.current) {
    fetch(`https://avatars.dicebear.com/api/bottts/${Math.trunc(Math.random() * 10e5)}.svg`)
      .then((response) => response.blob())
      .then((blob) => {
        srcRef.current = URL.createObjectURL(blob);
      })
      .catch(() => {
        srcRef.current = "../assets/icons/user.png";
      });
  }
  return srcRef.current;
}
