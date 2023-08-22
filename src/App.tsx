import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import './App.css';
import ProgressBar from './components/ProgressBar';
import Filter from './components/Filter';
import Task from './components/Task';
import Form from './components/Form';
import { TodoContext, TypeTask } from './context/TodoContext';

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  width: 75%;
  margin: 0 auto;
  background: #f5f5f5;
  padding: 2em 4em;
  border-radius: 1.25rem;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TasksListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  position: relative;
`;

function App() {
  const { tasks, setTasks } = useContext(TodoContext) ?? {};

  const completedTasks = tasks?.filter((task) => task.completed);
  const incompletedTask = tasks?.filter((task) => !task.completed);
  const progressWidth: number =
    ((completedTasks?.length || 0) / (tasks?.length || 1)) * 100;

  const [filter, setFilter] = useState<string>('All');
  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data } = await axios.get(`http://localhost:3001/todos`);
        if (setTasks) {
          setTasks(() => data);
        }
      } catch (error) {
        console.log(`Oops, there's an error during fetching tasks`);
      }
    }
    fetchTasks();
  }, []);

  return (
    <Container>
      <ProgressBar
        completedTasks={completedTasks}
        progressWidth={progressWidth}></ProgressBar>
      <Header>
        <h3>Tasks</h3>
        <Filter setFilter={setFilter}></Filter>
      </Header>
      <TasksListContainer>
        {filter === 'All' &&
          tasks?.map((task: TypeTask) => (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}></Task>
          ))}
        {filter === 'Done' &&
          completedTasks?.map((task: TypeTask) => (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}></Task>
          ))}
        {filter === 'Undone' &&
          incompletedTask?.map((task: TypeTask) => (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}></Task>
          ))}
      </TasksListContainer>
      <Form></Form>
    </Container>
  );
}

export default App;
