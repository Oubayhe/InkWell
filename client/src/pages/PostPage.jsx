import { Button, Spinner } from 'flowbite-react'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SlideImages from '../components/SlideImages'
import CallToAction from '../components/CallToAction'
import CommentSection from '../components/CommentSection'
import RelatedPosts from '../components/RelatedPosts'

export default function PostPage() {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const [postWriter, setPostWriter] = useState(null)
    const [userId, setUserId] = useState(null)
    

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json()
                if (!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }
                if (res.ok) {
                    setPost(data.posts[0])
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchPost()
    }, [postSlug])

    useEffect(() => {
        const fetchPostWriter = async () => {
            try {
                const res = await fetch(`/api/user/getuser/${post.userId}`)
                const data = await res.json()
                if (!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }
                if (res.ok) {
                    console.log(data)
                    setPostWriter(data)
                    setLoading(false)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchPostWriter()
    }, [post])

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>
    )
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto">
        <h1 className='text-3xl mt-10 p-3 text-center 
        font-serif max-w-2xl mx-auto lg:text-4xl'>
            {post && post.title}
        </h1>
        <Link 
            to={`/posts?category=${post && post.category}`}
            className='self-center mt-5 '
        >
            <Button color='gray' pill size='xs'> {post && post.category} </Button>
        </Link>
        {postWriter &&
        (<Link
            to={`/posts?userId=${post && post.userId}`}
        >
            <div className='flex justify-center items-center mt-4 gap-2'>
                <img 
                    src={postWriter.profilePicture}
                    alt={postWriter.username}
                    className='w-8 h-8 object-cover rounded-full'
                />
                <p>{postWriter.username}</p>
            </div>
        </Link>)}
        {post && (
            <div className="mt-10 p-3 h-96 sm:h-[calc(450px)] xl:h-[calc(450px)] 2xl:h-96 ">
                <SlideImages images={post.images} />
            </div>
        )}
        <div className="flex justify-between p-3 border-b border-slate-500 
            mx-auto w-full max-w-2xl text-xs"
        >
            <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
            <span className='italic'>{post && (post.content.length/1000).toFixed(0)} mins read</span>
        </div>
        <div 
            className='p-3 max-w-2xl mx-auto w-full post-content' 
            dangerouslySetInnerHTML={{__html: post && post.content}}
        >

        </div>
        {/* <div className="max-w-4xl mx-auto w-full">
            <CallToAction />
        </div> */}
        <CommentSection postId={post && post._id} />

        {/* Explore More: Related Reads */}
        <RelatedPosts post={post} />
    </main>
  )
}
