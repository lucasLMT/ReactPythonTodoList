import React, { Component } from "react";

class Header extends Component {
  state = {};
  render() {
    return (
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Todos
          </a>
        </div>
      </nav>
    );
  }
}

export default Header;
