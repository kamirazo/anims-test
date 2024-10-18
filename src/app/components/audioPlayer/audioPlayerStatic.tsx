'use client'

import { CSSProperties, useEffect, useRef, useState } from "react"
import "./audioPlayerStatic.scss"

interface AudioPlayerStaticProps {
  audioFileURL: string
}

// Source : https://codepen.io/ilikescience/pen/mddOWWg

const AudioPlayerStatic = ({audioFileURL}: AudioPlayerStaticProps) => {
  const audioElement = useRef<HTMLAudioElement | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const remainingTimeIntervalID = useRef<NodeJS.Timeout | undefined>(undefined)
  const [audioPlayState, setAudioPlayState] = useState<boolean>(false)
  const [audioMuteState, setAudioMuteState] = useState<boolean>(false)
  const [remainingAudioTime, setRemainingAudioTime] = useState<string>('')
  const [audioReadRatio, setAudioReadRatio] = useState<number>(0)
  const [audioGraphItems, setAudioGraphItems] = useState<number[]>([])

  const playSound = () => {
    if (!audioPlayState) {
      audioElement.current?.play()
      setAudioPlayState(true)
      setRemainingTime()
      setPlayedRatio()
    } else {
      audioElement.current?.pause()
      setAudioPlayState(false)
      clearInterval(remainingTimeIntervalID.current)
    }
  }

  const muteSound = () => {
    if (!audioElement.current) return

    if (!audioMuteState) {
      audioElement.current.muted = true
      setAudioMuteState(true)
    } else {
      audioElement.current.muted = false
      setAudioMuteState(false)
    }
  }

  const setRemainingTime = () => {
    if (!audioElement.current?.paused) {
      remainingTimeIntervalID.current = setInterval(() => {
        if (!audioElement.current) return

        setRemainingAudioTime(formatAudioDuration(audioElement.current.duration - audioElement.current.currentTime))
      }, 1000);
    }
  }

  const setPlayedRatio = () => {
    if (!audioElement.current) return

    if (!audioElement.current?.paused) {
      setAudioReadRatio(Math.round(audioElement.current.currentTime / audioElement.current.duration * 16))
      requestAnimationFrame(() => setPlayedRatio())
    }
  }

  const formatAudioDuration = (duration: number) => {
    return (duration / 100).toFixed(2).toString().replace('.', ':')
  }

  const filterAudioData = (audioBuffer : AudioBuffer) => {
    const rawData = audioBuffer.getChannelData(0)
    const samples = 16
    const blockSize = Math.floor(rawData.length / samples)
    const filteredData = []

    for (let index = 0; index < samples; index++) {
      let blockStart = blockSize * index
      let sum = 0

      for (let subIndex = 0; subIndex < blockSize; subIndex++) {
        sum = sum + Math.abs(rawData[blockStart + subIndex])
      }

      filteredData.push(sum / blockSize)
    }
    return filteredData;
  };

  const normalizeAudioData = (filteredData: number[]) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1) * 16;
    return filteredData.map(n => Math.max(Math.round(n * multiplier), 2));
  }

  useEffect(() => {
    fetch(audioFileURL)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        audioCtx.current = new AudioContext()
        return audioCtx.current.decodeAudioData(arrayBuffer)
      })
      .then(audioBuffer => {
        setAudioGraphItems(normalizeAudioData(filterAudioData(audioBuffer)))
      });
  }, [audioFileURL])

  useEffect(() => {
    audioElement.current = new Audio()
    audioElement.current.src = audioFileURL
    audioElement.current.loop = false
    audioElement.current.load()

    const handleAudioCanPlayThrough = () => {
      if (!audioElement.current) return

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
        clearInterval(remainingTimeIntervalID.current)
        setAudioReadRatio(0)
        setRemainingAudioTime(formatAudioDuration(audioElement.current?.duration))
      }
    }

    audioElement.current?.addEventListener('pause', handleAudioEnd)

    return () => {
      audioElement.current?.removeEventListener('pause', handleAudioEnd)
    }
  }, [])

  return (
    <div className="audio-player-static">
      <button onClick={playSound}>{audioPlayState ? 'Pause' : 'Play'}</button>
      <div className="audio-player-static__visualizer">
        {audioGraphItems.map((itemHeight, index) => (
          <div key={index}
            className={`audio-player-static__visualizer__bar ${index < audioReadRatio ? 'audio-player-static__visualizer__bar--opaque' : ''}`}
            style={{ '--height': `${itemHeight}px` } as CSSProperties}>
          </div>
        ))}
      </div>
      <span>{remainingAudioTime}</span>
      <button onClick={muteSound}>{audioMuteState ? 'Unmute' : 'Mute'}</button>
    </div>
  )
}

export default AudioPlayerStatic