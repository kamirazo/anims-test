import { ReactNode, useEffect } from "react"
import { stagger, useAnimate, useInView } from "framer-motion"

interface GridProps {
  displayType: 'halves' | 'thirds' | 'fourths',
  children: ReactNode
}

const AnimatedGrid = ({displayType, children}: GridProps) => {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)

  useEffect(() => {
    if (!scope.current?.childNodes) return

    const staggerAnimatedGridItems = stagger(0.1, { startDelay: 0.5 })

    animate(
      scope.current.childNodes,
      isInView
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: 50 },
      {
        duration: 0.3,
        delay: isInView ? staggerAnimatedGridItems : 0
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