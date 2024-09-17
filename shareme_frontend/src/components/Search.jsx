import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setPins } from '../utils/pins/pinsSlice'

import MasonryLayout from './MasonryLayout'
// import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'
import axios from 'axios'



const Search = ({ searchTerm }) => {
  const [loading, setLoading] = useState(false);
  const pins = useSelector(state => state.pins.pins)
  const dispatch = useDispatch()

  useEffect(() => {
    if(searchTerm) {
      setLoading(true)
      // client
      //   .fetch(query)
      //   .then((data) => {
      //     setPins(data)
      //     setLoading(false)
      //   })
      axios
        .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/searchPin/${searchTerm}`)
        .then((res) => {
          dispatch(setPins(res.data.pins))
          setLoading(false)
        })

    } else {
      // client
      //   .fetch(feedQuery)
      //   .then((data) => {
      //     setPins(data)
      //     setLoading(false)
      //   })
      axios
                .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getAllPins`)
                .then((res) => {
                    setLoading(false)
                    dispatch(setPins(res.data))
                })
    }
  }, [searchTerm])
  

  return (
    <div>
      {loading && <Spinner message="Searching for pins..."/>}
      {pins?.length > 0 && <MasonryLayout pins={pins} />}
      {pins?.length == 0 && searchTerm != '' && !loading && (
        <div className='mt-10 text-center text-xl'>
          No pins found
        </div>
      )}
    </div>
  )
}

export default Search