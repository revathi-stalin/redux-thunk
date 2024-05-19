import React from 'react'
import { useSelector } from 'react-redux'

export const Navbar = () => {
  
  const {taskList, error} = useSelector((state) => state.tasksKey)

  return (
    <>
    <h1 className='text-center my-4 text-primary'>Project management</h1>
    <p className='text-center '>{`Currently ${taskList.length} tasks pending`}</p>
     
     {
       (error !== '') ? <h5 className='text-center my-4 text-danger'>{error}</h5> : null
     }

    </>
  )
}
