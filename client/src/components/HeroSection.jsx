import { Button } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
// import imageBG from "../assets/images/image5.png"
// import imageBG from "../assets/images/image6.png"
import imageBG from "../assets/images/imageManBlog.png"
import { FaPencilAlt } from "react-icons/fa";

// teal-500

export default function HeroSection() {
    const { currentUser } = useSelector((state) => state.user)
  return (
    <div className='relative min-h-screen flex flex-col mt-16 md:mt-0 md:flex-row justify-center gap-5 items-center'>
      {/* Prominent Heading  mt-[calc(-50px)] bg-opacity-5 bg-gray-500 */}
      <div className="pl-10 lg:pl-0">
        <div className='text-5xl poppingsFont mb-8 leading-12'>
            <h1>
            Unleash Your <span className='kalamFont text-amber-300'>Creativity</span>
            </h1> 
            <h1 className='flex items-center gap-3'>
                with
                <span className='flex items-center gap-2 pacificoFont text-cyan-400'>
                    <FaPencilAlt />  
                    InkWell
                </span> 
            </h1>
        </div>
        <p className='text-xl'>
            Join us to share your voice, explore new ideas, <br/> and connect with fellow creatives.
        </p>
        {/* call-to-action */}
        <div className="flex gap-4 mt-8">
            { currentUser ? (
            <Link to={'/create-post'}>
                <Button size='lg' gradientDuoTone="pinkToOrange">
                    Start Writing   
                </Button>
            </Link>) : (
            <Link to={'/sign-in'}>
                <Button size='lg' gradientDuoTone="pinkToOrange">
                    Start Writing
                </Button>
            </Link>
            )}

            <Link to={'/posts'}>
                <Button outline size='lg' gradientDuoTone="pinkToOrange" >
                    Explore Articles
                </Button>
            </Link>
            
        </div>
      </div>
      <div className="w-[calc(500px)] h-[calc(500px)] ">
        <img src={imageBG} className='object-cover w-full' />
      </div>

    </div>
  )
}
