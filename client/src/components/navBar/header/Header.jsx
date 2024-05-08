import React from "react";
import { BiHome } from "react-icons/bi";
import { DiAptana } from "react-icons/di";
import { CgAdd } from "react-icons/cg";

import { useNavigate } from "react-router-dom";
import "./Header.css";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="header-container">
      <div className="header-title">
        <img src="/images/logo2.png" alt="" />
        <h2>DSA Tracker App</h2>
      </div>
      <div className="header-menus">
        <CgAdd
          size={30}
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/add");
          }}
        />
        <DiAptana size={30} />
        <BiHome size={30} style={{cursor:'pointer'}} onClick={()=>{
          navigate('/')
        }}/>
      </div>
    </div>
  );
};

export default Header;
