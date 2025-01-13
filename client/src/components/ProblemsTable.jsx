import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { AiFillStar } from "react-icons/ai";
import { GoCheck } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { BsArrowUpRight } from "react-icons/bs";
import { BsCameraVideoFill } from "react-icons/bs";

import { deleteProblem } from '../api/problemApi.js';
import { useModalContext } from '../context/modalContext/modalContext.js';
import { useProblemContext } from '../context/problemContext/problemContext.js';

const ProblemsTable = ({ type, handleStarClick, handleStatusClick }) => {
    const { groupedProblems, activeType, dispatch } = useProblemContext();
    const { toggleTypeSelectionModal } = useModalContext();

    const handleRemoveProblem = async (problem) => {
        await deleteProblem(problem._id);
        dispatch({
            type: "REMOVE_PROBLEM",
            payload: { problemId: problem._id, type: problem.type.name },
        });
        dispatch({ type: "UPDATE_STATS_TOTAL_COUNT", payload: { difficulty: problem.difficulty, operation: -1 } })

    };

    return (
        <div className={`table-div w-full overflow-hidden transform transition-all duration-500 ease-in-out 
        ${activeType === type.name ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} z-10`}>
            <table className="problem-table w-full text-white bg-customGray rounded-lg text-left">
                <thead>
                    <tr className="border h-12 border-gray-200">
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-center">Star</th>
                        <th className="px-4 py-2 text-start">Problem Name</th>
                        <th className="px-4 py-2 text-center">Difficulty</th>
                        <th className="px-4 py-2 text-center">Solution</th>
                    </tr>
                </thead>
                <tbody>
                    {groupedProblems[activeType] && groupedProblems[activeType].map((problem) => (
                        <tr
                            key={problem._id}
                            className={`table-row border h-12 ${problem.isCompleted ? 'bg-[#214b52]' : 'bg-customGray'} border-gray-200`}
                        >
                            <td className="status">
                                <div className="status-container flex justify-center items-center">
                                    <div
                                        className={`tick w-5 h-5 flex justify-center items-center ${problem.isCompleted ? 'bg-green-500' : 'border border-gray-200'} rounded-md cursor-pointer`}
                                        onClick={() => handleStatusClick(problem)}
                                    >
                                        {problem.isCompleted && <GoCheck className="tick-icon glow" color="white" size={19} />}
                                    </div>
                                </div>

                            </td>
                            <td>
                                <div className="star-container flex justify-center">
                                    <AiFillStar
                                        className="star"
                                        size={22}
                                        color={problem.isFavourite ? "orange" : "white"}
                                        style={{
                                            stroke: "orange",
                                            strokeWidth: 2,
                                        }}
                                        onClick={() => handleStarClick(problem)}
                                    />
                                </div>

                            </td>
                            <td>
                                <a
                                    className="table-text flex justify-start px-4"
                                    href={problem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {problem.name}
                                </a>
                            </td>
                            <td>
                                <div className="difficulty-container flex justify-center">
                                    <span className={`${problem.difficulty === "Easy"
                                        ? "text-easy"
                                        : problem.difficulty === "Medium"
                                            ? "text-medium"
                                            : "text-hard"
                                        }`}>{problem.difficulty}</span>
                                </div>
                            </td>
                            <td className="cursor-pointer">
                                <div className="solution flex justify-center">
                                    <Link to={`/solution/${problem.name}`} className="solution-link">
                                        <BsCameraVideoFill />
                                    </Link>
                                </div>

                            </td>
                            <td>
                                <div
                                    className="settings flex justify-center items-center w-6 h-6 hover:bg-customDark rounded-md cursor-pointer"
                                    onClick={() => handleRemoveProblem(problem)}
                                >
                                    <AiFillMinusCircle color="#e93b20" />
                                </div>
                            </td>
                            <td>
                                <div
                                    className="settings flex justify-center items-center w-6 h-6 hover:bg-customDark rounded-md cursor-pointer"
                                    onClick={() => {
                                        toggleTypeSelectionModal();
                                        console.log("Setting problem to move:", problem);
                                        dispatch({ type: 'SET_PROBLEM_TO_MOVE', payload: problem });
                                    }}
                                >
                                    <BsArrowUpRight />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )
}

export default ProblemsTable