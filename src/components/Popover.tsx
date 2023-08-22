import React, { useContext } from 'react';
import styled from 'styled-components';
import { TodoContext, TypeTask } from '../context/TodoContext';
import axios from 'axios';

const StyledPopoverContainer = styled.div`
  border-radius: 0.625rem;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 6.5rem;
  padding: 1em;
  gap: 1.25em;
  position: absolute;
  top: 35px;
  right: 1px;
  z-index: 100;
`;

const Popover = ({
  formData,
  setIsEditing,
  setShowPopover,
  setInputDisabled,
}: {
  formData: TypeTask;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const context = useContext(TodoContext);
  if (!context) return null;
  const { deleteTask } = context;

  async function handleDelete(formData: TypeTask) {
    try {
      deleteTask(formData);
      const res = await axios.delete(
        `http://localhost:3001/todos/${formData.id}`,
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
    <StyledPopoverContainer>
      <div
        onClick={() => {
          setIsEditing((prev) => !prev);
          setShowPopover(false);
          setInputDisabled(false);
        }}>
        Edit
      </div>
      <div
        style={{ color: 'red' }}
        onClick={() => {
          handleDelete(formData);
        }}>
        Delete
      </div>
    </StyledPopoverContainer>
  );
};

export default Popover;
