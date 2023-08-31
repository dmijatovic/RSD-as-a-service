// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Jesus Garcia Gonzalez (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {UIEventHandler, useRef, useState, useEffect} from 'react'
import {SoftwareHighlight} from '~/components/admin/software-highlights/apiSoftwareHighlights'
import LeftButton from './LeftButton'
import RightButton from './RightButton'
import HighlightsCard from './HighlightsCard'

export const HighlightsCarousel = ({items=[]}: {items:SoftwareHighlight[]}) => {
  // card size + margin
  const cardMovement: number = 680
  const divRef =useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  // Keep track of the current scroll position of the carousel.
  const [scrollPosition, setScrollPosition] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateDistance = () => {
      const rect = divRef.current?.getBoundingClientRect()
      setDistance(Math.ceil(rect?.left ?? 0) + 16)
    }
    if (typeof window !== 'undefined') {
      calculateDistance()
      window.addEventListener('resize', calculateDistance)
      return () => window.removeEventListener('resize', calculateDistance)
    }
  }, [divRef])

  // Event handlers for the next and previous buttons.
  const handleNextClick = () => {
    // move the scroll to the left
    if (carousel.current) {
      carousel.current.scrollLeft += cardMovement
    }
  }

  const handlePrevClick = () => {
    if (carousel.current) {
      carousel.current.scrollLeft -= cardMovement
    }
  }

  const handleScroll:UIEventHandler<HTMLDivElement> = (event:any) => {
    // Update the scroll position state variable whenever the user scrolls
    setScrollPosition(event.target.scrollLeft)
  }

  return (
    <>
      <div ref={divRef} className="container mx-auto invisible"> </div>
      {/* Reference Div to center align card */}
      <div
        data-testid="highlights-carousel"
        className="group relative w-full overflow-x-visible" >
        {scrollPosition > 0 && <LeftButton handlePrevClick={handlePrevClick} /> }
        <RightButton handleNextClick={handleNextClick} />

        {/* Carousel */}
        <div
          ref={carousel}
          onScroll={handleScroll}
          // snap on mobile only
          className={'flex gap-4 snap-start sm:snap-none scroll-smooth overflow-x-scroll scrollbar-hide p-4'}
          style={{scrollbarWidth:'none',left:-scrollPosition, paddingLeft: distance +'px'}}>
          {/* render software card in the row direction */}
          {items.map(highlight => (
            <div key={highlight.id}
              className="snap-center flex-shrink-0 hover:scale-[101%] transition duration-500">
              <HighlightsCard {...highlight}/>
            </div>
          ))
          }
        </div>
      </div>
    </>
  )
}
