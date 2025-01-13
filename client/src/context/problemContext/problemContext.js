import React, { createContext, useReducer, useContext } from 'react';
import { problemReducer } from './problemReducer.js';

const ProblemContext = createContext();
const initialState = {
    groupedProblems: {},
    currentSolutions: [],
    problemTypes: [],
    activeType: null,
    problemToMove: null,
    stats:{}
  };
  
const ProblemProvider = ({ children }) => {
  const [state, dispatch] = useReducer(problemReducer, initialState);

  return (
    <ProblemContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProblemContext.Provider>
  );
};

const useProblemContext = () => {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error('useProblemContext must be used within a ProblemProvider');
  }
  return context;
};

export { ProblemProvider, useProblemContext };
