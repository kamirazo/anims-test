'use client'

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import './wordHighlight.scss'

interface WordHighlightProps {
  children: ReactNode
}

const WordHighlight = ({children}: WordHighlightProps) => {
  // https://pauloferreirajorge.com/
  // https://tympanus.net/codrops/2024/10/02/case-study-federico-pian-portfolio-2024/
  // https://tympanus.net/codrops/2022/01/19/animate-anything-along-an-svg-path/

  // Combine transform scale() & vector-effect="non-scaling-stroke" on a path ?
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/vector-effect
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio

  const svgRef = useRef<SVGSVGElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const [pathLength, setPathLength] = useState<number>(0)

  useEffect(() => {
    if (!pathRef.current || !svgRef.current) return

    const initialPerimeter = svgRef.current.viewBox.baseVal.width * 2 + svgRef.current.viewBox.baseVal.height * 2
    const computerPerimeter = svgRef.current.clientWidth * 2 + svgRef.current.clientHeight * 2
    const pathLengthRatio = computerPerimeter / initialPerimeter

    setPathLength(pathRef.current.getTotalLength() * pathLengthRatio)
  }, [])

  return (
    <span className="word-highlight">
      <svg 
        ref={svgRef}
        viewBox="0 0 668 102"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{'--path-length': pathLength} as CSSProperties}>
        <path
          ref={pathRef}
          vectorEffect="non-scaling-stroke"
          d="M468.238 11.4914C262.824 -0.13965 -38.4092 29.3968 6.7011 73.3717C66.5432 119.532 639.085 101.294 663.757 58.892C702.638 -7.92996 182.243 -6.95388 107.234 14.5701"
          stroke="url(#paint0_linear_1120_4860)"
          strokeWidth="2"/>
        <defs>
          <linearGradient id="paint0_linear_1120_4860" x1="2.24833" y1="49.3625" x2="665.823" y2="53.0387" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF4D00"/>
          <stop offset="0.2" stopColor="#FFB800"/>
          <stop offset="0.4" stopColor="#00E725"/>
          <stop offset="0.6" stopColor="#0075FF"/>
          <stop offset="0.8" stopColor="#CC00FF"/>
          <stop offset="1" stopColor="#FF00A8"/>
          </linearGradient>
        </defs>
      </svg>

      {children}

      <span className="word-highlight__interactive-dot"></span>
    </span>
  )
}

export default WordHighlight