import {
  type SpringOptions,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';

export interface UseScrollImageSequenceFramerCanvasProps {
  onDraw: (img: HTMLImageElement | undefined, ctx: CanvasRenderingContext2D) => void;
  keyframes: (HTMLImageElement | undefined)[];
  scrollOptions?: Parameters<typeof useScroll>[0];
  springConfig?: SpringOptions;
}

const useScrollImageSequenceFramerCanvas = ({
  onDraw,
  keyframes,
  scrollOptions,
  springConfig = {
    damping: 50,
    stiffness: 300,
    restSpeed: 0.5,
    restDelta: 0.001,
  },
}: UseScrollImageSequenceFramerCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll(scrollOptions);
  const progress = useSpring(scrollYProgress, springConfig);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const renderImage = useCallback(
    (progress: number) => {
      const constraint = (n: number, min = 0, max = keyframes.length - 1) =>
        Math.min(Math.max(n, min), max);
      onDraw(
        keyframes[constraint(Math.round(keyframes.length * progress))],
        canvasRef.current!.getContext('2d')!,
      );
    },
    [keyframes, onDraw],
  );

  useEffect(() => {
    resizeCanvas();
    const resizeCanvasAndRerender = () => {
      resizeCanvas();
      renderImage(progress.get());
    };
    window.addEventListener('resize', resizeCanvasAndRerender);
    return () => {
      window.removeEventListener('resize', resizeCanvasAndRerender);
    };
  }, [progress, renderImage, resizeCanvas]);

  useEffect(() => {
    if (keyframes?.[0]) {
      keyframes[0].onload = () => {
        onDraw(keyframes[0], canvasRef.current!.getContext('2d')!);
      };
    }
  }, [keyframes, onDraw]);

  useMotionValueEvent(progress, 'change', renderImage);

  return [progress, canvasRef] as const;
};

export default useScrollImageSequenceFramerCanvas;