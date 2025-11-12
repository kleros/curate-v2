import { useMemo } from "react";
import { useWindowSize } from "react-use";

const useIsDesktop = () => {
  const { width } = useWindowSize();
  return useMemo(() => width > 900, [width]);
};

export default useIsDesktop;
