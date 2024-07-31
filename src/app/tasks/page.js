"use client";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";
import Modal from "./Modal";

const initialTasks = {
  todo: [],
  inProgress: [],
  done: [],
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const sourceTasks = Array.from(tasks[sourceColumn]);
    const [removed] = sourceTasks.splice(source.index, 1);
    const destTasks = Array.from(tasks[destColumn]);
    destTasks.splice(destination.index, 0, removed);

    if (sourceColumn != destColumn) {
      setTasks({
        ...tasks,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks,
      });
    }
  };

  const handleAddTask = (name, description) => {
    setTasks({
      ...tasks,
      todo: [...tasks.todo, { id: `task-${Date.now()}`, name, description }],
    });
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Task Management</h1>
        <button onClick={() => setIsModalOpen(true)}>Add Task</button>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        {["todo", "inProgress", "done"].map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                className="column"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2>{column.replace(/([A-Z])/g, " $1")}</h2>
                {tasks[column].map((task, index) => {
                  return (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="task"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h3>{task.name}</h3>
                          <p>{task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} onSubmit={handleAddTask} />
      )}
    </div>
  );
}

export default App;
