import { useAnimation } from "framer-motion";

export const useCustomAnimations = () => {
  const controls = useAnimation();

  const shake = () => {
    controls.start({
      rotate: [0, 3, -3, 3, 0],
      transition: { duration: 0.4 },
    });
  };

  return { shake, controls };
};
