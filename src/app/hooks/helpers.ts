import { useEffect, useState } from "react";

export const useDebounce = (value, delay) => {
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
