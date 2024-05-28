'use client'

import SectionTitle from '../components/sectionTitle/sectionTitle';
import VideoOnScrollSection from '../components/videoOnScrollSection/videoOnScrollSection';

export default function Home() {

  return (
    <main>
      <VideoOnScrollSection videoURL="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" playbackSpeed={1000}>
        <div className="section section--center-content">
          <SectionTitle 
            titleTag='h1' 
            titleContent='Main title 1 with more text to have several lines'
            animType='glowing'
            subtitleContent='Subtitle' />
        </div>
      </VideoOnScrollSection>
      <VideoOnScrollSection videoURL="/video/test.mp4">
        <h2>Main title 2</h2>
        <ul>
          <li>Side text 1. Nobis minus aut sint eum.</li>
          <li>Side text 2. Nobis minus aut sint eum.</li>
          <li>Side text 3. Nobis minus aut sint eum.</li>
        </ul>
      </VideoOnScrollSection>
    </main>
  )
}
