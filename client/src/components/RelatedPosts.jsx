import React, { useState, useEffect } from 'react'
import SlideImages from './SlideImages'
import { Button } from 'flowbite-react'
import { Link } from 'react-router-dom'


export default function RelatedPosts({ post }) {
    const [morePosts, setMorePosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=4&&category=${post.category}`)
                const data = await res.json()
                if(res.ok) {
                    setMorePosts(data.posts)
                }
                if (!res.ok) {
                    console.log(data.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts()
    }, [post])


  return (
    <div className=''>
      <h1 className='text-2xl font-bold'>Explore More: Related Reads</h1>
      {/* Get about 4 pots */}
      <div className="mt-4 flex justify-center items-center flex-wrap gap-4">
      {
        morePosts.map((postItem) => {
            return (
                <div key={postItem._id} className="relative w-96 h-96 border border-slate-300 rounded-xl">
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
        })
      }
      </div>
    </div>
  )
}
