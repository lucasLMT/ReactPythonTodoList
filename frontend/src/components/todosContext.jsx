import { createContext } from "react";

export const todosContext = createContext({
  todos: [],
  fetchTodos: () => {},
});
