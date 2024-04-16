import React from 'react'
import { FaTrashAlt } from "react-icons/fa";


export default function LittleImages({images, deleteImage}) {
  return (
    <div className="h-auto mt-1 flex gap-1 flex-wrap">  
        {images.map((image) => {
            return (
            <div key={image.caption} onClick={() => deleteImage(image.caption)} className='group relative h-20 w-32 rounded-xl cursor-pointer'>
                <img 
                    src={image.url} 
                    alt={image.caption} 
                    className='object-cover h-full w-full ' 
                />
                <div className="w-full h-full bg-red-500 bg-opacity-40
                absolute top-0 left-0 hidden group-hover:flex
                 text-white text-4xl justify-center items-center">
                    <FaTrashAlt />
                </div>
            </div>)
        })}    
    </div>
  )
}
