import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom' 
import React from 'react'
import { BsFacebook, BsInstagram, BsGithub, BsTwitterX, BsLinkedin } from 'react-icons/bs'
import { FaPencilAlt } from "react-icons/fa";

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
              <div className="mt-5">
                <Link to="/" className='pacificoFont flex items-center gap-2 self-center whitespace-nowrap text-lg 
                  sm:text-3xl font-semibold dark:text-white'>                  
                  <FaPencilAlt />
                  InkWell
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                <div>
                  <Footer.Title title='About' />
                  <Footer.LinkGroup col >
                    <Footer.Link 
                      href='https://github.com/Oubayhe' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      Otmane Oubayhe Portfolio
                    </Footer.Link>
                    <Footer.Link 
                      href='https://github.com/Oubayhe/InkWell' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      {/* The noopener attribute prevents the new page from being able to access the window.opener property of the opening page. This is a security measure to prevent the newly opened page from manipulating the original page, which could potentially lead to security vulnerabilities. */}
                      {/* The noreferrer attribute prevents the browser from sending the Referer header to the linked page. The Referer header typically contains information about the URL of the page that linked to the current page. By using noreferrer, you prevent the linked page from knowing the URL of the page that referred the user to it. */}
                      InkWell
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
                <div>
                  <Footer.Title title='Follow us' />
                  <Footer.LinkGroup col >
                    <Footer.Link 
                      href='https://github.com/Oubayhe' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      GitHub
                    </Footer.Link>
                    <Footer.Link 
                      href='https://www.instagram.com/oubayheot/' 
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
                      href='https://github.com/Oubayhe/InkWell' 
                      target='_blank' 
                      rel='noopener noreferrer'
                    >
                      Privacy Policy
                    </Footer.Link>
                    <Footer.Link 
                      href='https://github.com/Oubayhe/InkWell' 
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
                href='https://github.com/Oubayhe' 
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
                  href='https://www.instagram.com/oubayheot/' 
                  target='_blank' 
                  icon={BsInstagram} 
                />
                <Footer.Icon  
                  href='https://github.com/Oubayhe' 
                  target='_blank' 
                  icon={BsTwitterX} 
                />
                <Footer.Icon  
                  href='https://www.facebook.com/profile.php?id=100016250447001' 
                  target='_blank' 
                  icon={BsFacebook} 
                />
              </div>
            </div>
        </div>
    </Footer>
  )
}

