import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Table, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.posts) // in the data we have posts, totalPosts and lastMonthPosts
          if(data.posts.length < 9){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchPosts()
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts])
        if(data.posts.length < 9){
          setShowMore(false)
        }
      }
    } catch (error) {
      
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false)
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserPosts((prev) => 
          prev.filter((post) => post._id !== postIdToDelete)
        )
      }
    } catch (error) {
      
    }
  }


  return (
    <div className="min-h-screen w-full flex flex-col gap-4">
      <Link to='/create-post' className='w-full flex justify-end'>
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            className='w-full md:w-1/4 mx-2 mt-2 '
            size='lg'
        >
            Write a post
        </Button>
      </Link>
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
                <span 
                  onClick={() => {
                    setShowModal(true)
                    setPostIdToDelete(post._id)
                  }}
                  className='font-medium text-red-500 hover:underline cursor-pointer'
                >
                  Delete
                </span>
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
        {
          showMore && (
            <button 
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )
        }
        {
          showModal &&
          (<Modal 
            show={showModal} 
            onClose={() => setShowModal(false)}
            popup
            size='md'
          >
            <Modal.Header/>
              <Modal.Body>
                  <div className="text-center">
                      <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                          Are you sure you want to delete this post ?
                      </h3>
                      <div className="flex justify-center gap-4">
                          <Button color='failure' onClick={handleDeletePost}>
                              Yes, I'm sure
                          </Button>
                          <Button color='gray' onClick={()=>setShowModal(false)}>
                              No, cancel
                          </Button>
                      </div>
                  </div>
              </Modal.Body>
          </Modal>)
        }
        </>
      ) : (
        <p>You have no posts yet</p>
      )}
    </div>
    </div>
  )
}
