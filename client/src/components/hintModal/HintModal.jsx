import React from "react";
import { IoMdClose } from "react-icons/io";
import "./HintModal.css";
const HintModal = ({ setModalOpened, problem }) => {
  return (
    <div className="hintmodal-container">
      <div className="close">
        <IoMdClose
          className="cross"
          color="black"
          onClick={()=>setModalOpened(prev=>!prev)}
        />
      </div>

      <div className="hintmodal-wrapper">
        <span>{problem.hint}</span>
      </div>
    </div>
  );
};

export default HintModal;
