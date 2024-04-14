import React, { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import ViewSomePosts from '../components/ViewSomePosts'
import { Spinner } from 'flowbite-react'


const Home = () => {
  const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            
            try {
              setLoading(true)
                const res = await fetch('/api/post/getposts?limit=6')
                const data = await res.json()
                if (res.ok) {
                    setPosts(data.posts)
                    setLoading(false)
                }
                if (!res.ok) {
                    setLoading(false)
                    console.log(data.message)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchPosts()
    }, [])

    if (loading) return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    )
    return (
      <div className=''>
        <HeroSection />
        <ViewSomePosts posts = {posts} />
      </div>
    )
}

export default Home
