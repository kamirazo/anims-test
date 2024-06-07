'use client'

import VideoAndImgSequence from './components/videoAndImgSequence/videoAndImgSequence'

const VideoAndImageSequencePage = () => {
  return (
    <main>
      {/* TODO : Uncomment after adding the proper test assets */}
      {/* <VideoAndImgSequence
        videoURL="/video/test2.mp4"
        imgSequencePath="sequenceTest2/2148_Nissan_Patrol_grill_poziom_ch01"
        content={[
          {
            content: {
              componentID: 'SectionTitle',
              titleContent: 'Animated Image Sequence'
            },
            settings: {
              start: 0,
              end: .15,
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
              end: .35,
              posX: 'end',
              posY: 'center',
              fixed: false
            }
          },
          {
            content: 'Centered end text. Nobis minus aut sint eumst',
            settings: {
              start: .7,
              end: .85,
              posX: 'center',
              posY: 'end',
              fixed: false
            }
          }
        ]} /> */}
    </main>
  )
}

export default VideoAndImageSequencePage