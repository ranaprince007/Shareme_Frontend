import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
// import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import axios from 'axios';
import { useSelector } from 'react-redux';

const randomImg = 'https://source.unsplash.com/random/1600x900/?photography'

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';



const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Created')
  const [activeBtn, setActiveBtn] = useState('created')
  const navigate = useNavigate()
  const { userId } = useParams()
  
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/user/getUserInfo/${userId}`)
      .then((res) => {
        setCurrentUser(res.data.userInfo);
      })
  }, [userId])

  useEffect(() => {
    if (text === 'Created') {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getCreatedPins/${userId}`)
        .then((res) => {
          setPins(res.data.pins)
        })
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getSavedPins/${userId}`)
        .then((res) => {
          setPins(res.data.pins.filter((pin) => pin?.save.some(obj => obj.savedBy === user._id)))
        })
    }

  }, [text, user])



  if (!currentUser) {
    return <Spinner message="Loading Profile..." />
  }





  return (
    <div className='relative pb-2 h-full justify-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImg}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover bg-blend-overlay'
              alt="Banner"
            />
            <img
              src={currentUser?.photo}
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
              alt="user-pic"
            />
            <h1 className='font-bold text-3xl text-center mt-3 '>{currentUser?.name}</h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId == user._id && (
                <button
                  type='button'
                  className='px-2'
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    navigate('/login')
                  }}
                >
                  <AiOutlineLogout color='red' fontSize={25} />
                </button>
              )}
            </div>
          </div>

          <div className='text-center mb-7'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('created')
              }}
              className={`${activeBtn == 'created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('saved')
              }}
              className={`${activeBtn == 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>

          {pins?.length > 0 ? (
            <div className='px-2'>
              <MasonryLayout pins={pins} />
            </div>
          ):(
            <div className='flex  justify-center items-center font-bold w-full text-xl mt-2'>
              No Pins Found
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default UserProfile