import { useContext } from "react";
import { toast } from "react-toastify";
import { todosContext } from "./todosContext";

export default function DeleteTodo({ id }) {
  const { todos, updateTodos } = useContext(todosContext);

  const deleteTodo = async () => {
    const originalTodos = [...todos];
    try {
      let updated_todo = todos.filter((t) => t.id === id);
      todos.splice(updated_todo.indexOf(updated_todo), 1);
      updateTodos({ data: [...todos] });

      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: { id: id },
      });

      const json = await response.json();
      console.log(json);
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
  return (
    <button className="btn btn-danger" onClick={deleteTodo}>
      Delete
    </button>
  );
}
