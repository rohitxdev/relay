import { useState, useEffect } from "react";

export function useError(): [string | null, React.Dispatch<React.SetStateAction<string | null>>] {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  }, [error]);

  return [error, setError];
}
