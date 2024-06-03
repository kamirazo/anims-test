'use client'

import GallerySequence from './components/gallerySequence/gallerySequence';
import VideoOnScrollSection from './components/videoOnScrollSection/videoOnScrollSection';

export default function ScrollVideoOnly() {

  return (
    <main>
      {/* TODO : Uncomment after adding a test video under /public/video/test2.mp4 */}
      {/* <VideoOnScrollSection videoURL="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" playbackSpeed={200}/> */}
      <GallerySequence 
        content={[
          {
            content: {
              componentID: 'SectionTitle',
              titleContent: 'Animated Image Sequence'
            },
            settings: {
              start: 0,
              duration: .1,
              posX: 'center',
              posY: 'center',
              fixed: false
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
              posX: 'end',
              posY: 'center',
              fixed: false
            }
          },
          {
            content: 'Centered end text. Nobis minus aut sint eumst',
            settings: {
              start: .7,
              duration: .2,
              posX: 'center',
              posY: 'end',
              fixed: false
            }
          }
        ]}
      />
    </main>
  )
}
