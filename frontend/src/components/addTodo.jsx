import { useContext, useState } from "react";
import { todosContext } from "./todosContext";
import { FormValidator } from "../validator";
import { toast } from "react-toastify";

export default function AddTodo() {
  const [item, setItem] = useState("");
  const { todos, updateTodos } = useContext(todosContext);

  const handleInput = (event) => {
    setItem(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (FormValidator.fieldIsEmpty(item)) {
      toast.error("A new todo can't be empty.");
      return;
    }

    const originalTodos = [...todos];

    const new_todo = {
      id: todos.length + 1,
      item: item,
    };

    updateTodos({ data: [...todos, new_todo] });

    try {
      await fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_todo),
      });
    } catch (ex) {
      updateTodos({ data: [...originalTodos] });
      console.log(ex.message);
    }
  };

  return (
    <form className="row g-3 m-2" onSubmit={handleSubmit}>
      <div className="col-auto">
        <label htmlFor="staticEmail2" className="visually-hidden">
          New Todo:
        </label>
        <input
          key="AddTodoInput"
          type="text"
          className="form-control"
          id="new_todo"
          placeholder="Describe your task."
          onChange={handleInput}
        />
      </div>
      <div className="col-auto">
        <button
          key="AddTodoButton"
          type="submit"
          className="btn btn-primary mb-3"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
