import { useContext } from "react";
import { toast } from "react-toastify";
import { todosContext } from "./todosContext";
import http from "../services/httpService";

export default function DeleteTodo({ id }) {
  const { todos, updateTodos } = useContext(todosContext);

  const deleteTodo = async () => {
    const originalTodos = [...todos];
    try {
      let updated_todo = todos.filter((t) => t.id === id);
      todos.splice(updated_todo.indexOf(updated_todo), 1);
      updateTodos({ data: [...todos] });

      const response = await http.delete(`todos/${id}`, { id: id });
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
  return (
    <button className="btn btn-danger" onClick={deleteTodo}>
      Delete
    </button>
  );
}
