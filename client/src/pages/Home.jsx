import React, { useEffect, useState } from "react";


import MenuBar from '../components/MenuBar.jsx';
import ProgressBar from "../components/ProgressBar.jsx";
import CreateProblemModal from "../components/CreateProblemModal.jsx";
import CreateProblemTypeModal from "../components/CreateProblemTypeModal.jsx";
import CreateSolutionModal from "../components/CreateSolutionModal.jsx";
import ProblemsTable from "../components/ProblemsTable.jsx";
import TypeSelectionModal from "../components/TypeSelectionModal.jsx";

import { useModalContext } from "../context/modalContext/modalContext.js";
import { useProblemContext } from "../context/problemContext/problemContext.js";
import { getAllProblems, getAllProblemsTypes, updateIsCompleted, updateIsFavourite, moveProblem } from "../api/problemApi.js";
import { calculatePercentage } from "../utils/calculatePercentage.js";


const Home = () => {

  const { groupedProblems, activeType, problemTypes, problemToMove, dispatch } = useProblemContext();

  const {
    isCreateProblemModalOpen,
    isCreateProblemTypeModalOpen,
    isCreateSolutionModalOpen,
    isTypeSelectionModalOpen,
    toggleCreateProblemModal,
    toggleCreateProblemTypeModal,
    toggleCreateSolutionModal,
    toggleTypeSelectionModal
  } = useModalContext();

  useEffect(() => {
    const fetchProblems = async () => {
      const allProblems = await getAllProblems();

      const grouped = allProblems.data.problems.reduce((acc, problem) => {
        const type = problem.type.name;
        if (!acc[type]) acc[type] = [];
        acc[type].push(problem);
        return acc;
      }, {});
      console.log(grouped)
      dispatch({ type: "SET_GROUPED_PROBLEMS", payload: grouped })

    };

    const fetchProblemTypes = async () => {
      const allProblemTypesResponse = await getAllProblemsTypes();
      dispatch({ type: "SET_PROBLEM_TYPES", payload: allProblemTypesResponse.data.problemTypes })
    };

    fetchProblems();
    fetchProblemTypes();
  }, []);

  const handleTypeClick = (type) => {
    dispatch({ type: "SET_ACTIVE_TYPE", payload: activeType === type ? null : type })
  };

  const handleStatusClick = async (problem) => {
    console.log(groupedProblems)
    let isCompleted;
    const updatedGrouped = {
      ...groupedProblems,
      [problem.type.name]: groupedProblems[problem.type.name].map((p) => {

        if (p._id === problem._id) {
          isCompleted = !p.isCompleted
          return { ...p, isCompleted: !p.isCompleted };
        }
        else
          return p;
      }
      )
    };
    await updateIsCompleted(problem._id);
    dispatch({ type: "SET_GROUPED_PROBLEMS", payload: updatedGrouped });
    dispatch({ type: "UPDATE_COMPLETION_STATUS", payload: { isCompleted, difficulty: problem.difficulty } })
  };


  const handleStarClick = async (problem) => {
    const updatedGrouped = {
      ...groupedProblems,
      [problem.type.name]: groupedProblems[problem.type.name].map((p) =>
        p._id === problem._id
          ? { ...p, isFavourite: !p.isFavourite }
          : p
      )
    };
    const completedUpdateResponse = await updateIsFavourite(problem._id)
    dispatch({ type: "SET_GROUPED_PROBLEMS", payload: updatedGrouped });
  };

  const handleMoveProblem = async (newType) => {
    console.log(problemToMove.type)
    const moveProblemResponse = await moveProblem(problemToMove._id, newType);
    dispatch({
      type: "MOVE_PROBLEM",
      payload: { moveProblemId: problemToMove._id, newType, oldType: problemToMove.type.name },
    });
    toggleTypeSelectionModal();
  };

  const calculateProblemCount = (typeName, groupedProblems) => {
    if (!groupedProblems[typeName]) {
      return '(0 / 0)';
    }
    const total = groupedProblems[typeName].length;
    const completed = groupedProblems[typeName].filter((problem) => problem.isCompleted).length;
    return `(${completed} / ${total})`;
  };

  return (
    <div className="flex bg-customDark font-semibold text-white w-full h-full gap-12 p-5">
      <MenuBar />

      <div className="w-9/12 flex flex-col justify-start items-center overflow-auto z-10">
        {problemTypes.map((type) => (
          <>
            <div
              key={type._id}
              onClick={() => handleTypeClick(type.name)}
              className={`types-list cursor-pointer flex justify-between items-center w-full h-14 p-3 rounded-lg border bg-customGray hover:bg-customDark ${activeType === type.name ? 'bg-customDark' : ''} z-10`}
            >
              <h3 className="text-xl">{type.name}</h3>
              <div className="progress-div flex items-center w-3/6 gap-4">
                <div className="problem-count flex justify-center items-center w-1/6">
                  <span>{calculateProblemCount(type.name, groupedProblems)}</span>
                </div>
                <div className="w-5/6">
                  <ProgressBar
                    color="easy"
                    width={calculatePercentage(type.name, groupedProblems)}
                    totalwidth={100}
                  />
                </div>
              </div>

            </div>
            {activeType === type.name && (
              <ProblemsTable type={type} handleStarClick={handleStarClick} handleStatusClick={handleStatusClick} />
            )}
          </>
        ))}
      </div>

      {isTypeSelectionModalOpen && <TypeSelectionModal handleMoveProblem={handleMoveProblem} toggleTypeSelectionModal={toggleTypeSelectionModal} />}
      {/* Modals */}
      <CreateProblemModal
        isOpen={isCreateProblemModalOpen}
        onClose={toggleCreateProblemModal}
      />
      <CreateProblemTypeModal
        isOpen={isCreateProblemTypeModalOpen}
        onClose={toggleCreateProblemTypeModal}
      />
      <CreateSolutionModal
        isOpen={isCreateSolutionModalOpen}
        onClose={toggleCreateSolutionModal}
      />
    </div>
  );
};

export default Home;
