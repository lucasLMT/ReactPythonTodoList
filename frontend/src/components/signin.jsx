import React, { useContext, useState } from "react";
import { userContext } from "./userContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import Joi from "joi";
import "../login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { userLogin, socialLogin } from "../services/authService";

const SignIn = () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const json = await userLogin(login.email, login.password);
      if (json.error) {
        toast.error(json.error);
      } else {
        setProfile({
          id: json.sub,
          email: json.email,
        });
        navigate("/todos");
      }
    } catch (ex) {
      setProfile({});
      setLogin({ email: "", password: "", errors: {} });
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const { sub, email, picture } = jwt_decode(credentialResponse.credential);
    const userData = await socialLogin(sub, email, picture);
    setProfile({
      googleId: sub,
      id: userData.sub,
      email: email,
      picture_url: picture,
    });
    navigate("/todos");
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
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
