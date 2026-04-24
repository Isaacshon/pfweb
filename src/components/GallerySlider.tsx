'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface GallerySliderProps {
  images: { src: string; alt: string }[]
}

export const GallerySlider: React.FC<GallerySliderProps> = ({ images }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })])

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {images.map((image, index) => (
          <div className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-2" key={index}>
            <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 aspect-square">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
