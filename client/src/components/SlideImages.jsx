import React from 'react'
'use client';
import { Carousel } from 'flowbite-react';

export default function SlideImages({images}) {
  return (
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel pauseOnHover>
        {images.map((image, index) => {
        return (
          <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 ">
            <img 
                key={index}
                src={image.url}
                alt={image.caption}
                className='h-full w-full object-contain'
            /> 
          </div>
          )   
      })}
        </Carousel>
      </div>
    );
}





