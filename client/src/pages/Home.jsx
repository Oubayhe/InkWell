import React, { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import ViewSomePosts from '../components/ViewSomePosts'
import { Spinner } from 'flowbite-react'
import { useQuery } from '@tanstack/react-query'


const Home = () => {

  const getSixPosts = async () => {
    const res = await fetch('/api/post/getposts?limit=6')
    const data = await res.json()
    return data.posts
  }

  const { data: posts, isLoading, error } = useQuery({
    queryFn: getSixPosts,
    queryKey: ["home_posts"]
  })

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size="xl" />
    </div>
  )

  if (error) return (
    <div>
      There has been an error: {error.message}
    </div>
  )

    if (!isLoading && posts) return (
      <div className=''>
        <HeroSection />
        <ViewSomePosts posts = {posts} />
      </div>
    )
}

export default Home
