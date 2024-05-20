import React, { useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import java from 'highlight.js/lib/languages/java';
import "./codeModal.css";
const CodeModal = ({ problem, setCodeModalOpened }) => {
    useEffect(() => {
        hljs.highlightAll();
    }, []);
    hljs.registerLanguage('java', java);
  return (
    <div className="code-container">
      <div className="code-wrapper">
        <div className="close">
          <IoMdClose
            className="cross"
            color="white"
            onClick={() => setCodeModalOpened((prev) => !prev)}
          />
        </div>

        <pre>
          <code>{problem.code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeModal;
