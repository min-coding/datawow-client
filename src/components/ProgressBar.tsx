import { TypeTask } from '../context/TodoContext';
import styled from 'styled-components';

const StyledProgressBar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-item: center;
  padding: 1em;
  border-radius: 1.25rem;
  background: #e07c7c;
`;

const StyledProgressTitle = styled.p`
  color: #fff;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin: 0 0 0.5em;
`;

const StyledProgressCompletedText = styled(StyledProgressTitle).attrs({
  as: 'div',
})`
  color: #ebb9b8;
  font-weight: 400;
  font-size: 1rem;
  margin: 1em 0em 0em 0em;
`;

const StyledBar = styled.div`
  height: 0.45894rem;
  border-radius: 62.4375rem;
  background: #3b3b3b;
  width: 100%;
`;

const StyledProgress = styled.div<{ progresswidth?: string }>`
  height: 100%;
  width: ${(props) => props.progresswidth + '%'};
  border-radius: 62.4375rem;
  background: white;
`;

function ProgressBar({
  completedTasks,
  progressWidth,
}: {
  completedTasks: TypeTask[] | undefined;
  progressWidth: number;
}) {
  return (
    <StyledProgressBar>
      <StyledProgressTitle>Progress</StyledProgressTitle>
      <StyledBar>
        <StyledProgress
          progresswidth={progressWidth.toString()}></StyledProgress>
      </StyledBar>
      <StyledProgressCompletedText>
        {' '}
        {completedTasks?.length} completed tasks
      </StyledProgressCompletedText>
    </StyledProgressBar>
  );
}

export default ProgressBar;
