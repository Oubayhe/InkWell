import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Table, Button } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user)
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`)
        const data = await res.json()
        if(res.ok){
          setUsers(data.users) 
          if(data.users.length < 9){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchUsers()
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users])
        if(data.users.length < 9){
          setShowMore(false)
        }
      }
    } catch (error) {
      
    }
  }

  const handleDeleteUser = () => {

  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      { users.length > 0 ? (
        <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>User image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
          {users.map((user) => { return(
            <Table.Row 
              key = {user._id}
              className='bg-white dark:border-gray-700 dark:bg-gray-800'
            >
              {/* Here below we're using Date, but in the React or Mern TODO app of net ninja, we've used a package that returns the date as "2days ago"... Look for it. */}
              <Table.Cell> 
                {(new Date(user.createdAt)).toLocaleDateString() } 
              </Table.Cell>
              <Table.Cell>
                  <img 
                    src={user.profilePicture}
                    alt={user.username}
                    className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                  />                
              </Table.Cell>
              <Table.Cell>
                  {user.username}
              </Table.Cell>
              <Table.Cell>
                  {user.email}
              </Table.Cell>
              <Table.Cell>
                <span 
                  onClick={() => {
                    setShowModal(true)
                    setUserIdToDelete(user._id)
                  }}
                  className='font-medium text-red-500 hover:underline cursor-pointer'
                >
                  Delete
                </span>
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
                          Are you sure you want to delete this user ?
                      </h3>
                      <div className="flex justify-center gap-4">
                          <Button color='failure' onClick={handleDeleteUser}>
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
        <p>You have no users yet</p>
      )}
    </div>
  )
}
