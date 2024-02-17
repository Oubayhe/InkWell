import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom' 
import React from 'react'
import { BsFacebook, BsInstagram, BsGithub, BsTwitterX, BsLinkedin } from 'react-icons/bs'

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
              <div className="mt-5">
                <Link to="/" className='self-center whitespace-nowrap text-lg 
                  sm:text-xl font-semibold dark:text-white'>
                  <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purpel-500 to-pink-500 rounded-lg text-white'>Travel</span>
                  Together
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                <div>
                  <Footer.Title title='About' />
                  <Footer.LinkGroup col >
                    <Footer.Link 
                      href='https://www.google.com' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      Otmane Oubayhe Portfolio
                    </Footer.Link>
                    <Footer.Link 
                      href='https://www.google.com' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      {/* The noopener attribute prevents the new page from being able to access the window.opener property of the opening page. This is a security measure to prevent the newly opened page from manipulating the original page, which could potentially lead to security vulnerabilities. */}
                      {/* The noreferrer attribute prevents the browser from sending the Referer header to the linked page. The Referer header typically contains information about the URL of the page that linked to the current page. By using noreferrer, you prevent the linked page from knowing the URL of the page that referred the user to it. */}
                      Travel Together
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
                <div>
                  <Footer.Title title='Follow us' />
                  <Footer.LinkGroup col >
                    <Footer.Link 
                      href='https://www.github.com' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      GitHub
                    </Footer.Link>
                    <Footer.Link 
                      href='https://www.instagram.com' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      Instagram
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
                <div>
                  <Footer.Title title='Legal' />
                  <Footer.LinkGroup col >
                    <Footer.Link 
                      href='https://www.github.com' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      Privacy Policy
                    </Footer.Link>
                    <Footer.Link 
                      href='https://www.instagram.com' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      Terms & Conditions
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
              </div>
            </div>
            <Footer.Divider />
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
              <Footer.Copyright 
                href='#' 
                by="Oubayhe Otmane" 
                year={new Date().getFullYear()} 
              />
              <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                <Footer.Icon 
                  href='https://www.linkedin.com/in/otmane-oubayhe-284941262/' 
                  target='_blank' 
                  icon={BsLinkedin} 
                />
                <Footer.Icon 
                  href='https://github.com/Oubayhe' 
                  target='_blank' 
                  icon={BsGithub} 
                />
                <Footer.Icon  
                  href='https://github.com/Oubayhe' 
                  target='_blank' 
                  icon={BsInstagram} 
                />
                <Footer.Icon  
                  href='https://github.com/Oubayhe' 
                  target='_blank' 
                  icon={BsTwitterX} 
                />
                <Footer.Icon  
                  href='https://github.com/Oubayhe' 
                  target='_blank' 
                  icon={BsFacebook} 
                />
              </div>
            </div>
        </div>
    </Footer>
  )
}

