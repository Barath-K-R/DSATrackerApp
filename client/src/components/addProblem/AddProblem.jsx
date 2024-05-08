import React, { useEffect, useState } from "react";
import { getAllTypes, newProblem } from "../../api/api";
import "./AddProblem.css";
const AddProblem = () => {
  const [typesList, setTypesList] = useState([]);
  const [other, setother] = useState(false);
  const [formData, setformData] = useState({
    name: "",
    type: "",
    link: "",
    difficulty: "",
    hint: "",
    TimeComplexity: "",
    SpaceComplexity: "",
  });
  useEffect(() => {
    const getTypes = async () => {
      const types = await getAllTypes();

      setTypesList(types.data);
    };
    getTypes();
  }, []);

  const handleFormSubmit = async (e) => {
    setother(false);
    const newproblem = await newProblem(formData);
  };
  const handleChange = (e) => {
    setformData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  return (
    <div className="addproblem-container">
      <div className="addproblem-wrapper">
        <h1>Add a New Problem</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="input">
            <label htmlFor="">Name</label>
            <input type="text" name="name" onChange={handleChange} />
          </div>
          <div className="input">
            <label htmlFor="">Type</label>
            {other ? (
              <input type="text" name="type" onChange={handleChange} />
            ) : (
              <select
                name="type"
                onChange={(e) => {
                  if (e.target.value === "addnew") setother(true);
                  else handleChange(e);
                }}
              >
                <option value="" selected>
                  Choose the type
                </option>
                {typesList.map((type) => {
                  return <option value={type}>{type}</option>;
                })}
                <option value="addnew">Other</option>
              </select>
            )}
          </div>
          <div className="input">
            <label htmlFor="">Difficulty</label>
            <select name="difficulty" onChange={handleChange}>
              <option value="" selected>
                Choose difficulty
              </option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="input">
            <label htmlFor="">Link</label>
            <input type="text" name="link" onChange={handleChange} />
          </div>
          <div className="input">
            <label htmlFor="">Hint</label>
            <input type="text" name="hint" onChange={handleChange} />
          </div>
          <div className="input">
            <label htmlFor="">TimeComplexity</label>
            <input type="text" name="TimeComplexity" onChange={handleChange} />
          </div>
          <div className="input">
            <label htmlFor="">SpaceComplexity</label>
            <input type="text" name="SpaceComplexity" onChange={handleChange} />
          </div>
          <div className="button">
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
