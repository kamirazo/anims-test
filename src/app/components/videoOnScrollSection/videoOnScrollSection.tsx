'use client'

import { ReactNode, useRef, useState, Children, CSSProperties, useEffect, Fragment } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

import './videoOnScrollSection.scss'


export default function VideoOnScrollSection({
  videoURL,
  children,
  playbackSpeed = 500
}: {
  videoURL: string,
  children: ReactNode
  playbackSpeed?: number
}) {
  const videoOnScrollWrapper = useRef<HTMLElement | null>(null)
  const videoElement = useRef<HTMLVideoElement | null>(null)
  const [scrollHeight, setScrollHeight] = useState<number>(0)
  const [contentVisibility, setContentVisibility] = useState<boolean>(true)
  
  const { scrollYProgress } = useScroll({
    target: videoOnScrollWrapper,
    offset: ["start center", "end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
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

        <div className={`video-on-scroll__content ${!contentVisibility ? 'video-on-scroll__content--fade-out' : ''}`}>
          {Children.map(children, (child, index) => (
            <Fragment key={index}>
              {child}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}