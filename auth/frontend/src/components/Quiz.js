import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";

import Question from "./Question";
import QuizSelections from "./QuizSelections";
import { getQuizById } from "../api";

export default function Quiz() {
  const [selections, setSelections] = useState(undefined);
  const [quiz, setQuiz] = useState(undefined);
  let { id } = useParams();

  useEffect(() => {
    async function fetchQuizById(id) {
      try {
        let resp = await getQuizById(id);
        setQuiz(resp);
        setSelections(new Array(resp.questions.length).fill(""));
      } catch (e) {
        console.log(e.message);
      }
    }

    fetchQuizById(id);
  }, [id]);

  const setSelection = (idx, newSelection) => {
    var newSelections = [...selections];
    newSelections[idx] = newSelection;
    setSelections(newSelections);
  };

  const generateQuestions = () => {
    if (quiz === undefined || selections === undefined) {
      return <div>Loading...</div>;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Grid container spacing={2} direction="column">
            {quiz.questions.map((question, idx) => {
              return (
                <Grid key={idx} item>
                  <Question
                    key={idx}
                    text={idx + ". " + question.question}
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
          <QuizSelections selections={selections} />
        </Grid>
      </Grid>
    );
  };

  return <div>{generateQuestions()}</div>;
}
