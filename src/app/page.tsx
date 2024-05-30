'use client'

import GallerySequence from './components/gallerySequence/gallerySequence';
import VideoOnScrollSection from './components/videoOnScrollSection/videoOnScrollSection';

export default function ScrollVideoOnly() {

  return (
    <main>
      <VideoOnScrollSection videoURL="/video/test2.mp4" playbackSpeed={200}/>
      {/* <VideoOnScrollSection videoURL="/video/test3.mp4"/> */}
      <GallerySequence />
    </main>
  )
}
