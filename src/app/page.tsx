'use client'

import GallerySequence from './components/gallerySequence/gallerySequence';
import VideoOnScrollSection from './components/videoOnScrollSection/videoOnScrollSection';

export default function ScrollVideoOnly() {

  return (
    <main>
      {/* TODO : Uncomment after adding a test video under /public/video/test2.mp4 */}
      {/* <VideoOnScrollSection videoURL="/video/test2.mp4" playbackSpeed={200}/> */}
      <GallerySequence />
    </main>
  )
}
