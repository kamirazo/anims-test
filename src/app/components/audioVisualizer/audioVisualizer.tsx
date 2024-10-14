'use client'

import { useEffect, useRef, useState } from "react"
import './audioVisualizer.scss'

// https://www.youtube.com/watch?v=3NgVlAscdcA&list=PLMPgoZdlPumc_llMSynz5BqT8dTwr5sZ2&index=1&ab_channel=TheCodeCreative
// https://www.youtube.com/watch?v=f0dwg99EVfo&list=PLYElE_rzEw_sHeIIv7BMliQF5zB7BliJE&ab_channel=Frankslaboratory
// https://www.youtube.com/watch?v=qNEb9of714U&ab_channel=Frankslaboratory
// https://www.youtube.com/watch?v=FK0867WUbvE&ab_channel=TheCodeDose
// https://tympanus.net/codrops/2023/12/19/creating-audio-reactive-visuals-with-dynamic-particles-in-three-js/
// https://tympanus.net/codrops/2020/02/24/audio-based-image-distortion-effects-with-webgl/
// https://tympanus.net/codrops/2018/03/06/creative-audio-visualizers/
// https://p5js.org/examples/
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

const AudioVisualizer = () => {
  const audioCtx = useRef<AudioContext | null>(null)
  const canvasElement = useRef<HTMLCanvasElement | null>(null)
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)
  const [graphRatio, setGraphRatio] = useState<number>(0)

  useEffect(() => {
    audioCtx.current = new AudioContext()
  }, [])

  useEffect(() => {
    if (!canvasElement.current) return

    canvasElement.current.width = window.innerWidth;
    canvasElement.current.height = window.innerHeight;
    
    setGraphRatio(window.innerHeight / 2 / 255)

    canvasCtx.current = canvasElement.current.getContext('2d', { alpha: false })
  }, [])

  const visualizerAnimation = (
    bufferLength: number,
    analyser: AnalyserNode,
    dataArray: Uint8Array
  ) => {
    if (!canvasCtx.current || !canvasElement.current) return

    const barWidth = (canvasElement.current.width / 2) / bufferLength
    let firstX = 0
    let secondX = bufferLength * barWidth
    
    canvasCtx.current.fillStyle = '#FF00A8'
    canvasCtx.current.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height)
    analyser.getByteFrequencyData(dataArray)

    for (let index = 0; index < bufferLength; index++) {
      canvasCtx.current.fillRect(
        canvasElement.current.width / 2 - firstX,
        canvasElement.current.height / 2 - (dataArray[index] * graphRatio) / 2,
        barWidth,
        dataArray[index] * graphRatio
      )
      canvasCtx.current.fillRect(
        secondX,
        canvasElement.current.height / 2 - (dataArray[index] * graphRatio) / 2,
        barWidth,
        dataArray[index] * graphRatio
      )

      firstX += barWidth
      secondX += barWidth
    }

    requestAnimationFrame(() => visualizerAnimation(bufferLength, analyser, dataArray))
  }

  const playSound = async () => {
    if (!audioCtx.current) return

    // Preload and store audio in context outside component ?
    const audio = new Audio()
    audio.src = '/audio/thank-for-watching-this-video-voice.mp3'

    const analyser = audioCtx.current.createAnalyser()
    analyser.connect(audioCtx.current.destination)
    analyser.fftSize = 1024
    
    const audioSource = audioCtx.current.createMediaElementSource(audio)
    audioSource.connect(analyser)
    
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    audio.play()

    visualizerAnimation(bufferLength, analyser, dataArray)
  }

  return (
    <div className="audio-visualizer">
      <button onClick={playSound}>Play sound</button>

      <canvas ref={canvasElement}
        className="audio-visualizer__canvas" />
    </div>
  )
}

export default AudioVisualizer