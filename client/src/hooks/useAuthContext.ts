import { useContext } from "react";
import { AuthContext } from "@context";

export function useAuthContext() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Auth context is null.");
  }
  return authContext;
}
