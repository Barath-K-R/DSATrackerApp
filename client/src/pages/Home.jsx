import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';

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
import ToolBar from "../components/ToolBar.jsx";


const Home = () => {

  const [groupedView, setGroupedView] = useState(true)

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

  const queryClient = useQueryClient();

  // Fetch all problems using useQuery
  const { data: allProblems, isLoading: problemsLoading, isError: problemsError } = useQuery("problems", getAllProblems, {
    onSuccess: (data) => {

      const grouped = data.data.problems.reduce((acc, problem) => {
        const type = problem.type.name;
        if (!acc[type]) acc[type] = [];
        acc[type].push(problem);
        return acc;
      }, {});
      dispatch({ type: "SET_GROUPED_PROBLEMS", payload: grouped });
    }
  });

  const { data: allProblemTypes, isLoading: typesLoading, isError: typesError } = useQuery("problemTypes", getAllProblemsTypes, {
    onSuccess: (data) => {
      dispatch({ type: "SET_PROBLEM_TYPES", payload: data.data.problemTypes });
    }
  });

  const updateCompletionMutation = useMutation(updateIsCompleted, {
    onSuccess: (data, variables) => {
      const { problem, isCompleted } = variables;
      const updatedGrouped = {
        ...groupedProblems,
        [problem.type.name]: groupedProblems[problem.type.name].map((p) =>
          p._id === problem._id ? { ...p, isCompleted } : p
        ),
      };
      dispatch({ type: "SET_GROUPED_PROBLEMS", payload: updatedGrouped });
      dispatch({ type: "UPDATE_COMPLETION_STATUS", payload: { isCompleted, difficulty: problem.difficulty } });
    },
  });

  // Mutation for updating favourite status
  const updateFavouriteMutation = useMutation(updateIsFavourite, {
    onSuccess: (data, problem) => {
      const updatedGrouped = {
        ...groupedProblems,
        [problem.type.name]: groupedProblems[problem.type.name].map((p) =>
          p._id === problem._id ? { ...p, isFavourite: !p.isFavourite } : p
        ),
      };
      dispatch({ type: "SET_GROUPED_PROBLEMS", payload: updatedGrouped });
    },
  });

  // Mutation for moving problems
  const moveProblemMutation = useMutation(moveProblem, {
    onSuccess: (moveProblemResponseData) => {
      console.log('move problem data', moveProblemResponseData)
      const movedProblem = moveProblemResponseData.data.problem;
      const newType = moveProblemResponseData.data.movedProblemType;
      console.log(movedProblem._id, 'newtype=', newType, 'oldtype=', problemToMove.type.name)
      dispatch({
        type: "MOVE_PROBLEM",
        payload: { moveProblemId: movedProblem._id, newType, oldType: problemToMove.type.name },
      });
      toggleTypeSelectionModal();
    },
  });

  const handleTypeClick = (type) => {
    dispatch({ type: "SET_ACTIVE_TYPE", payload: activeType === type ? null : type });
  };

  const handleStatusClick = (problem) => {
    const isCompleted = !problem.isCompleted;
    updateCompletionMutation.mutate({ problem, isCompleted });
  };

  const handleStarClick = (problem) => {
    updateFavouriteMutation.mutate(problem);
  };

  const handleMoveProblem = (newType) => {
    const mutationPayload = { problemId: problemToMove._id, newType };
    console.log('mutation payload=', mutationPayload);
    moveProblemMutation.mutate(mutationPayload);
  };

  const calculateProblemCount = (typeName, groupedProblems) => {
    if (!groupedProblems[typeName]) {
      return '(0 / 0)';
    }
    const total = groupedProblems[typeName].length;
    const completed = groupedProblems[typeName].filter((problem) => problem.isCompleted).length;
    return `(${completed} / ${total})`;
  };

  if (problemsLoading || typesLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-white">
        <span>Loading...</span>
      </div>
    );
  }

  if (problemsError || typesError) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-white">
        <span>Error loading data</span>
      </div>
    );
  }

  return (
    <div className="flex bg-customDark font-semibold text-white w-full h-full gap-12 p-5">
      <MenuBar />

      <div className="w-9/12 flex flex-col justify-start items-center overflow-auto z-10">
        <ToolBar setGroupedView={setGroupedView} />
        {problemTypes.map((type) => (
          <>
            <div
              key={type._id}
              onClick={() => handleTypeClick(type.name)}
              className={`types-list cursor-pointer flex items-center w-full h-14 p-3 rounded-lg  ${groupedView && type.name===activeType?'bg-customDark border':groupedView ? 'bg-customGray border justify-center' : 'bg-customDark'} hover:bg-customDark z-10`}
            >
              {groupedView && <div className="groupedview-header flex justify-between items-center w-full">
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
              }

              {!groupedView && <div className="listview-header  w-full flex justify-center">
                <h1>{type.name}</h1>
              </div>}
            </div>

            {(!groupedView || activeType === type.name) && (
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
