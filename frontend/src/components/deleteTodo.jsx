import { useContext } from "react";
import { todosContext } from "./todosContext";

export default function DeleteTodo({ id }) {
  const { fetchTodos } = useContext(todosContext);

  const deleteTodo = async () => {
    await fetch(`http://localhost:8000/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: { id: id },
    });
    await fetchTodos();
  };
  return (
    <button className="btn btn-danger" onClick={deleteTodo}>
      Delete
    </button>
  );
}
