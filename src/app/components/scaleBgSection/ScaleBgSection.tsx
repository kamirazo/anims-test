'use client'

import {CSSProperties, ReactNode, useRef } from 'react'
import { motion, useScroll } from 'framer-motion'

import './ScaleBgSection.scss'

const ScaleBgSection = ({
  children,
}: {
  children: ReactNode
}) => {
  const scaleBgSectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: scaleBgSectionRef,
    offset: ["start end", "end end"]
  });
  
  return (
    <motion.section ref={scaleBgSectionRef} style={{ '--scale-bg-section-scroll-progress': (scrollYProgress) } as CSSProperties} className="scale-bg-section section">
      <div className="scale-bg-section__bg-image-wrapper">
        <img src="/img/testAnimImg.jpg" alt="" className="scale-bg-section__bg-image" />
      </div>
      {children}
    </motion.section>
  )
}

export default ScaleBgSection