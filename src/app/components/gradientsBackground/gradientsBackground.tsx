import './gradientsBackground.scss'

const GradientsBackground = () => {
  // https://tympanus.net/codrops/2017/05/23/on-scroll-morphing-background-shapes/
  // https://tympanus.net/codrops/2017/11/28/decorative-webgl-backgrounds/
  // https://tympanus.net/codrops/2018/12/13/ambient-canvas-backgrounds/
  
  return (
    <div className="gradients-background">
      <svg
        className="gradients-background__shape gradients-background__shape--1"
        viewBox="0 0 1206 687"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M689.229 45.0424C788.696 39.8176 823.742 19.6442 828.832 10.2106C970.179 -55.9698 976.432 -5.0283 961.89 28.715L1016.42 125.591C1037.51 149.538 1001.15 309.982 1001.15 390.095C1001.15 490.236 983.703 472.82 689.229 491.324C394.756 509.829 623.791 370.502 314.048 298.661C66.2537 241.189 258.789 207.954 386.03 198.52C419.477 180.379 589.763 50.2671 689.229 45.0424Z" fill="#A69BFC" />
      </svg>

      <svg
        className="gradients-background__shape gradients-background__shape--2"
        viewBox="0 0 1124 903"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M596.229 261.042C695.696 255.818 730.742 235.644 735.832 226.211C877.179 160.03 883.432 210.972 868.89 244.715L923.423 341.591C944.508 365.538 908.154 525.982 908.154 606.095C908.154 706.236 890.703 688.82 596.229 707.324C301.756 725.829 530.791 586.502 221.048 514.661C-26.7463 457.189 165.789 423.954 293.03 414.52C326.477 396.379 496.763 266.267 596.229 261.042Z" fill="#00C8FF" />
      </svg>

      <div className="gradients-background__shape gradients-background__shape--3"></div>
    </div>
  )
}

export default GradientsBackground