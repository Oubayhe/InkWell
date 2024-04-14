import React, { useEffect, useState } from 'react'
import SlideImages from '../components/SlideImages'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { Button, Select, Spinner } from 'flowbite-react'

export default function AllPostsPage({searchTerm}) {
    const [noPostFound, setNoPostFound] = useState(false)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(6)
    const [startIndex, setStartIndex] = useState(0)
    const [search, setSearch] = useState('')
    const [order, setOrder] = useState('des')
    const [users, setUsers] = useState([])
    const [category, setCategory] = useState('')
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?searchTerm=${searchTerm}&&limit=${limit}`)
                const data = await res.json()
                if (res.ok) {
                    setPosts(data.posts)
                    setStartIndex(data.posts.length)
                    setLoading(false)
                }
                if (!res.ok) {
                    console.log(data.message)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error.message)
                setLoading(false)
            }
        }
        fetchPosts()
    }, [searchTerm])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/user/getusers')
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    setLoading(false)
                }
                if (!res.ok) {
                    console.log(data.message)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error.message)
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    function truncateText(content, maxLength) {
        if (content.length <= maxLength) {
            return content;
        } else {
            return content.slice(0, maxLength) + '...';
        }
    }

    // List of all categories:
    const categories = [
        "Creative Writing",
        "Personal Development",
        "Travel",
        "Lifestyle",
        "Food and Cooking",
        "Technology",
        "Arts and Crafts",
        "Photography",
        "Education",
        "Environment and Sustainability",
        "Parenting",
        "Relationships",
        "Finance",
        "Career and Business",
        "Science and Nature",
        "History and Culture",
        "Entertainment",
        "Sports and Fitness",
        "Philosophy and Religion",
        "Current Events and News Analysis"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await fetch(`/api/post/getposts?searchTerm=${search}&&category=${category}&&userId=${userId}&&order=${order}&&limit=${limit}`)
            // const &&startIndex=${startIndex}
            // const res = await fetch(`/api/post/getposts?searchTerm=${search}&&category=${category}`)
            const data = await res.json()
            if (res.ok) {
                setPosts(data.posts)
                setNoPostFound(data.posts.length === 0)
                setLoading(false)
            }
            if (!res.ok) {
                console.log(data.message)
                setLoading(false)
            }
        } catch (error) {
            console.log(data.message)
            setLoading(false)
        }
    }

    
    if ((posts.length == 0 || users.length == 0 || loading) && !noPostFound) return (
        <div className="flex justify-center items-center h-screen">
            {console.log(posts, noPostFound, category, search)}
            <Spinner size="xl" />
        </div>
    )
  return (

    <div className="flex relative min-h-screen">
        {console.log(posts, noPostFound, category, search)}
        {/* The Filtering Sidebar */}
        <div className="w-1/5 border-r-2 dark:bg-slate-600 bg-gray-50 border-gray-200 dark:border-slate-700 ">
            <form onSubmit={handleSubmit} className='mx-4 my-8 flex flex-col gap-2'>
            <div className="relative">
                <input onChange={(e) => {setSearch(e.target.value)}} type="text" id="small_outlined" className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 
                bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-slate-700
                dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 
                transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-slate-600 px-2 peer-focus:px-2 
                peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 
                peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Search term</label>
            </div>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((categoryItem) => {
                    return (
                        <option 
                            key={categories.indexOf(categoryItem)} 
                            value={categoryItem}
                        > 
                            {categoryItem} 
                        </option>
                    )
                })}
            </Select>
            <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
                <option value="">All users</option>
                {users.map((user) => {
                    return (
                        <option 
                            key={user._id} 
                            value={user._id}
                            className='text-blue-500 h-auto'
                        >
                            @{user.username}
                        </option>
                    )
                })}
            </Select>
            <Select value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value='des'>Newest</option>
                <option value='asc'>Oldest</option>
            </Select>
            <Button type='submit' className='mt-6' gradientDuoTone="purpleToBlue">Filter</Button>
            </form>
        </div>
        {noPostFound ? (
                <h1 className='text-5xl font-bold m-4'>No post was found</h1>            
        ) : (
        <div className="w-4/5 relative">
        {posts.map((post) => {
        return (
            <div key={post._id} className="py-6 border-b border-gray-400 h-[calc(500px)] w-11/12 lg:h-72 
            grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 mx-4 ">
                <div className="h-full">
                    <SlideImages images={post.images} />
                </div>
                <div onClick={()=>{navigate(`/post/${post.slug}`)}} className="cursor-pointer mb-2 lg:mx-4 relative">
                    <h1 className='text-3xl poppingsFontBlack mb-2'>{post.title} </h1>
                    <div className='' dangerouslySetInnerHTML={{__html: truncateText(post.content, 100)}}></div>
                    <div className="bottom-0 left-0 absolute font-bold text-gray-500 ">
                        {moment(post.createdAt).format('D MMMM YYYY')}
                    </div>
                    <div className="bottom-0 right-0 absolute italic text-gray-500 ">
                        {(post.content.length/1000).toFixed(0)} mins read
                    </div>
                </div>
            </div>
        )
    })}
    </div>)}
    </div>
  )
}