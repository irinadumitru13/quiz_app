import React, { useState } from "react";

import Question from "./Question";

export default function Quiz({ questions }) {
  const [selections, setSelections] = useState(new Array(questions.length));

  const setSelection = (idx, newSelection) => {
    var newSelections = selections;
    newSelections[idx] = newSelection;
    setSelections(newSelections);
  };

  const generateQuestions = () => {
    return questions.map((question, idx) => {
      return (
        <Question
          key={idx}
          text={question.text}
          answers={question.answers}
          selection={selections[idx]}
          setSelection={(selection) => {
            setSelection(idx, selection);
          }}
        />
      );
    });
  };

  return <div>{generateQuestions()}</div>;
}
