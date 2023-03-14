import React, { Component } from "react";
import { todosContext } from "./todosContext";

export default function AddTodo() {
  const [item, setItem] = React.useState("");
  const { todos, fetchTodos } = React.useContext(todosContext);

  const handleInput = (event) => {
    setItem(event.target.value);
  };

  const handleSubmit = (event) => {
    const new_todo = {
      id: todos.length + 1,
      item: item,
    };

    fetch("http://localhost:8000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_todo),
    }).then(fetchTodos);
  };

  return (
    <form className="row g-3 m-2" onSubmit={handleSubmit}>
      <div className="col-auto">
        <label htmlFor="staticEmail2" className="visually-hidden">
          New Todo:
        </label>
        <input
          type="text"
          className="form-control"
          id="new_todo"
          placeholder="Describe your task."
          onChange={handleInput}
        />
      </div>
      <div className="col-auto">
        <button type="submit" className="btn btn-primary mb-3">
          Submit
        </button>
      </div>
    </form>
  );
}
