import React, { useEffect, useState } from 'react'
import SlideImages from '../components/SlideImages'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { Button, Select, Spinner } from 'flowbite-react'

export default function AllPostsPage({searchTerm}) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(6)
    const [startIndex, setStartIndex] = useState(0)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState(1)
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?searchTerm=${searchTerm}`)
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
            const res = await fetch(`/api/post/getposts?searchTerm=${search}`)
            const data = await res.json()
            if (res.ok) {
                setPosts(data.posts)
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

    
    if (posts.length == 0 || users.length == 0 || loading) return (
        <div className="flex justify-center items-center h-screen">
            <Spinner size="xl" />
        </div>
    )
  return (
    
    <div className="flex justify-center relative">
        {/* The Filtering Sidebar */}
        <div className="w-3/5 border-r-2 dark:bg-slate-600 bg-gray-50 border-gray-200 dark:border-slate-700 ">
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
            <Select>
                <option value="All">All</option>
                {categories.map((categoryItem) => {
                    return (
                        <option key={categories.indexOf(categoryItem)} value={categoryItem}>{categoryItem} </option>
                    )
                })}
            </Select>
            <Select>
                <option value="All">All</option>
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
            <Select>
                <option value={-1}>Oldest</option>
                <option value={1}>Newest</option>
            </Select>
            <Button type='submit' className='mt-6' gradientDuoTone="purpleToBlue">Filter</Button>
            </form>
        </div>
        <div className="">
        {posts.map((post) => {
        return (
            <div key={post._id} className="py-6 border-b border-gray-400 w-10/12 h-[calc(500px)] lg:w-4/5 lg:h-72 
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
                </div>
            </div>
        )
    })}
    </div>
    </div>
  )
}
