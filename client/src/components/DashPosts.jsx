import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  console.log(userPosts)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.posts) // in the data we have posts, totalPosts and lastMonthPosts
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchPosts()
  }, [currentUser._id])

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      { userPosts.length > 0 ? (
        <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Post image</Table.HeadCell>
            <Table.HeadCell>Post title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
          {userPosts.map((post) => { return(
            <Table.Row 
              key = {post._id}
              className='bg-white dark:border-gray-700 dark:bg-gray-800'
            >
              {/* Here below we're using Date, but in the React or Mern TODO app of net ninja, we've used a package that returns the date as "2days ago"... Look for it. */}
              <Table.Cell> 
                {(new Date(post.updatedAt)).toLocaleDateString() } 
              </Table.Cell>
              <Table.Cell>
                <Link to={`/post/${post.slug}`}>
                  <img 
                    src={post.images[0].url}
                    alt={post.title}
                    className='w-20 h-10 object-cover bg-gray-500'
                  />
                </Link>
              </Table.Cell>
              <Table.Cell>
                <Link to={`/post/${post.slug}`}> 
                  {post.title}
                </Link>
              </Table.Cell>
              <Table.Cell>{(post.category).replace('_', ' ')}</Table.Cell>
              <Table.Cell>
                <span className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
              </Table.Cell>
              <Table.Cell>
                <Link className='text-teal-500 hover:underline cursor-pointer' to={`/update-post/${post._id}`}>
                  <span>Edit</span>
                </Link>
              </Table.Cell>
            </Table.Row>
          )
          })}
          </Table.Body>
        </Table>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
