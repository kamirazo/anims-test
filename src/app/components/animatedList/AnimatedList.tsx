interface AnimatedListProps {
  listItems: string[]
  currentParentScroll?: number
  scrollTimelineStart?: number
  scrollTimelineDuration?: number
}

const AnimatedList = ({
  listItems,
  currentParentScroll,
  scrollTimelineStart,
  scrollTimelineDuration
}: AnimatedListProps) => {
  return (
    <ul>
      {listItems.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default AnimatedList