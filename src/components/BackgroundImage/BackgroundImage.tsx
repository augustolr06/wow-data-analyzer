import React from 'react'
import Slider from 'react-slick'

import { Container } from './BackgroundImage.styles'

const images = [
  { src: '/images/wow-bg-1.jpg' },
  { src: '/images/wow-bg-2.jpg' },
  { src: '/images/wow-bg-3.jpg' },
  { src: '/images/wow-bg-4.jpg' }
]

export const BackgroundImage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  return (
    <Container>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.src} alt={`Imagem ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </Container>
  )
}
