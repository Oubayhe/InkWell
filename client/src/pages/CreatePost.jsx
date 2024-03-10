import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import SlideImages from '../components/SlideImages';

export default function CreatePost() {
    const [files, setFiles] = useState({})
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [images, setImages] = useState([{url: "./images/essaouira.jpeg", caption: 'image 1'}, {url: "../assets/images/test1image.bmp", caption: 'image 2'}])
    

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
                            console.log(files[i].name)
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

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form action="" className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
                <Select>
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
                {console.log(files)}
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
            {images && (
                <SlideImages images={images} />
                // console.log(images)

                
            )}
            <ReactQuill theme='snow'  placeholder='Describe your trip...' className='h-72 mb-12' />
            <Button type='submit' gradientDuoTone='purpleToPink'>
                Publish
            </Button>
        </form>
    </div>
  )
}
