import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
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
                <FileInput typeof='file' accept='image/*' />
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm'>
                    Upload image
                </Button>
            </div>
            <ReactQuill theme='snow'  placeholder='Describe your trip...' className='h-72 mb-12' />
            <Button type='submit' gradientDuoTone='purpleToPink'>
                Publish
            </Button>
        </form>
    </div>
  )
}
