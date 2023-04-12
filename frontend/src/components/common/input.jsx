import React, { Component } from "react";

const Input = ({ name, value, label, onChange, type, placeholder, error }) => {
  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        className="form-control"
        id={name}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        //ref={emailLogin}
      />
      <label htmlFor={name}>{label}</label>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
