

export const problemReducer = (state, action) => {
  switch (action.type) {
    case "SET_GROUPED_PROBLEMS":
      return {
        ...state,
        groupedProblems: action.payload,
      };

    case "SET_CURRENT_SOLUTIONS":
      return {
        ...state,
        currentSolutions: action.payload,
      };
    case "DELETE_SOLUTION":
      return {
        ...state,
        currentSolutions: state.currentSolutions.filter(solution => solution._id !== action.payload)
      }
    case "SET_PROBLEM_TYPES":
      return {
        ...state,
        problemTypes: action.payload,
      };

    case "SET_ACTIVE_TYPE":
      return {
        ...state,
        activeType: action.payload,
      };

    case "REMOVE_PROBLEM":
      const { problemId, type } = action.payload;

      if (!state.groupedProblems[type]) return state;

      return {
        ...state,
        groupedProblems: {
          ...state.groupedProblems,
          [type]: state.groupedProblems[type].filter(
            (problem) => problem._id !== problemId
          ),
        },
      };

      case "MOVE_PROBLEM":
    
        const { moveProblemId, newType, oldType } = action.payload;
  
        const groupedCopy = JSON.parse(JSON.stringify(state.groupedProblems));
      
        groupedCopy[oldType] = groupedCopy[oldType].filter(
          (problem) => problem._id !== moveProblemId
        );

        if (!groupedCopy[newType]) groupedCopy[newType] = [];
      
 
        const movingProblem = state.groupedProblems[oldType].find(
          (problem) => problem._id === moveProblemId
        );
      
        if (movingProblem) {
        
          const problemCopy = { ...movingProblem, type: { ...movingProblem.type } };
          problemCopy.type.name = newType;
      
          groupedCopy[newType].push(problemCopy);
        }
      
        return {
          ...state,
          groupedProblems: groupedCopy,
        };
      
    case 'SET_PROBLEM_TO_MOVE':
      return {
        ...state,
        problemToMove: action.payload,
      };
    case "SET_PROBLEM_STATS":
      return {
        ...state,
        stats: action.payload,
      }
      case "UPDATE_STATS_TOTAL_COUNT":
        const { difficulty, operation } = action.payload;
 
        return {
          ...state,
          stats: {
            ...state.stats,
            [difficulty.toLowerCase()]: {
              ...state.stats[difficulty.toLowerCase()],
              total: state.stats[difficulty.toLowerCase()].total + operation,
            },
          },
        };
      
      case "UPDATE_COMPLETION_STATUS":
      const { isCompleted, difficulty: diff } = action.payload;

      const currentStats = state.stats[diff.toLowerCase()];
      const completionAdjustment = isCompleted ? 1 : -1; 

      return {
        ...state,
        stats: {
          ...state.stats,
          [diff.toLowerCase()]: {
            ...currentStats,
            completed: currentStats.completed + completionAdjustment,
          },
        },
      }
    default:
      return state;
  }
};
