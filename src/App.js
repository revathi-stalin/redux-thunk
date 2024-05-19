import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/Navbar';
import { AddTask } from './components/AddTask';
import { Container, Row, Col } from 'react-bootstrap';
import { TaskList } from './components/TaskList';

function App() {
  return (
    <Container>
      <Navbar />
      <Row className="justify-content-md-center">
        <Col xs lg="6">
            <AddTask />
            <TaskList />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
