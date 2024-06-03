'use client'

import {CSSProperties, ReactNode, useEffect, useRef } from 'react'
import Image from "next/image"
import { motion, useInView, useScroll } from 'framer-motion'

import './ImgTextSection.scss'

interface ImgTextSectionProps {
  image?: {
    alt?: string
    url: string
  }
  title?: string
  content?: ReactNode
}

const ImgTextSection = ({
  image,
  title,
  content
}: 
  ImgTextSectionProps
) => {
  const imgTextSectionRef = useRef(null)
  const imgTextSectionGridRef = useRef(null)
  const isInView = useInView(imgTextSectionGridRef, {amount: .5})

  const { scrollYProgress } = useScroll({
    target: imgTextSectionRef,
    offset: ["start 75%", "end end"]
  });
  
  return (
    <motion.section
      ref={imgTextSectionRef}
      style={{ '--img-text-section-scroll-progress': (scrollYProgress) } as CSSProperties}
      className="img-text-section section section--no-padding section--center-content">
      <div className='grid grid--halves grid--no-gutter' ref={imgTextSectionGridRef}>
        {(title || content) && (
          <motion.div className={`img-text-section__content ${isInView ? 'img-text-section__content--in-view' : ''}`}>
            {title}
            {content}
          </motion.div>
        )}

        {image?.url && (
          <img src={image.url}
            width={1920}
            height={1080}
            alt={image.alt ?? ''}
            className="img-text-section__image" />
        )}
      </div>
    </motion.section>
  )
}

export default ImgTextSection