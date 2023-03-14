import React, { Component, useState } from "react";
import { todosContext } from "./todosContext";

export default function UpdateTodos({ item, id }) {
  const [todo, setTodo] = useState(item);
  const { todos, fetchTodos, updateTodos } = React.useContext(todosContext);
  //const [new_todo, setNewTodo] = useState(todos);
  //const [todos, setTodos] = useState([]);
  console.log("todos1", todos);

  const updateTodo = async () => {
    console.log("item", item, "id", id);
    console.log("todos2", todos);
    const originalTodos = [...todos];

    let updated_todo = todos.filter((t) => t.id === id);
    updated_todo[0].item = todo;
    const new_todo = { data: [...todos] };
    console.log("new_todo", new_todo);
    updateTodos(new_todo);
    console.log("todos3", todos);
    console.log(updateTodos);
    // const originalTodos = todos;
    // let updated_todo = todos.filter((t) => t.id === id);
    // console.log("updated_todo", updated_todo);
    // updated_todo[0].item = item;
    // console.log("updated_todo", updated_todo);
    // setNewTodo(new_todo);
    // console.log("new_todo", new_todo);
    try {
      await fetch(`http://localhost:8000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: todo }),
      });
    } catch (error) {
      console.log("Error");
      updateTodos({ data: originalTodos });
    }
    //await fetchTodos();
  };

  const handleChange = (event) => {
    setTodo(event.target.value);
    console.log("todos4", todos);
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={"#exampleModal" + id}
      >
        Update
      </button>
      <div
        className="modal fade"
        id={"exampleModal" + id}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
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
                readonly
                //value={item}
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
