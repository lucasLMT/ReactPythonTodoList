import React, { Component, useState } from "react";
import { todosContext } from "./todosContext";
import { FormValidator } from "../validator";
import { toast } from "react-toastify";

export default function UpdateTodos({ item, id }) {
  const [todo, setTodo] = useState(item);
  const { todos, updateTodos } = React.useContext(todosContext);

  const updateTodo = async () => {
    if (FormValidator.fieldIsEmpty(todo)) {
      toast.error("The todo is empty.");
      return;
    }

    const originalTodos = [...todos];

    let updated_todo = todos.filter((t) => t.id === id);
    updated_todo[0].item = todo;
    const new_todo = { data: [...todos] };
    updateTodos(new_todo);

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: todo }),
      });
      const json = await response.json();
      if (json.error) {
        toast.error(json.error);
        updateTodos({ data: originalTodos });
      } else {
        toast.success(json.message);
      }
    } catch (ex) {
      console.log(ex.message);
      updateTodos({ data: originalTodos });
    }
  };

  const handleChange = (event) => {
    setTodo(event.target.value);
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={"#modal" + id}
      >
        Update
      </button>
      <div
        className="modal fade"
        id={"modal" + id}
        tabIndex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalLabel">
                Update Todo
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                id="new_todo"
                value={todo}
                onChange={handleChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={updateTodo}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
