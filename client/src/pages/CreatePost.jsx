import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import SlideImages from '../components/SlideImages';

export default function CreatePost() {
    const [files, setFiles] = useState({})
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [images, setImages] = useState([])
    const [publishError, setPublishError] = useState(null)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
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
                console.log(error)
            }
        }
    }

    useEffect(() => {
        setFormData(prevFormData => ({...prevFormData, images: images}));
    }, [images])


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
                />
                <Select
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                    <option value="uncategorized">Select a category</option>
                    <option value="organized_vecation">Organized vecation</option>
                    <option value="travel_buddies">Travel Buddies</option>
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
                <SlideImages images={images} />
            )}
            <ReactQuill 
                theme='snow'  
                placeholder='Describe your trip...' 
                className='h-72 mb-12' 
                required
                onChange={(value) => {
                    setFormData({...formData, content: value})
                }}
            />
            <Button type='submit' gradientDuoTone='purpleToPink'>
                Publish
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
