'use client'

import VideoOnScrollSection from '../components/videoOnScrollSection/videoOnScrollSection'

export default function Home() {

  return (
    <main>
      <VideoOnScrollSection 
        videoURL="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
        playbackSpeed={1000}
        content={[
          {
            content: {
              componentID: 'SectionTitle',
              titleContent: 'Main title 1 with more text to have several lines',
              subtitle: 'Subtitle',
              titleTag: 'h1'
            },
            settings: {
              animType: 'glowing',
              fixed: false
            }
          }
        ]} />

      {/* TODO : Uncomment after adding a test video under /public/video/test.mp4 */}
      {/* <VideoOnScrollSection 
        videoURL="/video/test.mp4"
        content={[
          {
            content: 'Second section',
            settings: {
              start: 0,
              duration: .1,
              posX: 'center-x',
              posY: 'center-y',
              fixed: true
            }
          },
          {
            content: {
              componentID: 'AnimatedList',
              listItems: [
                'Side text 1. Nobis minus aut sint eum.',
                'Side text 2. Nobis minus aut sint eum.',
                'Side text 3. Nobis minus aut sint eum.'
              ]
            },
            settings: {
              start: .2,
              duration: .2,
              posX: 'end-x',
              posY: 'center-y',
              fixed: true
            }
          },
          {
            content: 'Centered end text. Nobis minus aut sint eumst',
            settings: {
              start: .7,
              duration: .2,
              posX: 'center-x',
              posY: 'end-y',
              fixed: true
            }
          }
        ]}
      /> */}
    </main>
  )
}
