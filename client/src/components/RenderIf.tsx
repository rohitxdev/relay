import { ReactElement } from "react";

export default function RenderIf({
  children,
  isTrue,
  Else,
}: {
  children: ReactElement;
  isTrue: Boolean;
  Else?: ReactElement;
}) {
  return isTrue && children;
}
