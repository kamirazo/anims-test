import { ReactNode, useEffect } from "react"
import { stagger, useAnimate, useInView } from "framer-motion"

interface GridProps {
  displayType: 'halves' | 'thirds' | 'fourths',
  children: ReactNode
}

const AnimatedGrid = ({displayType, children}: GridProps) => {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope, {amount : .25})

  useEffect(() => {
    if (!scope.current?.childNodes) return

    animate(
      scope.current.childNodes,
      isInView
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: 50 },
      {
        duration: 0.3,
        delay: stagger(0.1)
      }
    )
  }, [isInView, animate, scope])

  return (
    <div ref={scope} className={`grid animated-grid grid--${displayType} ${isInView ? 'animated-grid--in-view' : ''}`}>
      {children}
    </div>
  )
}

export default AnimatedGrid