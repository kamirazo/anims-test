'use client'

import GallerySequence from './components/gallerySequence/gallerySequence'

export default function ScrollVideoOnly() {

  return (
    <main>
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
