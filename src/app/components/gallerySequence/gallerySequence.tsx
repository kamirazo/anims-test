'use client'

import useScrollImageSequenceFramerCanvas from "@/app/hooks/useScrollImageSequenceFramerCanvas";
import { CSSProperties, useMemo, useRef } from "react";

import './gallerySequence.scss'
import SectionTitle from "../sectionTitle/sectionTitle";
import AnimatedList from "../animatedList/AnimatedList";
import { motion, useTransform } from "framer-motion";

type SubComponentSettings = {
  animType?: 'glowing' | 'translateY'
  posX?: string
  posY?: string
  start?: number
  duration?: number
  fixed: boolean
}

type AnimatedListSubComponent = {
  componentID: 'AnimatedList'
  listItems: string[]
}

type SectionTitleSubComponent = {
  componentID: 'SectionTitle'
  titleContent: string
  subtitle?: string
  titleTag?: keyof HTMLElementTagNameMap
}

type VideoOnScrollContent = {
  content: string | AnimatedListSubComponent | SectionTitleSubComponent
  settings?: SubComponentSettings
}

const timelineClass = (isFixed: boolean, isItem: boolean) => {
  let classname = 'timeline'

  if (isFixed) {
    classname = `fixed-${classname}`
  }

  if (isItem) {
    classname = `${classname}__item`
  }

  return classname
}

const timelineItemStatus = (
  currentScroll: number,
  scrollStart?: number,
  scrollDuration?: number) => {
  if (scrollStart === undefined || scrollDuration === undefined || currentScroll < scrollStart) return ''

  if (currentScroll > scrollStart + scrollDuration) return 'passed'

  if (currentScroll > scrollStart) return 'displayed'
}

const returnContentComponent = (componentContent: VideoOnScrollContent) => {
  if (typeof componentContent.content === 'string') {
    return (
      <div>{componentContent.content}</div>
    )
  }

  switch (componentContent.content.componentID) {
    case 'SectionTitle':
      return (
        <SectionTitle 
          titleTag={componentContent.content.titleTag} 
          titleContent={componentContent.content.titleContent ?? ''} 
          animType={componentContent.settings?.animType} 
          subtitleContent={componentContent.content.subtitle ?? ''}  />
      )
    case 'AnimatedList':
      return (
        <AnimatedList 
          listItems={componentContent.content.listItems ?? []} />
      )
    default:
      return (
        <div>{componentContent.content}</div>
      )
  }
}

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

const GallerySequence = ({content}: {
  content?: VideoOnScrollContent[]
}) => {
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

  const maskStarts = content?.map(contentItem => (contentItem?.settings?.start ?? 0))
  const maskPos = content?.map(contentItem => {
    switch (contentItem?.settings?.posY) {
      case 'start':
        return '0'
      case 'center':
        return '0'
      case 'end':
        return '50vh'
      default:
        return '';
    }
  })
  const maskHeights = content?.map(contentItem => {
    switch (contentItem?.settings?.posY) {
      case 'start':
        return '50vh'
      case 'center':
        return '100vh'
      case 'end':
        return '50vh'
      default:
        return '';
    }
  })

  const maskTop = useTransform(
    progress,
    maskStarts ?? [0, 1],
    maskPos ?? ['', '']
  )
  
  const maskComputedHeights = useTransform(
    progress,
    maskStarts ?? [0, 1],
    maskHeights ?? ['', '']
  )

  return (
    <section 
      ref={containerRef}
      className="gallery-sequence"
      style={{'--scrollable-height': `${imgSequenceLength * 20}px`} as CSSProperties}>
      <div className="gallery-sequence-wrapper">
        <canvas ref={canvasRef} className="gallery-sequence__canvas" />
      </div>

      {content && (
        <div className="gallery-sequence__content">
          <motion.div className="timeline__mask" style={{
            '--scrollValue': progress,
            '--maskTop': maskTop,
            '--maskHeight': maskComputedHeights
            } as CSSProperties}>
            <div className={timelineClass(false, false)}>
              {content.map((currentContent, index) => (
                <motion.div key={index}
                  className={`timeline__item ${currentContent.settings?.posX}-x ${currentContent.settings?.posY}-y`}
                  // className={timelineItemStatus(
                  //   progress,
                  //   currentContent.settings?.start,
                  //   currentContent.settings?.duration)}
                  style={{
                    '--start': currentContent.settings?.start,
                    '--duration': currentContent.settings?.duration
                  } as CSSProperties}>
                  
                  { returnContentComponent(currentContent) }
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default GallerySequence