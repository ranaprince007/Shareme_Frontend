import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useSelector } from 'react-redux'


// import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/data'
import Spinner from './Spinner'
import axios from 'axios'


const PinDetail = () => {
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState("");
  const [comment, setComment] = useState("")
  const [addingComment, setAddingComment] = useState(false)
  const [postedByUser, setPostedByUser] = useState(null)
  const [comments, setComments] = useState([]);


  const { pinId } = useParams();
  const user = useSelector(state => state.user.user)

  const addComment = () => {
    if (comment) {
      setAddingComment(true)
      console.log(comment, pinId)
      axios.put(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/addComment`, {
        comment,
        pinId,
        userId: user._id
      }).then((res) => {
        setAddingComment(false)
        axios
          .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getPinDetail/${pinId}`)
          .then((res) => {
            setPinDetail(res.data.pin);
          })
          .catch((error) => {
            console.error("Error fetching pin detail:", error);
          });
      })
      // client
      //   .patch(pinId)
      //   .setIfMissing({ comments: [] })
      //   .insert('after', 'comments[-1]', [{
      //     comment,
      //     _key: uuidv4(),
      //     postedBy: {
      //       _type: 'postedBy',
      //       _ref: user._id
      //     }
      //   }])
      //   .commit()
      //   .then(() => {
      //     fetchPinDetail()
      //     setComment('')
      //     setAddingComment(false)
      //   })

    }
  }




  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getPinDetail/${pinId}`)
      .then((res) => {
        setPinDetail(res.data.pin);
      })
      .catch((error) => {
        console.error("Error fetching pin detail:", error);
      });
  }, [pinId]);

  useEffect(() => {
    if (pinDetail) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/user/getUserInfo/${pinDetail.postedBy}`)
        .then((res) => {
          setPostedByUser(res.data.userInfo);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }, [pinDetail]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getComments/${pinId}`)
      .then((res) => {
        setComments(res.data.comments.comments)
      })

  }, [pinDetail])

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getSimilarPins/${pinDetail?.category}`)
      .then((res) => {
        const tempPins = res.data.pins.filter(pin => pin._id !== pinDetail._id)
        setPins(tempPins)
      })
  }, [pinDetail])



  useEffect(() => {
    if (pinDetail?.image) {
      let url = pinDetail.image;
      let index = url.indexOf('upload');
      const result = url.slice(0, 4) + "s" + url.slice(4, index + 6) + "/fl_attachment" + url.slice(index + 6);
      setDownloadUrl(result);
    }
  }, [pinDetail]);


  if (!pinDetail) {
    return <Spinner message="Loading pin...." />
  }




  return (
    <>
      <div className='flex xl:flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img src={pinDetail?.image} alt="user-post"
            className='rounded-xl'
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <a
                href={downloadUrl}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-black h-9 p-2 rounded-full flex items-center justify-center text-dark text-3xl opacity-100 hover:opacity-100 hover:shadow-md outline-none'
              >
                <span className='text-sm text-white px-2'>Download now</span>
                <MdDownloadForOffline color='white' />
              </a>
            </div>
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3 '>
              {pinDetail?.title}
            </h1>
            <p className='mt-3'>
              {pinDetail?.about}
            </p>
          </div>
          <div>
            <Link to={`user-profile/${pinDetail?.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
              <img
                className='w-8 h-8 rounded-full object-cover'
                src={postedByUser?.photo}
                alt='user-profile'
              />
              <p className='font-semibold capitalize'>{postedByUser?.name}</p>
            </Link>
            <h2 className='mt-5 text-2xl'>Comments</h2>
            <div className='max-h-370 overflow-y-auto'>
              {comments?.map((comment, i) => (
                <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                  <Link  to={`user-profile/${comment?.postedBy?._id}`}>
                    <img
                      src={comment.postedBy.photo}
                      alt="user-profile"
                      className='w-10 h-10 rounded-full cursor-pointer'
                    />
                  </Link>

                  <div className='flex flex-col'>
                    <p className='font-bold'>
                      {comment.postedBy.name}
                    </p>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`user-profile/${pinDetail?.postedBy?._id}`}>
              <img
                className='w-10 h-10 rounded-full cursor-pointer'
                src={user?.photo}
                alt='user-profile'
              />
            </Link>
            <input
              type="text"
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              placeholder='Add a comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>

      {pins ? (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 '>
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." />
      )}

    </>
  )
}

export default PinDetail