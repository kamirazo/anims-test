'use client'

import useScrollImageSequenceFramerCanvas from "@/app/hooks/useScrollImageSequenceFramerCanvas";
import { useMemo, useRef } from "react";

import './gallerySequence.scss'

const createImage = (src: string) => {
  const img = document.createElement('img');
  img.src = src;
  return img;
};

const handleDrawCanvas = (
  img: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
) => {
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

const GallerySequence = () => {
  const keyframes = useMemo(
    () =>
      [...new Array(215)].map((_, i) =>
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
    <section ref={containerRef} className="gallery-sequence">
      <div className="gallery-sequence-wrapper">
        <canvas ref={canvasRef} className="gallery-sequence__canvas" />
      </div>
    </section>
  );
};

export default GallerySequence