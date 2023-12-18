'use client'

import {CSSProperties, ReactNode, useRef } from 'react'
import Image from "next/image"
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
      <Image src="/img/testAnimImg.png" fill alt="" className="scale-bg-section__bg-image" />
      {children}
    </motion.section>
  )
}

export default ScaleBgSection