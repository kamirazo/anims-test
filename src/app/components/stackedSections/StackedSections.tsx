'use client'

import { ReactNode, useRef, useState, Children, CSSProperties } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

import './StackedSections.scss'

export default function StackedSections({
  children,
}: {
  children: ReactNode
}) {
  const stackedSectionsViewportRef = useRef<HTMLElement | null>(null)
  const childrenLength = useRef(Children.count(children))
  const [activeSection, setActiveSection] = useState<number>(0)
  
  const { scrollYProgress } = useScroll({
    target: stackedSectionsViewportRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (Math.floor(latest * childrenLength.current) !== activeSection) {
      setActiveSection(Math.min(Math.floor(latest * childrenLength.current), childrenLength.current -1))
    }
  })

  return (
    <section ref={stackedSectionsViewportRef}
      className="stacked-sections-viewport"
      style={{'--stacked-section-children-length': `${childrenLength.current}`} as CSSProperties}>
      <div className="stacked-sections-viewport__inner">
        {Children.map(children, (child, index) => (
          <motion.div className={`stacked-sections__child ${index === activeSection ? 'stacked-sections__child--active' : ''}`}>
            {child}
          </motion.div>
        ))}
      </div>
    </section>
  )
}