import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowSmRight, HiDocumentText } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { signoutSuccess } from '../redux/user/userSlice'

export default function DashSidebar() {
    const dispatch = useDispatch()
    const location = useLocation()
    const [tab, setTab] = useState('');
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      console.log(tabFromUrl)
      setTab(tabFromUrl)
    }, [location.search])

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
    <Sidebar className='w-full md:w-56 md:h-screen'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item 
                        active={tab === 'profile' } 
                        icon={HiUser} label={'User'} 
                        labelColor='dark'
                        as='div' // So you don't have a link(Sidebar.Item has a <a></a> tag) within a link(<Link></Link> tag)
                    >
                        Profile
                    </Sidebar.Item>
                </Link>
                <Link to='/dashboard?tab=posts'>
                    <Sidebar.Item
                        active={tab === 'posts'}
                        icon={HiDocumentText}
                        as='div'
                    >
                        Posts
                    </Sidebar.Item>
                </Link>
                <Sidebar.Item 
                    icon={HiArrowSmRight} 
                    className="cursor-pointer"
                    onClick={handleSignout}
                >
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
