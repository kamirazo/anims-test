import AudioVisualizer from "./components/audioVisualizer/audioVisualizer"
import GradientsBackground from "./components/gradientsBackground/gradientsBackground"
import WordHighlight from "./components/wordHighlight/wordHighlight"

const Home = () => {
  return (
    <main>
      <section className="section section--with-positionned-children">
        <GradientsBackground />

        <h1>
          Magnam et modi ut aspernatur dolorum et et et.
          Omnis exercitationem deserunt et.
          Odit sunt non unde.
          <WordHighlight>
            Word Highlight
          </WordHighlight>
          Dolore in molestias sed ad quia.
        </h1>
      </section>
      
      <section className="section section--no-padding">
        <AudioVisualizer />
      </section>
    </main>
  )
}

export default Home