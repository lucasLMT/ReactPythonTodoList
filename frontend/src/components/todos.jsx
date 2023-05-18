import { useContext, useEffect, useState } from "react";
import { todosContext } from "./todosContext";
import { userContext } from "./userContext";
import UpdateTodos from "./updateTodo";
import AddTodo from "./addTodo";
import DeleteTodo from "./deleteTodo";
import http from "../services/httpService";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const { profile } = useContext(userContext);

  const fetchTodos = async () => {
    let listUrl = "todos?user=";
    if (profile && (profile.googleId || profile.id)) {
      listUrl += profile.googleId || profile.id;
    }

    const response = await http.get(listUrl);
    const todos = await response.json();
    setTodos(todos.data);
  };

  const updateTodos = (updated_todos) => {
    console.log("updateTodos", updated_todos.data);
    setTodos(updated_todos.data);
  };

  useEffect(() => {
    fetchTodos();
    console.log("UseEffect");
  }, []);

  return (
    <todosContext.Provider value={{ todos, fetchTodos, updateTodos }}>
      <AddTodo key={"addTodoComponent"} />
      <table className="table table-border m-2 table-sm">
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id + "tr"}>
              <td>{todo.item}</td>
              <td>
                <UpdateTodos
                  key={todo.id + "Update"}
                  item={todo.item}
                  id={todo.id}
                />
              </td>
              <td>
                <DeleteTodo key={todo.id + "Delete"} id={todo.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </todosContext.Provider>
  );
}
