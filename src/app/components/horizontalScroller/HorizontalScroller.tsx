'use client'

import { ReactNode, useRef, useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

import './HorizontalScroller.scss'

const HorizontalScroller = ({
  children,
}: {
  children: ReactNode
}) => {
  const horizontalScrollerRef = useRef<HTMLDivElement | null>(null)
  const horizontalScrollerViewportRef = useRef<HTMLElement | null>(null)
  const [horizontalScrollerViewportWidth, setHorizontalScrollerViewportWidth] = useState<number>(0)
  const [horizontalScrollerTranslateValue, setHorizontalScrollerTranslateValue] = useState<number>(0)
  
  const { scrollYProgress } = useScroll({
    target: horizontalScrollerViewportRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setHorizontalScrollerTranslateValue(latest * (horizontalScrollerViewportWidth - window.innerWidth) * -1)
  })

  useEffect(() => {
    if (!horizontalScrollerRef.current) return

    setHorizontalScrollerViewportWidth(horizontalScrollerRef?.current?.scrollWidth)
  }, [])

  return (
    <section ref={horizontalScrollerViewportRef}
      className="horizontal-scroller-viewport"
      style={{'--horizontal-scroller-height': `${horizontalScrollerViewportWidth}px`}}>
      <div className="horizontal-scroller-viewport__inner">
        <motion.div
          className="horizontal-scroller"
          style={{ '--horizontal-scroller-translate': `${horizontalScrollerTranslateValue}px`}}
          ref={horizontalScrollerRef}>
          {children}
        </motion.div>
      </div>
    </section>
  )
}

export default HorizontalScroller
