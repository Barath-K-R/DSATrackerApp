import React, { useEffect, useState } from "react";
import axios from "axios";

import ProblemsList from "../porblemTable/ProblemsList";
import StatModal from "../statModal/StatModal";
import ProgressBar from "../progressBar/ProgressBar";

import { getAllTypes, getTypeproblems, getAllProblems,toFav,toComplete } from "../../api/api";
import { manageProblems } from "../../utils/ManageProblmes";
import "./Home.css";
import { calculatePercentage } from "../../utils/calculatePercentage";
const Home = () => {
  const [problems, setProblems] = useState(null);
  const [currproblems, setCurrProblems] = useState(null);
  const [types, setTypes] = useState([]);
  const [currType, setCurrType] = useState(null);
  const [checkBoxColor, setCheckBoxColor] = useState("#7a7a7a");
  const [starColor, setStarColor] = useState("");
  useEffect(() => {
    const getProblems = async () => {
      const allproblems = await getAllProblems();
      console.log(allproblems);
      setProblems(allproblems.data.problems);
      setTypes(() => allproblems.data.group);
    };
    getProblems();
  }, []);

  const handleTypeClick = async (type) => {
    setCurrType((prev) => {
      return prev ? null : type._id;
    });

    const typeproblems = await getTypeproblems(type._id);
    setCurrProblems(typeproblems.data);
  };
  const handleStatusClick =async(problem) => {
    setCurrProblems((prev) => {
      return prev.map((prob) => {
        console.log("-----------------------prob");

        if (prob.name === problem.name) {
          return { ...prob, isCompleted: !prob.isCompleted };
        } else return prob;
      });
    });
    const addfavourites=await toComplete(problem._id)
  };
  const handleStarClick =async(problem) => {
    console.log("handling star clikc");
    problem.isFavourite = !problem.isFavourite;
    setCurrProblems((prev) => {
      return prev.map((p) => {
        if (p.name === problem.name) return problem;
        else return p;
      }) 
    });
    await toFav(problem._id)
  };
  return (
    <div className="home-container">
      <div className="statmodal-container">
        <StatModal />
      </div>

      <div className="type-container">
        <h1>Problems</h1>
        <div className="typetable-wrapper">
          <table className="type-table">
            <tbody>
              {types.map((type) => {
                return (
                  <>
                    <tr
                      key={type}
                      className="type-title"
                      onClick={() => {
                        handleTypeClick(type);
                      }}
                    >
                      <td>
                        <h3>{type._id}</h3>
                      </td>
                      <td>
                        <h3>
                          ({type.completedProblems}/{type.totalProblems})
                        </h3>
                        <ProgressBar
                          color={"rgb(46, 188, 46)"}
                          width={calculatePercentage(
                            type.completedProblems,
                            type.totalProblems
                          )}
                          totalwidth={80}
                        />
                      </td>
                    </tr>
                    <tr className="type-list">
                      {currproblems && type._id === currType && (
                        <ProblemsList
                          currproblems={currproblems}
                          handleStatusClick={handleStatusClick}
                          handleStarClick={handleStarClick}
                        />
                      )}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
