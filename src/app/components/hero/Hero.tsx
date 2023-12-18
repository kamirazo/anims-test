'use client'

import { CSSProperties, ReactNode, useRef, useState } from 'react'
import { useLenis } from '@studio-freight/react-lenis'
import { InView } from 'react-intersection-observer'

import './Hero.scss'

interface HeroProps {
  title: string | ReactNode
  mainPoints?: string[]
}

const Hero = ({ title, mainPoints }: HeroProps) => {
  const heroHeaderRef = useRef<HTMLElement | null>(null)
  const [heroHeaderScrollProgress, setHeroHeaderScrollProgress] = useState(0)

  useLenis(({ scroll }) => {
    if (heroHeaderRef.current && scroll > heroHeaderRef.current.clientTop) {
      setHeroHeaderScrollProgress(parseFloat((scroll / heroHeaderRef.current?.clientHeight).toFixed(3)))
    }
  })

  const renderMainPointClasses = (inView : boolean) => {
    if (inView) {
      return 'hero__mainPoints__item hero__mainPoints__item--active'
    }

    return 'hero__mainPoints__item'
  }

  return (
    <div className="hero">
      <header className="hero__header section" ref={heroHeaderRef}>
        <video autoPlay loop className="hero__header__background">
          <source src="https://a.storyblok.com/f/172651/x/4f4d52f469/nissannismo_ariya_2022-11-14.mp4" type="video/mp4" />
        </video>

        <h1 style={{ '--hero-header-scroll-progress': heroHeaderScrollProgress } as CSSProperties} className='hero__header__title'>
          {title}
        </h1>
      </header>
      
      {mainPoints && (
        <ul className='hero__mainPoints'>
          {mainPoints.map((mainPoint) => (
            <InView key={mainPoint} rootMargin='-45% 0px -45% 0px'>
              {({ inView, ref }) => (
                <li ref={ref} className={renderMainPointClasses(inView)}>{mainPoint}</li>
              )}
            </InView>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Hero
