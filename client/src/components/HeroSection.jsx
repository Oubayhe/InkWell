import { Button } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import imageBG from "../assets/images/image5.png"
import imageLittle from "../assets/images/image6.png"
import { FaPencilAlt } from "react-icons/fa";

// teal-500

export default function HeroSection() {
    const { currentUser } = useSelector((state) => state.user)
  return (
    <div className='min-h-screen flex justify-between pt-20 bg-teal-500 bg-opacity-5 '>
      {/* Prominent Heading  mt-[calc(-50px)] bg-opacity-5 bg-gray-500 */}
      <div className="z-10 mx-12 w-1/2 h-72  px-4 py-6  rounded-xl ">
        <div className='text-5xl poppingsFont mb-2 leading-normal'>
            <h1>
            Unleash Your <span className='kalamFont text-cyan-400'>Creativity</span>
            </h1> 
            <h1 className='flex items-center gap-3'>
                with
                <span className='flex items-center gap-2 pacificoFont text-teal-500'>
                    <FaPencilAlt />  
                    InkWell
                </span> 
            </h1>
        </div>
        <p>
            Join us to share your voice, explore new ideas, <br/> and connect with fellow creatives.
        </p>
        {/* call-to-action */}
        <div className="flex gap-4 mt-6">
            { currentUser ? (
            <Link to={'/create-post'}>
                <Button gradientDuoTone="purpleToBlue">
                    Start Writing   
                </Button>
            </Link>) : (
            <Link to={'/sign-in'}>
                <Button gradientDuoTone="purpleToBlue">
                    Start Writing
                </Button>
            </Link>
            )}

            <Link to={'/posts'}>
                <Button outline gradientMonochrome="cyan" >
                    Explore Stories
                </Button>
            </Link>
            
        </div>
      </div>
      <div className="absolute right-5 top-20 w-[calc(550px)] h-[calc(550px)]">
        <img src={imageBG} className='object-cover w-full' />
      </div>

    </div>
  )
}
