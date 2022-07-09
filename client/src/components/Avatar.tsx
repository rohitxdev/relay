import { useRef } from "react";

export default function Avatar(isTrue: { isTrue: Boolean }) {
  const avatarRef = useRef<HTMLImageElement | null>(null);
  const srcRef = useRef<string | null>(null);
  if (!srcRef.current) {
    fetch(`https://avatars.dicebear.com/api/bottts/${Math.trunc(Math.random() * 10e5)}.svg`)
      .then((response) => response.blob())
      .then((blob) => {
        srcRef.current = URL.createObjectURL(blob);
        if (avatarRef.current) {
          avatarRef.current.src = srcRef.current;
        }
      })
      .catch(() => {
        import("../assets/icons/user.png").then((src) => {
          srcRef.current = src.default;
          if (avatarRef.current) {
            avatarRef.current.src = srcRef.current;
          }
        });
      });
  }
  return isTrue && <img className="avatar-image" ref={avatarRef} src="" alt="" />;
}
