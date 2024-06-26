import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import SlideImages from '../components/SlideImages';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import LittleImages from '../components/LittleImages';

export default function UpdatePost() {
    const [files, setFiles] = useState({})
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [images, setImages] = useState([])
    const [publishError, setPublishError] = useState(null)
    const { postId } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useSelector((state) => state.user)
    const [numberImgBeforeUpdating, setNumbermberImgBeforeUpdating] = useState(0)

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`)
                const data = await res.json()
                if (!res.ok) {
                    setPublishError(data.message)
                    return
                } 
                if (res.ok) {
                    setPublishError(null)
                    setFormData(data.posts[0])
                    setImages(data.posts[0].images)
                    setNumbermberImgBeforeUpdating(data.posts[0].images.length)
                }}
            
            fetchPost()
        } catch (error) {
            
        }
    }, [postId])

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                setPublishError(data.message)
                return
            }
            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError('Something went wrong')
        }
    }

    const handleUploadImage = async () => {
        for (let i = 0; i < files.length; i++){
            try {
                if(!files[i]){
                    setImageUploadError('Please select an image')
                    return
                }
                setImageUploadError(null)
                const storage = getStorage(app)
                const fileName = new Date().getTime() + '-' + files[i].name
                const storageRef = ref(storage, fileName)
                const uploadTask = uploadBytesResumable(storageRef, files[i])
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        setImageUploadProgress(((progress / files.length) * (i+1)))
                    },
                    (error) => {
                        setImageUploadError('Image upload failed')
                        setImageUploadProgress(null)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setImageUploadError(null)
                            setImageUploadProgress(null)
                            setImages(prevImages => [...prevImages, { url: downloadURL, caption: files[i].name }])
                        })
                    }
                )
            } catch (error) {
                setImageUploadError('Image upload failed')
                setImageUploadProgress(null)
            }
        }
    }

    useEffect(() => {
        setFormData(prevFormData => ({...prevFormData, images: images}));
    }, [images])

    const handleDeleteImage = (imageCaption) => {
        setNumbermberImgBeforeUpdating(numberImgBeforeUpdating - 1)
        setImages(images.filter((imageItem) => imageItem.caption != imageCaption ))
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
        "Religion",
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
        "Philosophy",
        "Current Events and News Analysis"
    ];


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput 
                    type='text' 
                    placeholder='Title' 
                    id='title' 
                    className='flex-1' 
                    required 
                    onChange={(e) => 
                        setFormData({...formData, title: e.target.value})
                    }
                    value={formData.title}
                />
                <Select
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    value={formData.category}
                >
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
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput 
                    multiple
                    accept='image/*' 
                    onChange={(e) => setFiles(e.target.files)} 
                />
                <Button 
                    type='button' 
                    gradientDuoTone='purpleToBlue' 
                    size='sm'
                    outline
                    onClick={handleUploadImage}
                    disabled={imageUploadProgress}
                >
                    {
                        (imageUploadProgress && files.length > 0) ? 
                        <div className="w-16 h-16">
                            <CircularProgressbar 
                                value={imageUploadProgress} 
                                text={`${imageUploadProgress.toFixed(0) || 0}%`}
                            />
                        </div>
                        : 'Upload image'
                    }
                </Button>
            </div>
            {imageUploadError && (
                <Alert color='failure'>
                    {imageUploadError}
                </Alert>
            )}
            {images.length > 0 && (
                <div className="h-auto">
                    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                        <SlideImages images={images} />
                    </div>
                    <LittleImages images={images} deleteImage={handleDeleteImage} />
                    
                </div>
            )}
            {
                ((files.length > 0) && (files.length != (images.length - numberImgBeforeUpdating))) &&
                <Alert color="warning">
                    You need to uplaod the images after selecting them.
                </Alert>
            }
            <ReactQuill 
                theme='snow'  
                placeholder='Describe your trip...' 
                className='h-72 mb-12' 
                required
                onChange={(value) => {
                    setFormData({...formData, content: value})
                }}
                value={formData.content}
            />
            <Button 
                type='submit' 
                gradientDuoTone='purpleToPink'
                disabled={(files.length > 0) && (files.length != (images.length - numberImgBeforeUpdating))}
            >
                Update post
            </Button>
            { publishError && 
                <Alert color="failure" className="mt-5">
                    {publishError}
                </Alert>
            }
        </form>
    </div>
  )
}
