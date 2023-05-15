import React, { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "./userContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGoogleLogin,
  GoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import Joi from "joi";
import "../login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignIn = () => {
  const { user, setUser } = useContext(userContext);
  const { profile, setProfile } = useContext(userContext);
  const [login, setLogin] = useState({ email: "", password: "", errors: {} });
  const navigate = useNavigate();

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.required(),
  });

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

  const validateProperty = ({ name, value }) => {
    const subSchema = schema.extract(name);
    const result = subSchema.validate(value);

    return result.error ? result.error.details[0].message : null;
  };

  const handleChange = ({ currentTarget: input }) => {
    let newLoginInfo = structuredClone(login);
    const errorMessage = validateProperty(input);
    newLoginInfo.errors[input.name] = errorMessage || null;
    newLoginInfo[input.name] = input.value;
    setLogin(newLoginInfo);
  };

  //   useEffect(() => {
  // async function getGoogleUser() {
  //   if (profile.sub) {
  //     await fetch("http://localhost:8000/services/user", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(profile),
  //     })
  //       .then((res) => {
  //         // setProfile(res.data);
  //         // console.log(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }

  // getGoogleUser();
  // console.log("userEffectSignIn");
  //   }, [profile]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/services/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });
      const user = await response.json();
      console.log(user);
      if (user.error) {
        toast.error(user.error);
      } else {
        setProfile({
          id: user.data[0].id,
          email: user.data[0].email,
        });
        navigate("/todos");
      }
    } catch (ex) {
      setProfile({});
      setLogin({ email: "", password: "", errors: {} });
      console.log(ex.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            name="email"
            placeholder="name@example.com"
            value={login.email}
            onChange={handleChange}
            autoFocus
          />
          <label htmlFor="floatingInput">Email address</label>
          {login.errors && login.errors.email && (
            <div className="alert alert-danger">{login.errors.email}</div>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            name="password"
            placeholder="Password"
            value={login.password}
            onChange={handleChange}
          />
          <label htmlFor="floatingPassword">Password</label>
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
        <div className="d-grid">
          <div className="d-grid mb-2 align-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const { sub, email, picture } = jwt_decode(
                  credentialResponse.credential
                );
                console.log(picture);
                setProfile({
                  googleId: sub,
                  id: sub,
                  email: email,
                  picture_url: picture,
                });
                console.log(profile);
                navigate("/todos");
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>
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
        {/* <div className="d-grid"> */}
        {/* <button
              className="btn btn-facebook btn-login text-uppercase fw-bold"
              type="submit"
            >
              <FontAwesomeIcon
                icon={["fab", "facebook-f"]}
                className="me-2"
              />
              Sign in with Facebook
            </button>
            <hr className="my-4" /> */}
        {/* </div> */}
      </form>
    </div>
  );
};

export default SignIn;
