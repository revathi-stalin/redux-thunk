import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { MyVerticallyCenteredModal } from './UpdateTask';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTaskFromServer, getTasksFromServer, removeTaskFromList, setselectedTask } from '../slices/taskSlice';

export const TaskList = () => {

  const {taskList} = useSelector((state) => state.tasksKey )
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);
  
  const updateTask = (task) => {
    setModalShow(true);
    dispatch(setselectedTask(task))
  }
  const deleteTask = (task) => {
    dispatch(deleteTaskFromServer(task))
    .unwrap()
    .then(() => {
        dispatch(removeTaskFromList(task))
    })
  }

  useEffect(() => {
     dispatch(getTasksFromServer())
  },[dispatch])

  return (
    <>
        <Table striped bordered hover>
        <thead>
            <tr className='text-center'>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody> 
            {
              taskList && taskList.map((task, index) => {
                  return (
                    <tr className='text-center' key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                        <Button variant="primary" className='mx-3' onClick={() => updateTask(task)}>
                            <i className="bi bi-pencil-square"></i>
                        </Button>{' '}
                        <Button variant="primary" onClick={() => deleteTask(task)}>
                            <i className="bi bi-trash3"></i>
                        </Button>{' '}
                    </td>
                    </tr>
                  )
              })
            }
        </tbody>
        </Table>
        <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
      />
    </>
  )
}
