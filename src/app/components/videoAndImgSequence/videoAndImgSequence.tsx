'use client'

import { CSSProperties, useEffect, useRef } from "react"
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import GallerySequence from "../gallerySequence/gallerySequence"

import './videoAndImgSequence.scss'

const VideoAndImgSequence = ({videoURL, imgSequencePath}: {
  videoURL: string
  imgSequencePath: string
}) => {
  const imgSequenceWrapper = useRef<HTMLDivElement | null>(null)
  const videoSequenceWrapper = useRef<HTMLDivElement | null>(null)
  const videoElement = useRef<HTMLVideoElement | null>(null)

  const imgSequenceisInView = useInView(imgSequenceWrapper, {
    margin: "0px 0px -100% 0px"
  })

  const { scrollYProgress } = useScroll({
    target: videoSequenceWrapper,
    offset: ["start", "end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!videoElement.current) return

    if (latest > .5) {
      videoElement.current.playbackRate = 1 + (10 * (latest - .5))
    } else {
      videoElement.current.playbackRate = 1
    }
  })

  const translateY = useTransform(
    scrollYProgress,
    [.5, .6, .7],
    ['100%', '0%', '-100%']
  )

  useEffect(() => {
    if (!videoElement.current) return
    
    if (imgSequenceisInView) {
      videoElement.current.pause()
    } else {
      videoElement.current.play()
    }
  }, [imgSequenceisInView])

  return (
    <div className="video-and-img-sequence">
      <div
        className={`video-and-img-sequence__video-wrapper ${imgSequenceisInView ? 'video-and-img-sequence__video-wrapper--hidden' : ''}`}
        ref={videoSequenceWrapper}>
        <video 
          autoPlay={!imgSequenceisInView}
          loop={!imgSequenceisInView}
          className="video-and-img-sequence__video"
          ref={videoElement}>
          <source src={videoURL} type="video/mp4" />
        </video>
      </div>

      <div className="video-and-img-sequence__img-sequence-wrapper" ref={imgSequenceWrapper}>
        <GallerySequence imgSequencePath={imgSequencePath} />
      </div>
      
      <div className="video-and-img-sequence__content">
        <motion.div 
          className="video-and-img-sequence__content__item-wrapper"
          style={{
            '--translateY': translateY
          } as CSSProperties}>
          <div className="video-and-img-sequence__content__item">Lorem Ipsum</div>
        </motion.div>
      </div>
    </div>
  )
}

export default VideoAndImgSequence