import { useContext } from "react";
import { todosContext } from "./todosContext";

export default function DeleteTodo({ id }) {
  const { todos, updateTodos } = useContext(todosContext);

  const deleteTodo = async () => {
    const originalTodos = { data: [...todos] };
    try {
      let updated_todo = todos.filter((t) => t.id === id);
      todos.splice(updated_todo.indexOf(updated_todo), 1);
      updateTodos({ data: [...todos] });

      await fetch(`http://localhost:8000/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: { id: id },
      });
    } catch (ex) {
      console.log(ex.message);
      updateTodos(originalTodos);
    }
  };
  return (
    <button className="btn btn-danger" onClick={deleteTodo}>
      Delete
    </button>
  );
}
