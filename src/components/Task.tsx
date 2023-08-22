import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Popover from './Popover';
import { TypeTask, TodoContext } from '../context/TodoContext';
import axios from 'axios';

export const StyledTaskContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  border-radius: 1.25rem;
  background: #ffffff;
  width: 100%;
  height: 2.875rem;
  filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.03));
  position: relative;
`;

export const StyledTitleInput = styled.input.attrs<{
  completed?: boolean;
}>({
  type: 'text',
})`
  font-size: 1rem;
  border: none;
  outline: none;
  width: 100%;
  background: white;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
`;

const CheckBoxControl = styled.label`
  display: grid;
  grid-template-columns: 1em auto;
  gap: 0.5em;
  align-items: center;
`;

const StyledCheckBox = styled.input.attrs({
  type: 'checkbox',
  name: 'completed',
})`
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border-radius: 0.375rem;
  border: 2px solid #585292;
  background: ${(props) => (props.checked ? '#585292' : 'white')};
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;

  &::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transform-origin: bottom left;
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--form-control-color);
    background-color: white;
  }

  &:checked::before {
    transform: scale(1);
  }
`;

const StyledSaveButton = styled.button`
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  width: 4rem;
  height: 2.25rem;
  border-radius: 62.4375rem;
  background: #585292;
  color: white;
  cursor: pointer;
`;

const FormControl = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-grow: 1;
`;

const TaskContainerControl = styled.div`
  position: relative;
  width: 100%;
`;

const Task = ({ id, title, completed }: TypeTask) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<TypeTask>({ id, title, completed });

  const context = useContext(TodoContext);
  if (!context) return null;
  const { editTask, toggleTaskCompletion } = context;

  // -------Title -----
  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  async function handleSubmitTitle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      editTask(formData);
      setIsEditing(false);
      const res = await axios.put(
        `http://localhost:3001/todos/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (res.status !== 200) console.log(res.statusText);
    } catch (error) {
      console.log(`Oops, there was an error sending the request: ${error}`);
    }
  }

  // ------Completed -----

  async function handleSubmitCompleted(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const { name, checked } = e.target;

      // Update formData
      const updatedFormData = {
        ...formData,
        [name]: checked,
      };

      // Update local state
      setFormData(() => updatedFormData);
      setIsEditing(false);

      // Update global state
      toggleTaskCompletion(updatedFormData);

      // Send updated formData in the request
      const res = await axios.put(
        `http://localhost:3001/todos/${id}`,
        updatedFormData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (res.status !== 200) console.log(res.statusText);
    } catch (error) {
      console.log(`Oops, there was an error sending the request: ${error}`);
    }
  }

  return (
    <TaskContainerControl>
      <StyledTaskContainer>
        <CheckBoxControl>
          <StyledCheckBox
            name="completed"
            checked={formData.completed}
            onChange={(e) => handleSubmitCompleted(e)}></StyledCheckBox>
        </CheckBoxControl>
        <FormControl
          onSubmit={(e) => {
            handleSubmitTitle(e);
            setInputDisabled(true);
          }}>
          <StyledTitleInput
            type="text"
            name="title"
            value={formData.title}
            completed={formData.completed}
            onChange={handleChangeTitle}
            disabled={!isEditing || inputDisabled}
          />
          {isEditing && !showPopover && (
            <StyledSaveButton type="submit">Save</StyledSaveButton>
          )}
        </FormControl>
        {!isEditing && (
          <svg
            onClick={() => setShowPopover((prev) => !prev)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M7.19941 11.9999C7.19941 12.6364 6.94656 13.2468 6.49647 13.6969C6.04638 14.147 5.43593 14.3999 4.79941 14.3999C4.16289 14.3999 3.55245 14.147 3.10236 13.6969C2.65227 13.2468 2.39941 12.6364 2.39941 11.9999C2.39941 11.3633 2.65227 10.7529 3.10236 10.3028C3.55245 9.85272 4.16289 9.59986 4.79941 9.59986C5.43593 9.59986 6.04638 9.85272 6.49647 10.3028C6.94656 10.7529 7.19941 11.3633 7.19941 11.9999ZM14.3994 11.9999C14.3994 12.6364 14.1466 13.2468 13.6965 13.6969C13.2464 14.147 12.6359 14.3999 11.9994 14.3999C11.3629 14.3999 10.7524 14.147 10.3024 13.6969C9.85227 13.2468 9.59941 12.6364 9.59941 11.9999C9.59941 11.3633 9.85227 10.7529 10.3024 10.3028C10.7524 9.85272 11.3629 9.59986 11.9994 9.59986C12.6359 9.59986 13.2464 9.85272 13.6965 10.3028C14.1466 10.7529 14.3994 11.3633 14.3994 11.9999ZM19.1994 14.3999C19.8359 14.3999 20.4464 14.147 20.8965 13.6969C21.3466 13.2468 21.5994 12.6364 21.5994 11.9999C21.5994 11.3633 21.3466 10.7529 20.8965 10.3028C20.4464 9.85272 19.8359 9.59986 19.1994 9.59986C18.5629 9.59986 17.9524 9.85272 17.5024 10.3028C17.0523 10.7529 16.7994 11.3633 16.7994 11.9999C16.7994 12.6364 17.0523 13.2468 17.5024 13.6969C17.9524 14.147 18.5629 14.3999 19.1994 14.3999Z"
              fill="#9796A8"
            />
          </svg>
        )}
      </StyledTaskContainer>
      {showPopover && (
        <Popover
          formData={formData}
          setIsEditing={setIsEditing}
          setShowPopover={setShowPopover}
          setInputDisabled={setInputDisabled}></Popover>
      )}
    </TaskContainerControl>
  );
};

export default Task;
