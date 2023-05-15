import React, { Component } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "./userContext";
import { googleLogout } from "@react-oauth/google";

const Header = () => {
  const { user, setUser } = useContext(userContext);
  const { profile, setProfile } = useContext(userContext);

  const logOut = () => {
    googleLogout();
    setProfile({});
    setUser({});
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">
          Todos
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/todos">
                Home
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {profile && (profile.googleId || profile.id) ? (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {profile.picture_url ? (
                    <img
                      src={profile.picture_url}
                      alt="user image"
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                  ) : (
                    profile.email
                  )}
                </Link>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" onClick={logOut} href="/">
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login/signin">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
