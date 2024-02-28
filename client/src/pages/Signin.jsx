import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const Signup = () => {
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const  { loading, error: errorMessage } = useSelector(state => state.user)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if ( !formData.email || !formData.password){
      dispatch(signInFailure('Please fill out all the fields'))
    }

    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      // We adding this below just to make the function wait for the response of the api before checking out.
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
      }
      
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }

    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className='min-h-screen mt-20'>
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          {/* left */}
          <div className='flex-1'>
            <Link 
              to="/" 
              className='font-bold dark:text-white text-4xl'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purpel-500 to-pink-500 rounded-lg text-white'>Travel</span>
              Together
            </Link>
            <p className='text-sm mt-5'>
              Travel Together helps you find organized trips around the kingdom and the world, Sign In to discover more.
            </p>
          </div>
          {/* right */}
          <div className='flex-1'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div>
                <Label value='Your email' />
                <TextInput
                  type='email'
                  placeholder='name@company.com'
                  id='email'
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value='Your password' />
                <TextInput
                  type='password'
                  placeholder='***********'
                  id='password'
                  onChange={handleChange}
                />
              </div>
              <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
                {
                  loading ? (
                    <>
                      <Spinner size='sm'/>
                      <span className='pl-3'>Loading...</span>
                    </>
                  ) : "Sign In"
                }
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Do not have an account?</span>
              <Link to='/sign-up' className='text-blue-500'>
                Sign Up
              </Link>
            </div>
            {
              errorMessage && (
                <Alert className='mt-5' color='failure'>
                  {errorMessage}
                </Alert>
              )
            }
          </div>
        </div>
    </div>
  )
}

export default Signup
