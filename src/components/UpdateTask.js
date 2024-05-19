import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskInList, updateTaskInServer } from '../slices/taskSlice';

export const MyVerticallyCenteredModal = (props) => {
    
    const {selectedTask} = useSelector((state) => state.tasksKey);
    const dispatch = useDispatch();
   
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [id, setId] = useState(0);

    const updateTask = () => {
        props.onHide();
        // dispatch(updateTaskInList({id,title,description}));
        dispatch(updateTaskInServer({id,title,description}))
    }
    
    useEffect(() => {
      if (selectedTask && Object.keys(selectedTask).length !== 0) {
        setTitle(selectedTask.title)
        setDescription(selectedTask.description)
        setId(selectedTask.id)
      }
    }, [selectedTask])

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Task
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Task Title</Form.Label>
                <Form.Control type="text" placeholder="Enter Task title"
                value={title} onChange={(e) => setTitle(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Task Description</Form.Label>
                <Form.Control type="text" placeholder="Enter Task Description" 
                value={description} onChange={(e) => setDescription(e.target.value)}/>
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <div className='text-end'>
            <Button variant="primary" type="submit" onClick={(e) => updateTask(e)}>
                Update Task
            </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
