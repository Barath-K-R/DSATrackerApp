import React, { useEffect, useState } from "react";
import ProgressBar from "../progressBar/ProgressBar";
import { getStatCount } from "../../api/api.js";
import { calculatePercentage } from "../../utils/calculatePercentage.js";
import "./StatModal.css";
const StatModal = () => {
  const [easy, setEasy] = useState({});
  const [medium, setmedium] = useState({});
  const [hard, setHard] = useState({});
  useEffect(() => {
    const getStats = async () => {
      const res = await getStatCount();
      console.log(res.data);
      setEasy(() => {
        return res.data.find((item) => item._id === "easy");
      });
      setmedium(() => {
        return res.data.find((item) => item._id === "medium");
      });
      setHard(() => {
        return res.data.find((item) => item._id === "hard");
      });
    };
    getStats();
  }, []);

  return (
    <div className="statmodal-wrapper">
      <h2>Stats</h2>
      <div className="statmodal-easy">
        <div className="stats">
          <span>Easy</span>
          <span>
            {easy?.completed} / {easy?.total}
          </span>
        </div>
        <ProgressBar
          color={"rgb(46, 188, 46)"}
          width={calculatePercentage(easy?.completed, easy?.total)}
          totalwidth={100}
        />
      </div>
      <div className="statmodal-medium">
        <div className="stats">
          <span>Medium</span>
          <span>
            {medium?.completed} / {medium?.total}
          </span>
        </div>
        <ProgressBar
          color={"orange"}
          width={calculatePercentage(medium?.completed, medium?.total)}
          totalwidth={100}
        />
      </div>
      <div className="statmodal-hard">
        <div className="stats">
          <span>Hard</span>
          <span>
            {hard?.completed} / {hard?.total}
          </span>
        </div>
        <ProgressBar
          color={"rgb(236, 50, 50)"}
          width={calculatePercentage(hard?.completed, hard?.total)}
          totalwidth={100}
        />
      </div>
    </div>
  );
};

export default StatModal;
