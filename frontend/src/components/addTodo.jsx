import { useContext, useState } from "react";
import { todosContext } from "./todosContext";
import { userContext } from "./userContext";
import { FormValidator } from "../validator";
import { toast } from "react-toastify";
import http from "../services/httpService";

export default function AddTodo() {
  const [item, setItem] = useState("");
  const { todos, updateTodos } = useContext(todosContext);
  const { profile } = useContext(userContext);

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

    let new_todo = {
      item: item,
      user: profile.googleId || profile.id || "",
    };

    updateTodos({ data: [...todos, new_todo] });

    try {
      let addUrl = "todos?user=";
      if (profile && (profile.googleId || profile.id)) {
        addUrl += profile.googleId || profile.id;
      }

      const response = await http.post(addUrl, new_todo);
      const json = await response.json();

      if (json.error) {
        toast.error(json.error);
        updateTodos({ data: originalTodos });
      } else if (json.consoleError) {
        updateTodos({ data: originalTodos });
      } else {
        new_todo.id = json.id;
        updateTodos({ data: [...todos, new_todo] });
        toast.success(json.message);
      }
    } catch (ex) {
      updateTodos({ data: originalTodos });
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
