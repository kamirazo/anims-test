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
  const audio = useRef<HTMLAudioElement | null>(null)
  const [graphRatio, setGraphRatio] = useState<number>(0)

  const draw = (
    bufferLength: number,
    dataArray: Uint8Array,
    type: 'bars' | 'dots'
  ) => {
    if (!canvasElement.current || !canvasCtx.current) return

    const barWidth = (canvasElement.current.width / 2) / bufferLength
    const dotsMaxSize = 4
    const dotsVerticalSpacing = 16

    let firstX = 0
    let secondX = bufferLength * barWidth
    let normalizedData = 0
    
    for (let index = 0; index < bufferLength; index++) {
      normalizedData = dataArray[index] * graphRatio

      if (type === 'bars') {
        canvasCtx.current.fillRect(
          canvasElement.current.width / 2 - firstX,
          canvasElement.current.height / 2 - (normalizedData) / 2,
          barWidth - 4,
          normalizedData
        )
        canvasCtx.current.fillRect(
          secondX,
          canvasElement.current.height / 2 - (normalizedData) / 2,
          barWidth - 4,
          normalizedData
        )
      } else {
        canvasCtx.current.beginPath()
        for (let subIndex = 0; subIndex < normalizedData; subIndex++) {
          if (subIndex % dotsVerticalSpacing === 0) {
            canvasCtx.current.moveTo(firstX, subIndex)
            canvasCtx.current.arc(
              canvasElement.current.width / 2 - firstX,
              canvasElement.current.height / 2 - (normalizedData) / 2 + subIndex,
              (subIndex * subIndex) * (dotsMaxSize * dotsMaxSize / (normalizedData * -normalizedData)) + ((dotsMaxSize * dotsMaxSize / normalizedData) * subIndex),
              0,
              Math.PI * 2
            )
            
            canvasCtx.current.moveTo(secondX, subIndex)
            canvasCtx.current.arc(
              secondX,
              canvasElement.current.height / 2 - (normalizedData) / 2 + subIndex,
              (subIndex * subIndex) * (dotsMaxSize * dotsMaxSize / (normalizedData * -normalizedData)) + ((dotsMaxSize * dotsMaxSize / normalizedData) * subIndex),
              0,
              Math.PI * 2
            )
          }
        }
        canvasCtx.current.closePath()
        canvasCtx.current.fill()
      }

      firstX += barWidth
      secondX += barWidth
    }
  }

  const visualizerAnimation = (
    bufferLength: number,
    analyser: AnalyserNode,
    dataArray: Uint8Array,
    timestamp: number,
    audioDuration: number
  ) => {
    if (!canvasCtx.current || !canvasElement.current) return

    canvasCtx.current.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height)
    analyser.getByteFrequencyData(dataArray)

    draw(bufferLength, dataArray, 'bars')

    if (Date.now() <= timestamp + audioDuration * 1000 + 500) {
      requestAnimationFrame(() => visualizerAnimation(bufferLength, analyser, dataArray, timestamp, audioDuration))
    } else {
      canvasCtx.current.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height)
    }
  }

  const playSound = () => {
    if (!audioCtx.current || !audio.current) return

    const analyser = audioCtx.current.createAnalyser()
    analyser.connect(audioCtx.current.destination)
    analyser.fftSize = 128
    
    const audioSource = audioCtx.current.createMediaElementSource(audio.current)
    audioSource.connect(analyser)
    
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    if (audio.current.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      audio.current.play()
      visualizerAnimation(bufferLength, analyser, dataArray, Date.now(), audio.current.duration)
    }
  }

  useEffect(() => {
    audioCtx.current = new AudioContext()
    audio.current = new Audio()
    audio.current.src = '/audio/thank-for-watching-this-video-voice.mp3'
    audio.current.load()
  }, [])

  useEffect(() => {
    if (!canvasElement.current) return

    canvasElement.current.width = window.innerWidth;
    canvasElement.current.height = window.innerHeight;
    
    setGraphRatio(window.innerHeight / 2 / 255)

    canvasCtx.current = canvasElement.current.getContext('2d', { alpha: false })

    if (!canvasCtx.current) return
    canvasCtx.current.fillStyle = '#FF00A8'
  }, [])

  return (
    <div className="audio-visualizer">
      <button onClick={playSound}>Play sound</button>

      <canvas ref={canvasElement}
        className="audio-visualizer__canvas" />
    </div>
  )
}

export default AudioVisualizer