'use client'

import { useEffect, useRef, useState } from "react"

import './videosSequence.scss'
import { useMotionValueEvent, useScroll } from "framer-motion"

const VideosSequence = () => {
  const videosSequenceWrapper = useRef<HTMLDivElement | null>(null)
  const videosRefs = useRef<Map<string, HTMLVideoElement> | null>(null)
  const contentsRefs = useRef<Map<string, HTMLDivElement> | null>(null)
  const previousVideoIndex = useRef<number>(0)
  const [currentVideo, setCurrentVideo] = useState<number>(0)
  const videosURLs = [
    '/video/test2.mp4',
    '/video/test3.mp4',
    '/video/test4.mp4',
    '/video/test5.mp4',
  ]
  const textContents = [
    'text1',
    'text2',
    'text3',
    'text4',
  ]

  const getVideosMap = () => {
    if (!videosRefs.current) {
      // Initialize the Map on first usage.
      videosRefs.current = new Map();
    }
    return videosRefs.current;
  }

  const getContentsMap = () => {
    if (!contentsRefs.current) {
      contentsRefs.current = new Map();
    }
    return contentsRefs.current;
  }

  const { scrollYProgress } = useScroll({
    target: videosSequenceWrapper,
    offset: ["start", "end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!videosRefs.current) return

    const scrollRatio = 1 / videosRefs.current.size
    const indexCalculation = Math.min(Math.floor(latest / scrollRatio), videosRefs.current.size -1)
    
    previousVideoIndex.current = indexCalculation

    const map = getVideosMap()
    const node = map.get(videosURLs[indexCalculation]);

    if (currentVideo !== previousVideoIndex.current) {
      setCurrentVideo(indexCalculation)

      if (!node) return

      node.loop = true
      node.play()
    }

    if (!node) return

    if (latest > indexCalculation + scrollRatio / 2) {
      node.playbackRate = 1 + (4 * latest)
    } else {
      node.playbackRate = 1
    }
  })

  return (
    <div className="videos-sequence" ref={videosSequenceWrapper}>
      {videosURLs.map((videoURL, index) => (
        <video
          className={`videos-sequence__video ${currentVideo === index ? 'videos-sequence__video--current' : ''}`}
          ref={(node) => {
            const map = getVideosMap();
            if (node) {
              map.set(videoURL, node);
            } else {
              map.delete(videoURL);
            }
          }}
          key={videoURL}>
          <source src={videoURL} type="video/mp4" />
        </video>
      ))}

      {textContents.map(content => (
        <div 
          className="videos-sequence__content"
          ref={(node) => {
            const map = getContentsMap();
            if (node) {
              map.set(content, node);
            } else {
              map.delete(content);
            }
          }}
          key={content}>
          {content}
        </div>
      ))}
    </div>
  )
}

export default VideosSequence