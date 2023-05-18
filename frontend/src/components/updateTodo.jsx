import React, { useState } from "react";
import { todosContext } from "./todosContext";
import { userContext } from "./userContext";
import { FormValidator } from "../validator";
import { toast } from "react-toastify";
import http from "../services/httpService";

export default function UpdateTodos({ item, id }) {
  const [todo, setTodo] = useState(item);
  const { todos, updateTodos } = React.useContext(todosContext);
  const { profile } = React.useContext(userContext);

  const updateTodo = async () => {
    if (FormValidator.fieldIsEmpty(todo)) {
      toast.error("The todo is empty.");
      return;
    }

    const originalTodos = todos.map((item) => {
      return { ...item };
    });

    let updated_todo = todos.filter((t) => t.id === id);
    updated_todo[0].item = todo;
    updated_todo[0].user = profile.googleId || profile.id || "";
    updateTodos({ data: [...todos] });

    try {
      let updateUrl = `todos/${id}?user=`;
      if (profile && (profile.googleId || profile.id)) {
        updateUrl += profile.googleId || profile.id;
      }
      const response = await http.put(updateUrl, updated_todo[0]);
      const json = await response.json();

      if (json.error) {
        toast.error(json.error);
        updateTodos({ data: originalTodos });
      } else if (json.consoleError) {
        console.log(json.consoleError);
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
    console.log("handleChange", todos);
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
