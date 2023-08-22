import React, { createContext, useState, ReactNode } from 'react';

export interface TypeTask {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoContextType {
  tasks: TypeTask[];
  setTasks: React.Dispatch<React.SetStateAction<TypeTask[]>>;
  addTask: (task: TypeTask) => void;
  deleteTask: (task: TypeTask) => void;
  editTask: (task: TypeTask) => void;
  toggleTaskCompletion: (task: TypeTask) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<TypeTask[]>([]);

  const addTask = (task: TypeTask) => {
    setTasks([...tasks, task]);
  };
  const deleteTask = (task: TypeTask) => {
    setTasks(tasks.filter((t) => t.id !== task.id));
  };
  const editTask = (updatedTask: TypeTask) => {
    setTasks(
      tasks.map((t) =>
        t.id === updatedTask.id ? { ...t, title: updatedTask.title } : t
      )
    );
  };
  const toggleTaskCompletion = (task: TypeTask) => {
    setTasks(
      tasks.map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const contextValue: TodoContextType = {
    tasks,
    addTask,
    deleteTask,
    editTask,
    toggleTaskCompletion,
    setTasks,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};

export { TodoProvider, TodoContext };
