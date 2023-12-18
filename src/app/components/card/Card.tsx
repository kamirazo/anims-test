import Image from "next/image"
import { ReactNode } from "react"

import './Card.scss'

interface CardProps {
  image?: {
    alt?: string
    url: string
  }
  title?: string
  content?: ReactNode
  inDarkContext?: boolean
}

const Card = ({image, title, content, inDarkContext}: CardProps) => {
  return (
    <div className={`card ${inDarkContext ? 'card--dark' : ''}`}>
      {image?.url && (
        <Image src={image.url} alt={image.alt ?? ''} className="card__image" />
      )}
      <div className="card__content">
        {title && (
          <div>{title}</div>
        )}

        {content && (
          <>{content}</>
        )}
      </div>
    </div>
  )
}

export default Card