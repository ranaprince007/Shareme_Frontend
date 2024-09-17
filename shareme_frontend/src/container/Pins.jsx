import React, { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import Navbar from '../components/Navbar'
import Feed from '../components/Feed'
import CreatePin from '../components/CreatePin'
import PinDetail from '../components/PinDetail'
import Search from '../components/Search'
import { useSelector } from 'react-redux'

const Pins = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const user = useSelector(state => state.user.user);
 
  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed/>} />
          <Route path='/category/:categoryId' element={<Feed />} />
          <Route path='/pin-detail/:pinId' element={<PinDetail />} />
          <Route path='/create-pin' element={<CreatePin />} />
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins