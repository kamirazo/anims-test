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

interface AudioVisualizerProps {
  type?: 'bars' | 'dots' | 'ellipse',
  fftSize?: number
}

const AudioVisualizer = ({type = 'bars', fftSize = 128}: AudioVisualizerProps) => {
  const audio = useRef<HTMLAudioElement | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const analyserNode = useRef<AnalyserNode | null>(null)
  const audioDataArray = useRef<Uint8Array | null>(null)
  const canvasElement = useRef<HTMLCanvasElement | null>(null)
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)
  const [graphRatio, setGraphRatio] = useState<number>(0)

  const draw = (
    bufferLength: number,
    dataArray: Uint8Array,
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

      switch (type) {
        case 'dots':
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
          break
        case "ellipse":
          canvasCtx.current.beginPath()
          for (let subIndex = 0; subIndex < normalizedData; subIndex++) {
            if (subIndex % dotsVerticalSpacing === 0) {
              canvasCtx.current.moveTo(firstX, subIndex)
              canvasCtx.current.ellipse(
                canvasElement.current.width / 2 - firstX,
                canvasElement.current.height / 2 - (normalizedData) / 2 + subIndex,
                (subIndex * subIndex) * (dotsMaxSize * dotsMaxSize / (normalizedData * -normalizedData)) + ((dotsMaxSize * dotsMaxSize / normalizedData) * subIndex),
                ((subIndex * subIndex) * (dotsMaxSize * dotsMaxSize / (normalizedData * -normalizedData)) + ((dotsMaxSize * dotsMaxSize / normalizedData) * subIndex)) / 2,
                -75 * Math.PI/180,
                0,
                2 * Math.PI
              )
              
              canvasCtx.current.moveTo(secondX, subIndex)
              canvasCtx.current.ellipse(
                secondX,
                canvasElement.current.height / 2 - (normalizedData) / 2 + subIndex,
                (subIndex * subIndex) * (dotsMaxSize * dotsMaxSize / (normalizedData * -normalizedData)) + ((dotsMaxSize * dotsMaxSize / normalizedData) * subIndex),
                ((subIndex * subIndex) * (dotsMaxSize * dotsMaxSize / (normalizedData * -normalizedData)) + ((dotsMaxSize * dotsMaxSize / normalizedData) * subIndex)) / 2,
                -75 * Math.PI/180,
                0,
                2 * Math.PI
              );
            }
          }
          canvasCtx.current.closePath()
          canvasCtx.current.fill()
          break
        case 'bars':
        default:
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
          break
      }

      firstX += barWidth
      secondX += barWidth
    }
  }

  const visualizerAnimation = (
    timestamp: number,
    audioDuration: number
  ) => {
    if (
      !canvasCtx.current 
      || !canvasElement.current
      || !analyserNode.current
      || !audioDataArray.current
    ) return

    canvasCtx.current.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height)
    analyserNode.current.getByteFrequencyData(audioDataArray.current)
    const bufferLength = analyserNode.current.frequencyBinCount

    draw(bufferLength, audioDataArray.current)

    if (Date.now() <= timestamp + audioDuration * 1000 + 500) {
      requestAnimationFrame(() => visualizerAnimation(timestamp, audioDuration))
    } else {
      canvasCtx.current.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height)
    }
  }

  const playSound = () => {
    if (!audioCtx.current || !audio.current) return

    if (audio.current.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      audio.current.play()
      visualizerAnimation(Date.now(), audio.current.duration)
    }
  }

  useEffect(() => {
    audioCtx.current = new AudioContext()
    audio.current = new Audio()
    audio.current.src = '/audio/thank-for-watching-this-video-voice.mp3'
    audio.current.load()

    analyserNode.current = audioCtx.current.createAnalyser()
    analyserNode.current.connect(audioCtx.current.destination)
    analyserNode.current.fftSize = fftSize
    
    const audioSource = audioCtx.current.createMediaElementSource(audio.current)
    audioSource.connect(analyserNode.current)
    
    audioDataArray.current = new Uint8Array(analyserNode.current.frequencyBinCount)
  }, [fftSize])

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