import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [dbVal, setDbVal] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDbVal(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);

  return dbVal;
};
