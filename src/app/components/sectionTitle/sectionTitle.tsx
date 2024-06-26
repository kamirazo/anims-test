import { createElement } from "react"

import './sectionTitle.scss'

interface SectionTitleProps {
  titleTag?: keyof HTMLElementTagNameMap
  titleContent: string
  subtitleTag?: keyof HTMLElementTagNameMap
  subtitleContent?: string
  animType?: 'glowing' | 'translateY'
}

const SectionTitle = ({
  titleTag = 'div',
  titleContent,
  subtitleTag = 'div',
  subtitleContent,
  animType
}: SectionTitleProps) => (
  <div className={`section-title ${animType ? `section-title--${animType}` : ''}`}>
    <div className="section-title-wrapper">
      {createElement(
        titleTag, 
        { className : 'section-title__main-title' },
        titleContent
      )}

      {subtitleContent && createElement(
        subtitleTag, 
        { className : 'section-title__subtitle' },
        subtitleContent
      )}
    </div>
  </div>
)

export default SectionTitle