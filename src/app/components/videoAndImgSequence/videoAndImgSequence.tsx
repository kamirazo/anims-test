'use client'

import { CSSProperties, useEffect, useRef, useState } from "react"
import { MotionValue, motion, useInView, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import GallerySequence from "../gallerySequence/gallerySequence"

import './videoAndImgSequence.scss'
import SectionTitle from "../sectionTitle/sectionTitle"
import AnimatedList from "../animatedList/AnimatedList"

type SubComponentSettings = {
  animType?: 'glowing' | 'translateY'
  posX?: string
  posY?: string
  start?: number
  end?: number
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

type OnScrollContent = {
  content: string | AnimatedListSubComponent | SectionTitleSubComponent
  settings?: SubComponentSettings
}

const returnContentComponent = (componentContent: OnScrollContent) => {
  if (typeof componentContent.content === 'string') {
    return (
      componentContent.content
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
        componentContent.content
      )
  }
}

const TimelineItem = ({item, scrollYProgress} : 
  {
    item:OnScrollContent
    scrollYProgress: MotionValue<number>
  }) => {
  const start = item.settings?.start ?? 0
  const end = item.settings?.end ?? 1
  const middle = (start + end) / 2
  
  const itemTranslateY = useTransform(
    scrollYProgress,
    [start, middle, end],
    [
      start === 0 ? '0%' : '100%',
      '0%',
      '-100%'
    ]
  )
  
  const wrapperTop = useTransform(
    scrollYProgress,
    [start - .0001, start],
    [
      '100%',
      '50%'
    ]
  )

  return (
    <motion.div 
      className="video-and-img-sequence__content__item-wrapper"
      style={{
        '--itemTranslateY': itemTranslateY,
        '--wrapperTop': wrapperTop,
      } as CSSProperties}>
      <div className="video-and-img-sequence__content__item">
        {returnContentComponent(item)}
      </div>
    </motion.div>
  )
}

const VideoAndImgSequence = ({videoURL, imgSequencePath, content}: {
  videoURL: string
  imgSequencePath: string
  content?: OnScrollContent[]
}) => {
  const globalWrapper = useRef<HTMLDivElement | null>(null)
  const imgSequenceWrapper = useRef<HTMLDivElement | null>(null)
  const videoSequenceWrapper = useRef<HTMLDivElement | null>(null)
  const videoElement = useRef<HTMLVideoElement | null>(null)

  const imgSequenceisInView = useInView(imgSequenceWrapper, {
    margin: "0px 0px -100% 0px"
  })

  const { scrollYProgress: scrollYProgressVideo } = useScroll({
    target: videoSequenceWrapper,
    offset: ["start", "end"]
  });

  const { scrollYProgress: scrollYProgressGlobal } = useScroll({
    target: globalWrapper,
    offset: ["start", "end"]
  });
  

  useMotionValueEvent(scrollYProgressVideo, "change", (latest) => {
    if (!videoElement.current) return

    if (latest > .5) {
      videoElement.current.playbackRate = 1 + (10 * (latest - .5))
    } else {
      videoElement.current.playbackRate = 1
    }
  })

  useEffect(() => {
    if (!videoElement.current) return
    
    if (imgSequenceisInView) {
      videoElement.current.pause()
    } else {
      videoElement.current.play()
    }
  }, [imgSequenceisInView])

  return (
    <div className="video-and-img-sequence" ref={globalWrapper}>
      <div
        className={`video-and-img-sequence__video-wrapper ${imgSequenceisInView ? 'video-and-img-sequence__video-wrapper--hidden' : ''}`}
        ref={videoSequenceWrapper}>
        <video 
          autoPlay={!imgSequenceisInView}
          loop={!imgSequenceisInView}
          muted
          className="video-and-img-sequence__video"
          ref={videoElement}>
          <source src={videoURL} type="video/mp4" />
        </video>
      </div>

      <div className="video-and-img-sequence__img-sequence-wrapper" ref={imgSequenceWrapper}>
        <GallerySequence imgSequencePath={imgSequencePath} />
      </div>
      
      {content && (
        <div className="video-and-img-sequence__content">
          {content.map((currentContent, index) => (
            <TimelineItem 
              key={index}
              item={currentContent}
              scrollYProgress={scrollYProgressGlobal} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoAndImgSequence