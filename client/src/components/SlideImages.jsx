import React from 'react'
'use client';
import { Carousel } from 'flowbite-react';

export default function SlideImages({images}) {
  return (
        <Carousel pauseOnHover>
        {images.map((image, index) => {
        return (
          <div 
            key={index}
            className="flex h-full items-center justify-center"
          >
                <img 
                    src={image.url}
                    alt={image.caption}
                    className="h-full w-full object-cover" // Use Tailwind CSS classes for positioning and sizing
                /> 
        </div>

          )   
      })}
        </Carousel>
    );
}





