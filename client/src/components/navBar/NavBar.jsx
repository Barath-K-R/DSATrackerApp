import React from "react";
import Header from "./header/Header.jsx";
import Footer from "./footer/footer.jsx";

import './NavBar.css'
const NavBar = ({ children }) => {
  return (
    <div className="navbar-container">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default NavBar;
