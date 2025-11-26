import React, { useEffect, useState } from "react";
import "./App.css";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./components/Column";
import AddTaskModal from "./components/AddTaskModal";

const API = "https://kanban-backend-wpqw.onrender.com";

export default function App() {
  const initial = {
    todo: [],
    inprogress: [],
    done: []
  };

  const [tasks, setTasks] = useState(initial);
  const [showModal, setShowModal] = useState(false);

  // Load tasks from backend
  useEffect(() => {
    fetch(`${API}/api/tasks`)
      .then(res => res.json())
      .then(data => {
        const formatted = { todo: [], inprogress: [], done: [] };

        data.forEach(task => {
          formatted[task.column].push(task);
        });

        setTasks(formatted);
      })
      .catch(err => console.error("Error loading tasks:", err));
  }, []);

  // Drag and Drop
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcCol = source.droppableId;
    const destCol = destination.droppableId;

    const draggedTask = tasks[srcCol][source.index];

    // Update UI immediately
    const newSrc = [...tasks[srcCol]];
    const newDest = [...tasks[destCol]];

    newSrc.splice(source.index, 1);
    newDest.splice(destination.index, 0, draggedTask);

    setTasks({
      ...tasks,
      [srcCol]: newSrc,
      [destCol]: newDest
    });

    // Update backend
    await fetch(`${API}/api/tasks/${draggedTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ column: destCol })
    });
  };

  // Add task
  const addTask = async (title, desc) => {
    const res = await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, desc, column: "todo" })
    });

    const newTask = await res.json();

    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, newTask]
    }));
  };

  // Delete task
  const deleteTask = async (col, id) => {
    await fetch(`${API}/api/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(prev => ({
      ...prev,
      [col]: prev[col].filter(t => t._id !== id)
    }));
  };

  return (
    <div className="app-container mt-4">
      <div className="header">
        <h1>Kanban Board</h1>
        <button className="add-task-btn" onClick={() => setShowModal(true)}>
          Add new Task
        </button>
      </div>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onAdd={addTask}
        />
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          <Column id="todo" title="To Do" items={tasks} onDelete={deleteTask} />
          <Column id="inprogress" title="In Progress" items={tasks} onDelete={deleteTask} />
          <Column id="done" title="Done" items={tasks} onDelete={deleteTask} />
        </div>
      </DragDropContext>
    </div>
  );
}
