import React, { Component, useEffect, useState } from "react";
import AddTodo from "./addTodo";
import DeleteTodo from "./deleteTodo";
import { todosContext } from "./todosContext";
import UpdateTodos from "./updateTodo";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8000/todos");
    const todos = await response.json();
    setTodos(todos.data);
  };
  const updateTodos = (updated_todos) => {
    console.log("updateTodos", updated_todos.data);
    setTodos(updated_todos.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <todosContext.Provider value={{ todos, fetchTodos, updateTodos }}>
      <AddTodo key={"addTodoComponent"} />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id + "li"}>
            <div className="d-flex flex-row align-items-center">
              <div className="p-2">{todo.item}</div>
              <div className="p-2">
                <UpdateTodos
                  key={todo.id + "Update"}
                  item={todo.item}
                  id={todo.id}
                />
              </div>
              <div className="">
                <DeleteTodo key={todo.id + "Delete"} id={todo.id} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </todosContext.Provider>
  );
}
