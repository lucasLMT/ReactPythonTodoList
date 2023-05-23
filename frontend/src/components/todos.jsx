import { useContext, useEffect, useState } from "react";
import { todosContext } from "./todosContext";
import { userContext } from "./userContext";
import UpdateTodos from "./updateTodo";
import AddTodo from "./addTodo";
import DeleteTodo from "./deleteTodo";
import http from "../services/httpService";
import { getCurrentUser, logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const { profile, setProfile } = useContext(userContext);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    let listUrl = "todos?user=";
    if (profile && profile.id) {
      listUrl += profile.id;
    }

    const response = await http.get(listUrl);
    const todos = await response.json();
    setTodos(todos.data || []);
  };

  const updateTodos = (updated_todos) => {
    setTodos(updated_todos.data);
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setProfile({
        id: user.sub,
        email: user.email,
        picture_url: user.picture_url || "",
      });
      fetchTodos();
    } else {
      logout();
      setProfile({});
      navigate("/login/signin");
    }
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
