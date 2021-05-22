import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";

import Question from "./Question";
import QuizSelections from "./QuizSelections";
import { getQuizById, submitQuiz } from "../api";

export default function Quiz({ token }) {
  const [selections, setSelections] = useState(undefined);
  const [quiz, setQuiz] = useState(undefined);

  let { id } = useParams();
  const history = useHistory();
  const alert = useAlert();

  useEffect(() => {
    async function fetchQuizById(id) {
      try {
        let resp = await getQuizById(token, id);
        setQuiz(resp);
        setSelections(new Array(resp.questions.length).fill(null));
      } catch (e) {
        console.log(e.message);
      }
    }

    fetchQuizById(id);
  }, [id, token]);

  const setSelection = (idx, newSelection) => {
    var newSelections = [...selections];
    newSelections[idx] = newSelection;
    setSelections(newSelections);
  };

  const handleSubmit = async () => {
    let score = 0;
    selections.forEach((selection, idx) => {
      quiz.questions[idx].answers.forEach((answer) => {
        if (answer.answer === selection && answer.is_correct) {
          score += answer.points;
        }
      });
    });

    try {
      await submitQuiz(token, quiz.quiz_name, score);
    } catch (e) {
      alert.show(e.message);
      return;
    }
    alert.show("quiz submitted!");
    history.push("/");
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
          <QuizSelections selections={selections} onSubmit={handleSubmit} />
        </Grid>
      </Grid>
    );
  };

  return <div>{generateQuestions()}</div>;
}
