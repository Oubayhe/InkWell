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
            className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700"
          >
            <img 
                src={image.url}
                alt={image.caption}
                className='h-full w-full object-contain'
            /> 
          </div>
          )   
      })}
        </Carousel>
    );
}





