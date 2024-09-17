import React from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import shareVideo from '../assets/share.mp4'
import logo from '../assets/logo.png';

const Login = () => {
  console.log(process.env.REACT_APP_BACKEND_URI)

  const navigate = useNavigate()

  const saveDataToLocalStorage = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const googleResponse = async (res) => {
    try {
      const decode = jwtDecode(res.credential);
      const { picture, name, sub } = decode;
      const user = {
        name: name,
        uid: sub,
        photo: picture
      }

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/v1/user/login`, user, {
        withCredentials: true
      });

      if(data) {
        saveDataToLocalStorage(data.userInfo)
        navigate('/')
      }

    } catch (err) {
      console.log(err);
    }
  }



  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        ></video>

        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width="130px" alt="logo" />
          </div>

          <div className='shadow-2xl'>
            <GoogleLogin
              onSuccess={credentialResponse => {
                googleResponse(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login