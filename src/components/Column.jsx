import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function Column({ title, id, items, onDelete }) {
  return (
    <div className="column">
      <div className="column-header">
        <span>{title}</span>
        <span>{items[id].length}</span>
      </div>

      <Droppable droppableId={id}>
        {(provided) => (
          <div
            className="column-content"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items[id].map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                index={i}
                col={id}
                onDelete={onDelete}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
