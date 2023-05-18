import React, { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "./userContext";
import "../login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Input from "./common/input";
import Joi from "joi";
import { toast } from "react-toastify";
import http from "../services/httpService";

const SignUp = () => {
  const { user, setUser } = useContext(userContext);
  const { profile, setProfile } = useContext(userContext);
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    account: {},
    errors: {},
  });
  //const email = useRef("");

  const clearUser = () => {
    setLoginInfo({
      account: {},
      errors: {},
    });
  };

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string()
      .required()
      .label("Password")
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .messages({
        "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only.`,
        "string.empty": `Password cannot be empty.`,
        "any.required": `Password is required.`,
      }),
    checkPassword: Joi.valid(Joi.ref("password")).messages({
      "any.only": "The two passwords do not match.",
    }),
    birthdayDate: Joi.date().required().label("Birthday"),
  });

  useEffect(() => {
    //email.current.focus();
  });

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = schema.validate(loginInfo.account, options);

    if (error) {
      const errors = {};
      error.details.map((item) => {
        errors[item.path[0]] = item.message;
      });

      return errors;
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let newLoginInfo = structuredClone(loginInfo);
    newLoginInfo.errors = validate();
    setLoginInfo(newLoginInfo);

    try {
      const response = await http.post(
        "services/user/register",
        newLoginInfo.account
      );
      const json = await response.json();

      if (json.error) {
        toast.error(json.error);
        clearUser();
      } else if (json.consoleError) {
        console.log(json.consoleError);
        clearUser();
      } else {
        toast.success(json.message);
        setProfile({ ...newLoginInfo.account, id: json.id });
        navigate("/todos");
      }
    } catch (ex) {
      console.log(ex.message);
      clearUser();
    }
  };

  const validateProperty = ({ name, value }) => {
    let result = {};
    if (name === "checkPassword") {
      const subSchema = Joi.object({
        password: Joi.string().required(),
        checkPassword: Joi.valid(Joi.ref("password")).messages({
          "any.only": "The two passwords do not match.",
        }),
      });
      result = subSchema.validate({
        password: loginInfo.account.password,
        [name]: value,
      });
    } else {
      const subSchema = schema.extract(name);
      result = subSchema.validate(value);
    }

    return result.error ? result.error.details[0].message : null;
  };

  const handleChange = ({ currentTarget: input }) => {
    let newLoginInfo = structuredClone(loginInfo);
    const errorMessage = validateProperty(input);
    newLoginInfo.errors[input.name] = errorMessage || null;
    newLoginInfo.account[input.name] = input.value;
    setLoginInfo(newLoginInfo);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            name="email"
            value={loginInfo.account.email || ""}
            onChange={handleChange}
            autoFocus
            //ref={email}
          />
          <label htmlFor="floatingInput">Email address</label>
          {loginInfo.errors && loginInfo.errors.email && (
            <div className="alert alert-danger">{loginInfo.errors.email}</div>
          )}
        </div>
        <Input
          type="password"
          name="password"
          label="Password"
          value={loginInfo.account.password || ""}
          onChange={handleChange}
          placeholder="Password"
          error={loginInfo.errors && loginInfo.errors.password}
        />
        <Input
          type="password"
          name="checkPassword"
          label="Confirm Password"
          value={loginInfo.account.checkPassword || ""}
          onChange={handleChange}
          placeholder="Password confirmation"
          error={loginInfo.errors && loginInfo.errors.checkPassword}
        />
        <div className="mb-3">
          <label htmlFor="birthdayDate" className="mb-2">
            Birthday
          </label>
          <input
            type="date"
            className="form-control"
            id="birthdayDate"
            name="birthdayDate"
            value={loginInfo.account.birthdayDate || ""}
            onChange={handleChange}
          />
          {loginInfo.errors && loginInfo.errors.birthdayDate && (
            <div className="alert alert-danger">
              {loginInfo.errors.birthdayDate}
            </div>
          )}
        </div>
        <div className="d-grid">
          <button
            //disabled={validate()}
            className="btn btn-primary btn-login text-uppercase fw-bold"
            type="submit"
          >
            <FontAwesomeIcon icon="right-to-bracket" className="me-2" />
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
