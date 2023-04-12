import React from "react";
import "../login.css";
import { Link, Outlet } from "react-router-dom";

const Login = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <ul className="nav nav-tabs mb-3" role="tablist">
                <li className="nav-item" role="presentation">
                  <Link
                    className="nav-link active"
                    to="/login/signin"
                    id="signin-tab"
                  >
                    <h5
                      className="card-title text-center mb-2 fw-light fs-5"
                      data-bs-toggle="tab"
                      role="tab"
                    >
                      Sign In
                    </h5>
                  </Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link className="nav-link" to="/login/signup" id="signup-tab">
                    <h5
                      className="card-title text-center mb-2 fw-light fs-5"
                      data-bs-toggle="tab"
                      role="tab"
                    >
                      Sign Up
                    </h5>
                  </Link>
                </li>
              </ul>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
