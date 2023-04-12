import React, { useState } from "react";
import Header from "./components/header";
import Todos from "./components/todos";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import { userContext } from "./components/userContext";

const App = () => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});

  return (
    <div>
      <ToastContainer />
      <userContext.Provider value={{ user, setUser, profile, setProfile }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="login" element={<Login />}>
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
            </Route>
            <Route path="todos" element={<Todos />} />
            <Route path="/" element={<Todos />} />
          </Routes>
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
};

export default App;
