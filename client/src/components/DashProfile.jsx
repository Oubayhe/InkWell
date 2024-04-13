import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, 
    updateSuccess, 
    updateFailure, 
    deleteUserFailure, 
    deleteUserStart, 
    deleteUserSuccess,
    signoutSuccess,
} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom'

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null)
    const [imageuploading, setImageUploading] = useState(false)
    const [updateMessage, setUpdateMessage] = useState(null)
    const [updateErrorMsg, setUpdateErrorMsg] = useState(null)
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef()

    // For Deleting the Account
    const [showModal, setShowModal] = useState(false)

    const dispatch = useDispatch()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file){
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if(imageFile) {
            uploadImage()
        }
    }, [imageFile])

    // If you can check the type of the input before
    const uploadImage = async () => {
        setImageUploading(true)
        setImageFileUploadingError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadingProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadingError('Could not upload image (File must be less than 2MB)')
                setImageFileUploadingProgress(null)
                setImageFileUrl(null)
                setImageFile(null)
                setImageUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setFormData({...formData, profilePicture: downloadURL})
                    setImageUploading(false)
                })
            }
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setUpdateErrorMsg(null)
        setUpdateMessage(null)

        if (Object.keys(formData).length === 0) {
            setUpdateErrorMsg("No changes made.")
            return;
        }
        if(imageuploading) {
            setUpdateErrorMsg("Please wait for Image to upload.")
            return
        }
        try {
            dispatch(updateStart)
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if(!res.ok) {
                dispatch(updateFailure(data.message))
                setUpdateErrorMsg(data.message)
            } else {
                dispatch(updateSuccess(data))
                setUpdateMessage("User's profile was updated successfully.")
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
        }
    }

    const handleDeleteAccount = async () => {
        dispatch(deleteUserStart)
        try {
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            
        }
    }


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profie</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4' action="">
            <input 
                type='file' 
                accept='image/*' 
                onChange={handleImageChange} 
                ref={filePickerRef}
                hidden
            />
            <div className="relative w-32 h-32 self-center cursor-pointer 
            shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current.click()}
            >
                { imageFileUploadingProgress && (
                    <CircularProgressbar 
                        value={imageFileUploadingProgress || 0} 
                        text={`${imageFileUploadingProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root:{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`,
                            },

                        }}
                    />
                )}
                <img 
                    src={imageFileUrl || currentUser.profilePicture} 
                    alt="user" 
                    className={ `ounded-full w-full h-full object-cover border-8 border-[lightgray] 
                        ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`}
                />
            </div>
            {imageFileUploadingError && (
                <Alert color='failure'>
                    {imageFileUploadingError}
                </Alert>
            )}
            <TextInput 
                type='text' 
                id='username' 
                placeholder='username' 
                defaultValue={currentUser.username} 
                onChange={handleChange}
            />
            <TextInput 
                type='email' 
                id='email' 
                placeholder='email' 
                defaultValue={currentUser.email} 
                onChange={handleChange}
            />
            <TextInput 
                type='password' 
                id='password' 
                placeholder='password' 
                onChange={handleChange}
            />
            <Button 
                type='submit' 
                gradientDuoTone='cyanToBlue' 
                outline
                disabled={loading || imageuploading}
            >
                {(loading || imageuploading) ? 'Loading...' : 'Update'}
            </Button>
            <Link to={'create-post'}>
                <Button
                    type='button'
                    gradientDuoTone='purpleToBlue'
                    className='w-full'
                >
                    Create a post
                </Button>
            </Link>
            
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span onClick={()=>setShowModal(true)} className='cursor-pointer hover:underline'>Delete Account</span>
            <span onClick={handleSignout} className='cursor-pointer hover:underline'>Sign Out</span>
        </div>
        {updateMessage && (
            <Alert color='success' className='mt-5'>
                {updateMessage}
            </Alert>
        )}
        {updateErrorMsg && (
            <Alert color='failure' className='mt-5'>
                {updateErrorMsg}
            </Alert>
        )}
        {error && (
            <Alert color='failure' className='mt-5'>
                {error}
            </Alert>
        )}
        <Modal 
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
                        Are you sure you want to delete your account ?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color='failure' onClick={handleDeleteAccount}>
                            Yes, I'm sure
                        </Button>
                        <Button color='gray' onClick={()=>setShowModal(false)}>
                            No, cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
