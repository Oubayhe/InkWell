import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Textarea, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function Comment({comment, onLike, onEdit, onDelete}) {
    const { currentUser } = useSelector((state) => state.user)
    const [user, setUser] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(comment.content)
    const [showModal, setShowModal] = useState(false)
    console.log(user)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/getUser/${comment.userId}`)
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                
            }
        }
        getUser()
    }, [comment])

    const handleSave = async () => {
      try {
        const res = await fetch(`/api/comment/editComment/${comment._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: editedContent,
          }),
        })
        if (res.ok) {
          setIsEditing(false)
          onEdit(comment._id, editedContent)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    const handleEdit = () => {
      setIsEditing(true)
      setEditedContent(comment.content)
    }

    const handleDelete = async () => {
      try {
        const res = await fetch(`/api/comment/deleteComment/${comment._id}`, {
          method: 'DELETE'
        })
        // const data = await res.json()
        if(res.ok) {
          setShowModal(false)
          onDelete(comment._id)
        }
        // if (!res.ok) {
        //   console.log(data.message)
        // }
      } catch (error) {
        console.log(error.message)
      }

    }

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className="flex-shrink-0 mr-3">
        <img 
            src={user.profilePicture} 
            alt={user.username} 
            className='w-10 h-10 rounded-full bg-gray-200'
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
            <span className='font-bold mr-1 text-xs truncate'> 
                {user ? `@${user.username}` : ('anoynymous user')} 
            </span>
            <span className='text-gray-500 text-xs'> 
                {moment(comment.createdAt).fromNow()}
            </span>
        </div>
        { isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                gradientDuoTone={'purpleToBlue'}
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) :
        (<>
          <p className='text-gray-500 pb-2'> {comment.content} </p>
          <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
            <button type='button' 
              className={`text-gray-200 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`} 
              onClick={() => onLike(comment._id)}
            >
              <FaThumbsUp className='text-sm'  />
            </button>
            <p className='text-gray-400'>
              {
                comment.numberOfLikes > 0 && comment.numberOfLikes + " " + 
                (comment.numberOfLikes === 1 ? "like" : "likes")
              }
            </p>
            { currentUser && (
              currentUser._id === comment.userId 
              && (
                <>
                  <button
                    type='button'
                    onClick={handleEdit}
                    className='text-gray-400 hover:text-blue-500'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowModal(true)}
                    className='text-gray-400 hover:text-red-500'
                  >
                    Delete
                  </button>
                </>
              )
            )}
            </div>
          </>
          )}
      </div>
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
                          Are you sure you want to delete this comment ?
                      </h3>
                      <div className="flex justify-center gap-4">
                          <Button color='failure' onClick={handleDelete}>
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
    </div>
  )
}
