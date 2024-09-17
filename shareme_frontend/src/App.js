import React, {useEffect, useState} from 'react'
import './index.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';


import Login from './components/Login'
import Home from './container/Home'

const App = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)

    useEffect(() => {
        const user = localStorage.getItem('userInfo') !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : localStorage.clear();

        if (!user) navigate('/login');
    }, []);
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
            <Routes>
                <Route path='login' element={<Login />} />
                <Route path='/*' element={<Home user={user} setUser={setUser}/>} />
            </Routes>
        </GoogleOAuthProvider>
    )
}

export default App