import React, { useEffect, useState } from 'react'
// import { urlFor } from '../client'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { useSelector, useDispatch } from 'react-redux'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { setPins } from '../utils/pins/pinsSlice'

import axios from 'axios'



const Pin = ({ pin: { postedBy, image, _id, save }}) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const [postedByUser, setPostedByUser] = useState(null)
    const [downloadUrl, setDownloadUrl] = useState("");
    // const [alreadySaved, setAlreadySaved] = useState(false);
    const user = useSelector(state => state.user.user)

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const alreadySaved = save?.some(obj => obj.savedBy === user._id);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/user/getUserInfo/${postedBy}`)
            .then((res) => {
                setPostedByUser(res.data.userInfo)
            })
        let url = image;
        let index = url.indexOf('upload')
        const result = url.slice(0, 4) + "s" + url.slice(4, index + 6) + "/fl_attachment" + url.slice(index + 6);
        setDownloadUrl(result)


    }, [])

    

    const savePin = (id) => {
        if (!alreadySaved) {
            setSavingPost(true);
            axios
                .put(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/savePin`, { pinId: id, userId: user._id })
                .then((res) => {
                    setSavingPost(false);
                    axios
                        .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getAllPins`)
                        .then((res) => {
                            dispatch(setPins(res.data))
                        })
                })
        }
    }

    const deletePin = (id) => {
        axios
            .delete(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/delete`, { data: { _id: id } })
            .then((res) => {
                axios
                    .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getAllPins`)
                    .then((res) => {
                        dispatch(setPins(res.data))
                    })
            })
    }


    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >

                <img
                    src={image}
                    alt="user-post"
                    className={`rounded-lg w-full transition-transform duration-200 ${postHovered ? 'scale-150' : ''}`}
                />

                {postHovered && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a
                                    href={downloadUrl}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                                    {save?.length + ` `}
                                    Saved
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                >
                                    {savingPost ? 'Saving' : 'Save'}
                                </button>
                            )}
                        </div>
                        <div className='flex justify-end px-1 items-center w-full'>

                            {postedByUser?._id == user?._id && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id)
                                    }}
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-2 py-2 text-base rounded-3xl hover:shadow-md outline-none'
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`user-profile/${postedByUser?._id}`} className='flex gap-2 mt-2 items-center'>
                <img
                    className='w-8 h-8 rounded-full object-cover'
                    src={postedByUser && postedByUser?.photo}
                    alt='user-profile'
                />
                <p className='font-semibold capitalize'>{postedByUser?.name}</p>
            </Link>
        </div>
    )
}

export default Pin