import React, { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../utils/user/userSlice'
import SideBar from '../components/SideBar'
import UserProfile from '../components/UserProfile'
import Pins from './Pins'
// import { client } from '../client'
import { userQuery } from '../utils/data'
import logo from '../assets/logo.png'
import Login from '../components/Login'
import Spinner from '../components/Spinner'


const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch(setUser());

  const scrollRef = useRef(null)
  // const [user, setupUser] = useState(null)


  const user = useSelector(state => state.user.user)

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo') !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : localStorage.clear();
    if (userInfo)
      dispatch(setUser(userInfo))
    else
      navigate('/login')

    // setupUser(useSelector(state => state.user))
  }, [])





  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <SideBar />
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>

          <HiMenu fontSize={40} className='cursor-pointer text-2xl' onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={logo} alt='logo' className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.photo} alt='logo' className='w-10 rounded-lg' />
          </Link>
        </div>

        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            <SideBar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile />} />
          <Route path='/*' element={<Pins />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home