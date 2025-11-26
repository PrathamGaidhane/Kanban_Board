import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index, col, onDelete }) {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-card-title">{task.title}</div>
          <div className="task-card-desc">{task.desc}</div>

          <button
            className="delete-btn"
            onClick={() => onDelete(col, task._id)}
          >
            Delete
          </button>
        </div>
      )}
    </Draggable>
  );
}
