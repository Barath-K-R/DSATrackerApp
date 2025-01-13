import React, { useState } from 'react';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useModalContext } from '../context/modalContext/modalContext.js';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    toggleCreateProblemModal,
    toggleCreateProblemTypeModal,
    toggleCreateSolutionModal,
  } = useModalContext();

  return (
    <div className="relative">
      <div className="bg-customGray h-14 w-full flex justify-between items-center p-2 px-4">
        <h1 className="text-white text-2xl">DSA Tracker App</h1>
        <AiOutlinePlusCircle
          color="white"
          size={26}
          className="cursor-pointer"
          onClick={toggleCreateProblemModal}
        />
      </div>
    </div>
  );
};

export default Header;
