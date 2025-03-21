import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Singup from './pages/Singup'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import FooterCom from './components/FooterCom'
import PrivateRoute from './components/PrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTheTop from './components/ScrollToTheTop'
import AllPostsPage from './pages/AllPostsPage'
import ErrorPage from './pages/ErrorPage'
import Community from './pages/Community'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const App = () => {

  const queryClient = new QueryClient()

  return (
    <BrowserRouter>
      <ScrollToTheTop />
      <Header />
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/sign-in' element={<Signin />} />
          <Route path='/sign-up' element={<Singup />} />
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/update-post/:postId' element={<UpdatePost />} />
          </Route>
          <Route path='/community' element={<Community />} />
          <Route path='/posts' element={<AllPostsPage />} />
          <Route path='/post/:postSlug' element={<PostPage />} />
          <Route path='*' element={ <ErrorPage />} />
        </Routes>
      </QueryClientProvider>
      <FooterCom />
    </BrowserRouter>
  )
}

export default App
