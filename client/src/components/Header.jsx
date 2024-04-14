import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch, } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signoutSuccess } from '../redux/user/userSlice'
import { FaPencilAlt } from "react-icons/fa";



const Header = ({onSearch}) => {
    const path = useLocation()
    const {currentUser} = useSelector(state => state.user) 
    const dispatch = useDispatch()
    const {theme} = useSelector(state => state.theme)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

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

    const handleSubmit = (e) => {
        
        e.preventDefault()
        console.log(searchTerm)
        onSearch(searchTerm)
        setSearchTerm('')
        navigate('/posts')

    }


  return (
    <Navbar className='border-b-2'>
        <Link to="/" className='pacificoFont flex items-center gap-2 self-center whitespace-nowrap text-sm 
        sm:text-xl font-semibold dark:text-white'>
            <FaPencilAlt />
            InkWell
        </Link>
        <form onSubmit={handleSubmit} className='w-2/5'>
            <TextInput
                type="text"
                placeholder="Search..."
                rightIcon={AiOutlineSearch}
                className=''
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
            />
        </form>
        <div className='flex gap-2 md:order-2'>
            <Button 
                className="w-10 h-10" 
                color='gray' 
                pill
                onClick={()=> { dispatch(toggleTheme()) }}
            >
                {
                    theme === 'dark' ? <FaSun /> : <FaMoon />
                }
            </Button>
            {
                currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar 
                                alt='user'
                                img={currentUser.profilePicture}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            { console.log(currentUser.email, currentUser.username)}
                            <span className='block text-sm'>{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
                    </Dropdown>
                ) : 
                (
                    <Link to="/sign-in">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Sign-in
                        </Button>
                    </Link>
                )
            }
            
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path.pathname === "/"} as={'div'}>
                <Link to="/">Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path.pathname === "/posts"} as={'div'}>
                <Link to="/posts">Posts</Link>
            </Navbar.Link>
            <Navbar.Link active={path.pathname === "/community"} as={'div'}>
                <Link to="/about">Community</Link>
            </Navbar.Link>
            
        </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
