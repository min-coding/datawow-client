import React from 'react';
import styled from 'styled-components';

const StyledFilterContainer = styled.select`
  border: none;
  padding: 0.5em;
  border-radius: 0.625rem;
  width: 20%;
`;

const Filter = ({
  setFilter,
}: {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  return (
    <>
      <StyledFilterContainer
        name="filter"
        id="filter"
        onChange={handleFilterChange}>
        <option value="All">All</option>
        <option value="Done">Done</option>
        <option value="Undone">Undone</option>
      </StyledFilterContainer>
    </>
  );
};

export default Filter;
