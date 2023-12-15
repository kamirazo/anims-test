'use client'

import { ReactLenis } from '@studio-freight/react-lenis';
import Hero from './components/hero/Hero';
import HorizontalScroller from './components/horizontalScroller/HorizontalScroller';
import ScaleBgSection from './components/scaleBgSection/ScaleBgSection';
import StackedSections from './components/stackedSections/StackedSections';

// https://www.renault.fr/vehicules-electriques/scenic-e-tech-electrique.html
// https://gsap.com/resources/React/
// https://www.npmjs.com/package/@gsap/react
// https://tympanus.net/Development/ScrollBasedLayoutAnimations/
// https://gsap.com/community/forums/topic/19861-usage-with-typescript/?do=findComment&comment=188252
// https://codepen.io/GreenSock/pen/KKpLdWW
// https://www.youtube.com/watch?v=VhXemORYup8
// https://www.framer.com/motion/

export default function Home() {
  return (
    <ReactLenis root>
      <main>
        <Hero title="Maintitle" mainPoints={['number 1', 'number 2', 'number 3']}/>
        <ScaleBgSection>
          <div>My content</div>
        </ScaleBgSection>
        <HorizontalScroller>
          <section className="section">Hor Section 1</section>
          <section className="section">Hor Section 2</section>
          <section className="section">Hor Section 3</section>
          <section className="section">Hor Section 4</section>
        </HorizontalScroller>
        <StackedSections>
          <section className="section">Stacked Section 1</section>
          <section className="section">Stacked Section 2</section>
          <section className="section">Stacked Section 3</section>
          <section className="section">Stacked Section 4</section>
        </StackedSections>
      </main>
    </ReactLenis>
  )
}
