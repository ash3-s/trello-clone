"use client";
import React, { useState } from "react";
import "../Modal.css";

const Modal = ({
  onClose,
  onSubmit,
  initialName = "",
  initialDescription = "",
  isViewMode = false,
  task = {},
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && description) {
      onSubmit(name, description);
      onClose();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span
          style={{ color: "white", cursor: "pointer" }}
          className="close"
          onClick={onClose}
        >
          &times;
        </span>
        {isViewMode ? (
          <>
            <h1 style={{ color: "white" }}>Task Details</h1>
            <h2 style={{ color: "white" }}>{task.name}</h2>
            <p style={{ color: "white" }}>{task.description}</p>
          </>
        ) : (
          <div>
            <h2>Add/Edit Task</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Task Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
