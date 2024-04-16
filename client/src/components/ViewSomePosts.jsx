import React from 'react'
import SlideImages from './SlideImages'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'

export default function ViewSomePosts({posts}) {
    
  return (
    <div className="px-14">
        <h1 className='text-2xl font-bold'>Latest Articles</h1>
        <div className="my-4 flex justify-center items-center flex-wrap gap-4">
        {posts.map((postItem) => {
            return(
                 <Link to={`/post/${postItem.slug}`} key={postItem._id} className="relative w-80 h-[calc(400px)] hover:-translate-y-2.5 ease-in-out duration-300">  
                        {/* Image Slider Container */}
                        <div className="w-full h-56">
                            <SlideImages images={postItem.images} />
                        </div>
                        {/* Text, Category & Button */}
                        
                        <h2 className='px-2 text-xl font-bold mt-4'> {postItem.title} </h2>
                        <p className='px-2 text-md text-gray-500'>{postItem.category}</p>
                    </Link>
            )
        } )}
        </div>
        <div className='flex justify-center my-2'>
            <Link to={'/posts'}>
                <button className='py-2 px-4 border border-teal-500 rounded-xl hover:bg-teal-500 hover:text-white'>
                    View more articles
                </button>
            </Link>
        </div>
    </div>
  )
}
