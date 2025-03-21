import React, { Suspense } from 'react'
import HeroSection from '../components/HeroSection'
import ViewSomePosts from '../components/ViewSomePosts'
import LoadingHomePage from '../loading_pages/LoadingHomePage'
import { useQuery } from '@tanstack/react-query'

const PostsSection = () => {
  const getSixPosts = async () => {
    
    const res = await fetch('/api/post/getposts?limit=6')
    const data = await res.json()
    
    return data.posts
  }

  const { data: posts, error } = useQuery({
    queryFn: getSixPosts,
    queryKey: ["home_posts"],
    suspense: true
  })

  if (error) return (
    <div>
      There has been an error: {error.message}
    </div>
  )

  return <ViewSomePosts posts={posts} />
}

const Home = () => {
  return (
    <div className=''>
      <HeroSection />
      <Suspense fallback={<LoadingHomePage />}>
        <PostsSection />
      </Suspense>
    </div>
  )
}

export default Home