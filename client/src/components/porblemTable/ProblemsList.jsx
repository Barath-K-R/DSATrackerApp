import React, { useState } from "react";

import { AiFillStar } from "react-icons/ai";
import { GoCheck } from "react-icons/go";

import HintModal from "../hintModal/HintModal";
import "./ProblemsList.css";
const ProblemsList = ({ currproblems, handleStatusClick, handleStarClick }) => {
  const [ModalOpened, setModalOpened] = useState(false);
  return (
    <div className="problemslist-container">
      <table className="problem-table">
        <thead>
          <tr className="table-row">
            <th>Status</th>
            <th>Star</th>
            <th>Problem</th>
            <th>Difficulty</th>
            <th>Hint</th>
            <th>TC</th>
            <th>SC</th>
          </tr>
        </thead>
        <tbody>
          {currproblems.map((problem) => {
            return (
              <tr
                className="table-row"
                style={{
                  backgroundColor: problem.isCompleted
                    ? "(0, 128, 0,0.5)"
                    : "transparent",
                }}
              >
                <td>
                  <div
                    className="tick-container"
                    onClick={() => {
                      handleStatusClick(problem);
                    }}
                  >
                    {problem.isCompleted && <GoCheck className="tick-icon" />}
                  </div>
                </td>
                <td>
                  <AiFillStar
                    className="star"
                    size={22}
                    color={problem.isFavourite ? "orange" : "white"}
                    onClick={() => handleStarClick(problem)}
                  />
                </td>
                <td>
                  <a
                    className="table-text"
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {problem.name}
                  </a>
                </td>
                <td>{problem.difficulty}</td>
                <td>
                  <button onClick={()=>setModalOpened(prev=>!prev)}>click to View</button>
                  {console.log(ModalOpened)}
                  {ModalOpened && <HintModal setModalOpened={setModalOpened} problem={problem}/>}
                </td>
                <td>{problem.TimeComplexity}</td>
                <td>{problem.SpaceComplexity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemsList;
