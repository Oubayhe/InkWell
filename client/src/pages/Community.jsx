import { Card, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Community() {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [searchedUser, setSearchedUser] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/user/getusers')
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users.reverse())
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

    
    if (loading) {
        <div className="flex justify-center items-center h-screen">
            <Spinner size="xl" />
        </div>
    }

  return (
    <div className='min-h-screen my-10 flex flex-col items-center'>
        {/* Search bar for a certain user */}
        <TextInput 
            placeholder='Find a user...'
            className='w-2/3 mb-5'
            type='text' 
            onChange={(e)=>setSearchedUser(e.target.value)} 
        />
        {/* View our community of writer and readers */}
        <div className="flex flex-wrap justify-center gap-4 py-10">
        {users.map((user) => {
            if (user.username.includes(searchedUser)) {
                return (
                    <Link key={user._id} to={`/posts?userId=${user._id}`} className='hover:scale-105 ease-in-out duration-300'>
                        <Card className='w-80 h-52'>
                            <div className="flex flex-col justify-center items-center">
                                <img 
                                    className='w-24 h-24 rounded-full shadow-lg mb-3'  
                                    alt={user.username}
                                    src={user.profilePicture}
                                />
                                <h4 className='text-xl font-medium text-gray-900 dark:text-white'>{user.username}</h4>
                            </div>
                        </Card>
                    </Link>)
            }
            
        })}
        </div>
        {/* Join our community, to share your posts and interact with other users */}
    </div>
  )
}
