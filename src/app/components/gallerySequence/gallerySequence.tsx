'use client'

import useScrollImageSequenceFramerCanvas from "@/app/hooks/useScrollImageSequenceFramerCanvas";
import { CSSProperties, useMemo, useRef } from "react";

import './gallerySequence.scss'

const createImage = (src: string) => {
  if (typeof window === 'undefined') return

  const img = document.createElement('img');
  img.src = src;
  return img;
};

const handleDrawCanvas = (
  img: HTMLImageElement | undefined,
  ctx: CanvasRenderingContext2D,
) => {
  if (!img) return

  const canvas = ctx.canvas;
  const widthRatio = canvas.width / img.width;
  const heightRatio = canvas.height / img.height;
  const ratio = Math.max(widthRatio, heightRatio);
  const centerX = (canvas.width - img.width * ratio) / 2;
  const centerY = (canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerX,
    centerY,
    img.width * ratio,
    img.height * ratio,
  );
};

const imgSequenceLength = 215

const GallerySequence = () => {
  const keyframes = useMemo(
    () =>
      [...new Array(imgSequenceLength)].map((_, i) =>
        createImage(
          `https://www.apple.com/105/media/us/airpods-3rd-generation/2021/3c0b27aa-a5fe-4365-a9ae-83c28d10fa21/anim/spatial-audio/large/${i
            .toString()
            .padStart(4, '0')}.jpg`,
        ),
      ),
    [],
  );

  const containerRef = useRef<HTMLElement>(null);
  const [progress, canvasRef] = useScrollImageSequenceFramerCanvas({
    onDraw: handleDrawCanvas,
    keyframes: keyframes,
    scrollOptions: {
      target: containerRef,
      offset: ['start', 'end'],
    },
  });

  return (
    <section 
      ref={containerRef}
      className="gallery-sequence"
      style={{'--scrollable-height': `${imgSequenceLength * 20}px`} as CSSProperties}>
      <div className="gallery-sequence-wrapper">
        <canvas ref={canvasRef} className="gallery-sequence__canvas" />
      </div>
    </section>
  );
};

export default GallerySequence