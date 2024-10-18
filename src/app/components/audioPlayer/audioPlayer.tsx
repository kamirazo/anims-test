'use client'

import { useEffect, useRef, useState } from "react"

interface AudioPlayerProps {
  audioFileURL: string
}

const AudioPlayer = ({audioFileURL}: AudioPlayerProps) => {
  const audioElement = useRef<HTMLAudioElement | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const analyserNode = useRef<AnalyserNode | null>(null)
  const audioDataArray = useRef<Uint8Array | null>(null)
  const canvasElement = useRef<HTMLCanvasElement | null>(null)
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)
  const canvasBarsWidth = useRef<number>(2)
  const canvasBarsMaxHeight = useRef<number>(16)
  const timerInterval = useRef<NodeJS.Timeout | undefined>(undefined)
  const [audioPlayState, setAudioPlayState] = useState<boolean>(false)
  const [audioMuteState, setAudioMuteState] = useState<boolean>(false)
  const [playButtonLabel, setPlayButtonLabel]= useState<'Play' | 'Pause'>('Play')
  const [muteButtonLabel, setMuteButtonLabel]= useState<'Mute' | 'Unmute'>('Mute')
  const [remainingAudioTime, setRemainingAudioTime] = useState<string>('')

  const draw = (
    bufferLength: number,
    dataArray: Uint8Array,
  ) => {
    if (!canvasElement.current || !canvasCtx.current) return

    const barsGap = 4

    let firstX = 0
    let secondX = canvasElement.current.width / 2
    let normalizedData = 0
    
    canvasCtx.current.beginPath();
    for (let index = 0; index < bufferLength; index++) {
      if (index % 2 === 0) {
        normalizedData = dataArray[index] / 256 * canvasBarsMaxHeight.current

        canvasCtx.current.moveTo(
          canvasElement.current.width / 2 - firstX,
          canvasElement.current.height / 2 - (normalizedData) / 2
        )
        canvasCtx.current.lineTo(
          canvasElement.current.width / 2 - firstX,
          (canvasElement.current.height / 2 - (normalizedData) / 2) + normalizedData
        )
        canvasCtx.current.stroke()

        canvasCtx.current.moveTo(
          secondX,
          canvasElement.current.height / 2 - (normalizedData) / 2
        )
        canvasCtx.current.lineTo(
          secondX,
          (canvasElement.current.height / 2 - (normalizedData) / 2) + normalizedData
        )
        canvasCtx.current.stroke()
  
        firstX += barsGap + canvasBarsWidth.current
        secondX += barsGap + canvasBarsWidth.current
      }
    }
  }

  const visualizerAnimation = () => {
    if (
      !canvasCtx.current 
      || !canvasElement.current
      || !analyserNode.current
      || !audioDataArray.current
      || !audioElement.current
    ) return

    canvasCtx.current.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height)
    analyserNode.current.getByteFrequencyData(audioDataArray.current)
    const bufferLength = analyserNode.current.frequencyBinCount
    
    draw(bufferLength, audioDataArray.current)

    if (!audioElement.current.paused) {
      requestAnimationFrame(() => visualizerAnimation())
    } else {
      if (audioElement.current.currentTime >= audioElement.current.duration) {
        canvasCtx.current.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height)
      }
    }
  }

  const playSound = () => {
    if (!audioPlayState) {
      audioElement.current?.play()
      setAudioPlayState(true)
      setPlayButtonLabel('Pause')
      visualizerAnimation()
      setRemainingTime()
    } else {
      audioElement.current?.pause()
      setAudioPlayState(false)
      clearInterval(timerInterval.current)
      setPlayButtonLabel('Play')
    }
  }

  const muteSound = () => {
    if (!audioElement.current) return

    if (!audioMuteState) {
      audioElement.current.muted = true
      setAudioMuteState(true)
      setMuteButtonLabel('Unmute')
    } else {
      audioElement.current.muted = false
      setAudioMuteState(false)
      setMuteButtonLabel('Mute')
    }
  }

  const setRemainingTime = () => {
    if (!audioElement.current?.paused) {
      timerInterval.current = setInterval(() => {
        if (!audioElement.current) return
        setRemainingAudioTime(formatAudioDuration(audioElement.current.duration - audioElement.current.currentTime))
      }, 1000);
    }
  }

  const formatAudioDuration = (duration: number) => {
    return (duration / 100).toFixed(2).toString().replace('.', ':')
  }

  useEffect(() => {
    audioElement.current = new Audio()
    audioElement.current.src = audioFileURL
    audioElement.current.loop = false
    audioElement.current.load()

    const handleAudioCanPlayThrough = () => {
      if (!audioElement.current) return

      audioCtx.current = new AudioContext()
      analyserNode.current = audioCtx.current.createAnalyser()
      analyserNode.current.connect(audioCtx.current.destination)
      analyserNode.current.fftSize = 32
      
      const audioSource = audioCtx.current.createMediaElementSource(audioElement.current)
      audioSource.connect(analyserNode.current)
      
      audioDataArray.current = new Uint8Array(analyserNode.current.frequencyBinCount)

      setRemainingAudioTime(formatAudioDuration(audioElement.current?.duration))
    }

    audioElement.current?.addEventListener('canplaythrough', handleAudioCanPlayThrough)

    return () => {
      audioElement.current?.removeEventListener('canplaythrough', handleAudioCanPlayThrough)
    }
  }, [audioFileURL])

  useEffect(() => {
    const handleAudioEnd = () => {
      if (!audioElement.current) return

      if (audioElement.current?.currentTime >= audioElement.current?.duration) {
        setAudioPlayState(false)
        setPlayButtonLabel('Play')
        clearInterval(timerInterval.current)
        setRemainingAudioTime(formatAudioDuration(audioElement.current?.duration))
      }
    }

    audioElement.current?.addEventListener('pause', handleAudioEnd)

    return () => {
      audioElement.current?.removeEventListener('pause', handleAudioEnd)
    }
  }, [])

  useEffect(() => {
    if (!canvasElement.current) return

    canvasCtx.current = canvasElement.current.getContext('2d', { alpha: false })

    if (!canvasCtx.current) return
    canvasCtx.current.lineWidth = 2;
    canvasCtx.current.lineCap = 'round';
    canvasCtx.current.strokeStyle = '#FFF';
  }, [])

  return (
    <div className="audio-player">
      <button onClick={playSound}>{playButtonLabel}</button>
      <canvas ref={canvasElement}
        width="86"
        height="32"
        className="audio-player__visualizer" />
      <span>{remainingAudioTime}</span>
      <button onClick={muteSound}>{muteButtonLabel}</button>
    </div>
  )
}

export default AudioPlayer