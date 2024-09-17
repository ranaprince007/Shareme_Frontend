import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setPins } from '../utils/pins/pinsSlice'


// import { client } from '../client'

import { feedQuery, searchQuery } from '../utils/data'

import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import axios from 'axios'


const Feed = () => {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState([]);

    const { categoryId } = useParams();

    const dispatch = useDispatch()
    const pins = useSelector(state => state.pins.pins)


   


    useEffect(() => {
        setLoading(true)

        if(categoryId) {
            axios
            .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getSimilarPins/${categoryId}`)
            .then((res) => {
              dispatch(setPins(res.data.pins))
              setLoading(false)
            })

        } else {
            axios
                .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getAllPins`)
                .then((res) => {
                    setLoading(false)
                    dispatch(setPins(res.data))
                })
        }
        axios
            .get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/pins/getAllSaved`)
            .then((res) => {
                setSaved(res.data.saved)
            })
    }, [categoryId])

    if(loading)
        return <Spinner message="We are adding new ideas to your feed!"/>

    if(pins?.length <= 0) {
        return (<h2 className='text-center'>No pins found</h2>)
    }

    return (
        <div>
            {pins[0] && <MasonryLayout saved={saved} pins={pins}/>}
        </div>
    )
}

export default Feed