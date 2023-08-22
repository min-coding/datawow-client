import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { StyledTaskContainer, StyledTitleInput } from './Task';
import { TodoContext, TypeTask } from '../context/TodoContext';
import { v4 as generateId } from 'uuid';
import axios from 'axios';

const FormContainer = styled(StyledTaskContainer).attrs({ as: 'form' })`
  flex-grow: 1;
`;

const StyledInput = styled(StyledTitleInput)`
  padding: 0.5rem;
`;

const Form = () => {
  const [formData, setFormData] = useState<TypeTask>({
    id: generateId(),
    title: '',
    completed: false,
  });

  const context = useContext(TodoContext);
  if (!context) return null;
  const { addTask } = context;
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      addTask(formData);
      const res = await axios.post(`http://localhost:3001/todos/`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      //clear input
      setFormData({ id: generateId(), title: '', completed: false });
      if (res.status !== 200) console.log(res.statusText);
    } catch (error) {
      console.log(`Oops, there was an error sending the request: ${error}`);
    }
  }

  return (
    <FormContainer onSubmit={(e) => handleSubmit(e)}>
      <StyledInput
        name="title"
        type="text"
        value={formData.title}
        placeholder="Add your to do..."
        onChange={handleChange}
      />
    </FormContainer>
  );
};

export default Form;
