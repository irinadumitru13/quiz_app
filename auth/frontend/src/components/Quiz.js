import React, { useState } from "react";
import { Grid } from "@material-ui/core";

import Question from "./Question";
import QuizSelections from "./QuizSelections";

export default function Quiz({ questions }) {
  const [selections, setSelections] = useState(
    new Array(questions.length).fill("")
  );
  const [refresh, setRefresh] = useState(false);

  const setSelection = (idx, newSelection) => {
    var newSelections = selections;
    newSelections[idx] = newSelection;
    console.log(newSelections);
    setSelections(newSelections);
    setRefresh(!refresh);
  };

  const generateQuestions = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Grid container spacing={2} direction="column">
            {questions.map((question, idx) => {
              return (
                <Grid key={idx} item>
                  <Question
                    key={idx}
                    text={idx + ". " + question.text}
                    answers={question.answers}
                    selection={selections[idx]}
                    setSelection={(selection) => {
                      setSelection(idx, selection);
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <QuizSelections selections={selections} refresh={refresh} />
        </Grid>
      </Grid>
    );
  };

  return <div>{generateQuestions()}</div>;
}
