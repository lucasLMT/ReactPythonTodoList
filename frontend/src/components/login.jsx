import React, { useContext, useEffect } from "react";
import { userContext } from "./userContext";
import {
  useGoogleLogin,
  GoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import "../login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user, setUser } = useContext(userContext);
  const { profile, setProfile } = useContext(userContext);
  const navigate = useNavigate();

  // const useTestGoogleLogin = useGoogleLogin({
  //   onSuccess: (CodeResponse) => console.log("CodeResponse", CodeResponse),
  //   onError: (error) => console.log("Error", error),
  // });

  // useEffect(() => {
  //   async function login() {
  //     console.log(user);
  //     if (user.access_token) {
  //       await fetch(
  //         `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${user.access_token}`,
  //             Accept: "application/json",
  //           },
  //         }
  //       )
  //         .then((res) => {
  //           setProfile(res.data);
  //           console.log(res.data);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   }

  //   login();
  //   console.log(user);
  // }, [user]);

  useEffect(() => {
    async function verifyUser() {
      if (profile.sub) {
        await fetch("http://localhost:8000/services/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        })
          .then((res) => {
            // setProfile(res.data);
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    verifyUser();
  }, [profile]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign In
              </h5>
              <form>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="rememberPasswordCheck"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="rememberPasswordCheck"
                  >
                    Remember password
                  </label>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    <FontAwesomeIcon icon="right-to-bracket" className="me-2" />
                    Sign in
                  </button>
                </div>
                <hr className="my-4" />
                {/* <div className="d-grid mb-2">
                  <button
                    className="btn btn-google btn-login text-uppercase fw-bold"
                    // type="submit"
                  >
                    <FontAwesomeIcon
                      icon={["fab", "google"]}
                      className="me-2"
                    />
                    Sign in with Google
                  </button>
                </div> */}
                <div className="d-grid">
                  <button
                    className="btn btn-facebook btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    <FontAwesomeIcon
                      icon={["fab", "facebook-f"]}
                      className="me-2"
                    />
                    Sign in with Facebook
                  </button>
                  <hr className="my-4" />
                  <div className="d-grid mb-2 align-center">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        setProfile(jwt_decode(credentialResponse.credential));
                        console.log(profile);
                        navigate("/todos");
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
