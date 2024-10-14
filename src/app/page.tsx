import AudioVisualizer from "./components/audioVisualizer/audioVisualizer"
import WordHighlight from "./components/wordHighlight/wordHighlight"

const Home = () => {
  return (
    <main>
      <h1>
        Magnam et modi ut aspernatur dolorum et et et.
        Omnis exercitationem deserunt et.
        Odit sunt non unde.
        <WordHighlight>
          Word Highlight
        </WordHighlight>
        Dolore in molestias sed ad quia.
      </h1>

      <AudioVisualizer />
    </main>
  )
}

export default Home