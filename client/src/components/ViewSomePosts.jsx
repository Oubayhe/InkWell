import React from 'react'
import SlideImages from './SlideImages'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'

export default function ViewSomePosts({posts}) {
    
  return (
    <div className="px-14">
        <h1 className='text-2xl font-bold poppingsFont'>
            Lastest Posts
        </h1>
        <div className="my-4 flex justify-center flex-wrap gap-4">
        {posts.map((postItem) => {
            return(
                <div key={postItem._id} className="relative w-80 h-[calc(450px)] border border-slate-300 rounded-xl">
                        {/* Image Slider Container */}
                        <div className="w-full h-56">
                            <SlideImages images={postItem.images} />
                        </div>
                        {/* Text, Category & Button */}
                        
                        <h2 className='px-2 text-xl font-bold mt-4'> {postItem.title} </h2>
                        <p className='px-2 text-md text-gray-500'>{postItem.category}</p>
                        <Link to={`/post/${postItem.slug}`}>
                            <Button gradientDuoTone="purpleToBlue" outline className="m-2 absolute bottom-0 left-0 right-0">Read article</Button>
                        </Link>
                        
                    </div>
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
