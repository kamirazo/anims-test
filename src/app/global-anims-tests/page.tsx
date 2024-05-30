'use client'

import { ReactLenis } from '@studio-freight/react-lenis';
import Hero from '../components/hero/Hero';
import HorizontalScroller from '../components/horizontalScroller/HorizontalScroller';
import ScaleBgSection from '../components/scaleBgSection/ScaleBgSection';
import StackedSections from '../components/stackedSections/StackedSections';
import Card from '../components/card/Card';
import AnimatedGrid from '../components/animatedGrid/AnimatedGrid';
import ImgTextSection from '../components/imgTextSection/ImgTextSection';

// Inspi
// https://www.renault.fr/vehicules-electriques/scenic-e-tech-electrique.html
// https://tympanus.net/Development/ScrollBasedLayoutAnimations/

// Resources
// https://gsap.com/resources/React/
// https://www.npmjs.com/package/@gsap/react
// https://gsap.com/community/forums/topic/19861-usage-with-typescript/?do=findComment&comment=188252
// https://codepen.io/GreenSock/pen/KKpLdWW
// https://www.youtube.com/watch?v=VhXemORYup8
// https://www.framer.com/motion/

export default function Home() {
  const basicParagraph = () => {
    return (
      <p>Rerum alias sequi sed. Hic eveniet commodi aliquam. Ullam maxime explicabo voluptatibus accusantium omnis quo modi.</p>
    )
  }
  return (
    <ReactLenis root>
      <main>
        <Hero title="Maintitle" mainPoints={['number 1', 'number 2', 'number 3']}/>
        <ScaleBgSection>
          <div>My content</div>
        </ScaleBgSection>
        <HorizontalScroller>
          <section className="section">
            Hor Section 1
            <div className="grid grid--halves">
              <Card title="Card title" content={basicParagraph()} inDarkContext />
              <Card title="Card title" content={basicParagraph()} inDarkContext />
            </div>
          </section>
          <section className="section">
            Hor Section 2
            <AnimatedGrid displayType='thirds'>
              <Card image={{url:'/img/testAnimImg.jpg'}} title="Card title" content={basicParagraph()} inDarkContext />
              <Card title="Card title" content={basicParagraph()} inDarkContext />
              <Card title="Card title" content={basicParagraph()} inDarkContext />
            </AnimatedGrid>
          </section>
          <section className="section">Hor Section 3</section>
          <section className="section">Hor Section 4</section>
        </HorizontalScroller>
        <ImgTextSection image={{url:'/img/testAnimImg.jpg'}} title="Card title" content={basicParagraph()} />
        <StackedSections>
          <section className="section">Stacked Section 1</section>
          <section className="section">Stacked Section 2</section>
          <section className="section">Stacked Section 3</section>
          <section className="section">Stacked Section 4</section>
        </StackedSections>
        <div className="section">
          <AnimatedGrid displayType='thirds'>
            <Card image={{url:'/img/testAnimImg.jpg'}} title="Card title" content={basicParagraph()} />
            <Card title="Card title" content={basicParagraph()} />
            <Card title="Card title" content={basicParagraph()} />
          </AnimatedGrid>
        </div>
      </main>
    </ReactLenis>
  )
}
