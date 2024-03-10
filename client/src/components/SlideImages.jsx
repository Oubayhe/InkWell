import React from 'react'

export default function SlideImages({images}) {
  return (
    <div className="w-full h-auto">
        {images.map((image, index) => {
        return (
            <img 
                key={index}
                src={image.url}
                alt={image.caption}
                className='w-full h-72 object-cover'
            /> 
        )   
    })}
    </div>
  )
}
