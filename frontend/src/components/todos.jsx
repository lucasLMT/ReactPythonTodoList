import { useContext, useEffect, useState } from "react";
import { todosContext } from "./todosContext";
import { userContext } from "./userContext";
import UpdateTodos from "./updateTodo";
import AddTodo from "./addTodo";
import DeleteTodo from "./deleteTodo";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const { profile } = useContext(userContext);

  const fetchTodos = async () => {
    let listUrl = "http://localhost:8000/todos?user=";
    if (profile && profile.sub) {
      listUrl += profile.sub;
    }
    console.log("fetchTodos", listUrl);
    const response = await fetch(listUrl);
    const todos = await response.json();
    setTodos(todos.data);
    console.log(todos.data);
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
