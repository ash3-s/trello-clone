"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";
import Modal from "./Modal";
import { redirect } from "next/navigation";
import { auth, checkUser } from "../config/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Auth from "./Auth";
import Protected from "./Protected";

const initialTasks = {
  todo: [],
  inProgress: [],
  done: [],
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const router = useRouter();
  const isAuth = checkUser(auth);
  console.log(isAuth);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/getTasks"); //API endpoint
        const data = await response.json();
        console.log(data);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const sourceTasks = Array.from(tasks[sourceColumn]);
    const [removed] = sourceTasks.splice(source.index, 1);
    const destTasks = Array.from(tasks[destColumn]);
    destTasks.splice(destination.index, 0, removed);

    if (sourceColumn != destColumn) {
      const newTasks = {
        ...tasks,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks,
      };
      setTasks({
        ...tasks,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks,
      });

      await fetch("http://localhost:8000/updateTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: newTasks }),
      });
    }
  };

  const handleAddTask = async (name, description) => {
    const response = await fetch("http://localhost:8000/addTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    });

    const data = await response.json();
    console.log(data);
    //only add if there are no errors in backend.
    if (response.ok) {
      setTasks({
        ...tasks,
        todo: [...tasks.todo, { id: `task-${Date.now()}`, name, description }],
      });
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (column, taskId) => {
    const response = await fetch("http://localhost:8000/deleteTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ column, taskId }),
    });

    if (response.ok) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [column]: prevTasks[column].filter((task) => task.id !== taskId),
      }));
    }
  };

  const handleEditTask = async (column, taskId, name, description) => {
    const response = await fetch("http://localhost:8000/editTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ column, taskId, name, description }),
    });

    if (response.ok) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [column]: prevTasks[column].map((task) =>
          task.id === taskId ? { ...task, name, description } : task
        ),
      }));
    }
  };

  return (
    <div className="App">
      <Protected>
        <header className="header">
          <button onClick={() => setIsModalOpen(true)}>Add Task</button>
          <button onClick={logout}>Logout</button>
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
                            <button
                              onClick={() => handleDeleteTask(column, task.id)}
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                setTaskToEdit({ ...task, column });
                                setIsEditModalOpen(true);
                              }}
                            >
                              Edit
                            </button>
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
          <Modal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddTask}
          />
        )}
        {isEditModalOpen && taskToEdit && (
          <Modal
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={(name, description) => {
              handleEditTask(
                taskToEdit.column,
                taskToEdit.id,
                name,
                description
              );
              setIsEditModalOpen(false);
            }}
            initialName={taskToEdit.name}
            initialDescription={taskToEdit.description}
          />
        )}
      </Protected>
    </div>
  );
}

export default App;
