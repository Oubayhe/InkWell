import { Button } from 'flowbite-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex flex-col items-center'>
      <h1 className="oops font-bold mb-7">
        Ooops !
      </h1>
      <div className="text-4xl font-bold">
        404 - Page Not Found
      </div>
      <p className='text-center dark:text-gray-400 text-gray-700 poppingsFont my-8'>
        The page you are looking for does not exist. How you got here is a mystery. <br/>
        But don't worry, you can always go back home to read articles and discover the bottom of it.
      </p>
      <Button type='button' onClick={() => navigate('/')} pill gradientDuoTone="pinkToOrange">
        GO TO HOMEPAGE
      </Button>
    </div>
  )
}
