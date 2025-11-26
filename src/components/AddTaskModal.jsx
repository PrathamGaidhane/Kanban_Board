import React, { useState } from "react";

export default function AddTaskModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="modal-bg">
      <div className="modal-box">
        <input
          className="modal-input"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="modal-input"
          placeholder="Task Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button
          className="modal-btn"
          onClick={() => {
            onAdd(title, desc);
            onClose();
          }}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
