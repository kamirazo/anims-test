'use client'

import { useRef, useState, CSSProperties, useEffect } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

import './videoOnScrollSection.scss'
import SectionTitle from '../sectionTitle/sectionTitle'
import AnimatedList from '../animatedList/AnimatedList'

type SubComponentSettings = {
  animType?: 'glowing' | 'translateY'
  posX?: string
  posY?: string
  start?: number
  duration?: number
  fixed: boolean
}

type AnimatedListSubComponent = {
  componentID: 'AnimatedList',
  listItems: string[]
}

type SectionTitleSubComponent = {
  componentID: 'SectionTitle',
  titleContent: string,
  subtitle?: string,
  titleTag?: keyof HTMLElementTagNameMap
}

type VideoOnScrollContent = {
  content: string | AnimatedListSubComponent | SectionTitleSubComponent,
  settings?: SubComponentSettings
}

interface VideoOnScrollSectionProps {
  videoURL: string
  playbackSpeed?: number
  content?: VideoOnScrollContent[]
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
      <div className={`${timelineClass(true, componentContent.settings?.fixed ?? false)} ${componentContent.settings?.posX} ${componentContent.settings?.posY}`}>
        <div>{componentContent.content}</div>
      </div>
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
        <div className={`${timelineClass(true, componentContent.settings?.fixed ?? false)} ${componentContent.settings?.posX} ${componentContent.settings?.posY}`}>
          <AnimatedList 
            listItems={componentContent.content.listItems ?? []} />
        </div>
      )
    default:
      return (
        <div className={`${timelineClass(true, componentContent.settings?.fixed ?? false)} ${componentContent.settings?.posX} ${componentContent.settings?.posY}`}>
          <div>{componentContent.content}</div>
        </div>
      )
  }
}

const VideoOnScrollSection = ({
  videoURL,
  playbackSpeed = 500,
  content
}: VideoOnScrollSectionProps) => {
  const videoOnScrollWrapper = useRef<HTMLElement | null>(null)
  const videoElement = useRef<HTMLVideoElement | null>(null)
  const [scrollHeight, setScrollHeight] = useState<number>(0)
  const [contentVisibility, setContentVisibility] = useState<boolean>(true)
  const [scrollTimeline, setScrollTimeline] = useState<number>(0)
  
  const { scrollYProgress } = useScroll({
    target: videoOnScrollWrapper,
    offset: ["start", "end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollTimeline(latest)

    if (latest < .5) {
      setContentVisibility(true)
    } else {
      setContentVisibility(false)
    }

    if (!videoElement.current?.duration || window.scrollY === 0) return

    videoElement.current.currentTime = latest * videoElement.current?.duration
  })

  useEffect(() => {
    const videoRef = videoElement.current
    
    const handleSectionHeight = () => {
      const videoDuration = videoRef?.duration ?? 1
      setScrollHeight(videoDuration * playbackSpeed)
    }

    handleSectionHeight()
    videoRef?.addEventListener('loadedmetadata', handleSectionHeight)
    
    return () => {
      videoRef?.removeEventListener('loadedmetadata', handleSectionHeight)
    }
  }, [playbackSpeed])
  
  return (
    <section ref={videoOnScrollWrapper}
      className="video-on-scroll"
      style={{'--scrollableHeight': `${scrollHeight}px`} as CSSProperties}>
      <div className="video-on-scroll-wrapper">
        <video className="video-on-scroll__video"
          ref={videoElement}>
          <source src={videoURL} type="video/mp4" />
        </video>
        
        {content && (
          <div className={`video-on-scroll__content ${!contentVisibility ? 'video-on-scroll__content--fade-out' : ''}`}>
            <div className={timelineClass(true, false)}>
              {content.map((currentContent, index) => (
                <div key={index}
                  className={timelineItemStatus(
                    scrollTimeline,
                    currentContent.settings?.start,
                    currentContent.settings?.duration)}
                  style={{
                    '--scrollValue': scrollTimeline,
                    '--start': currentContent.settings?.start,
                    '--duration': currentContent.settings?.duration
                  } as CSSProperties}>
                  
                  { returnContentComponent(currentContent) }
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default VideoOnScrollSection