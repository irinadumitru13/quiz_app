import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import QuizPreview from "./QuizPreview";
import { getQuizzes } from "../api";

export default function QuizList({ token, user }) {
  const [quizzes, setQuizzes] = useState([]);

  const history = useHistory();

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        let resp = await getQuizzes(token);
        setQuizzes(resp);
      } catch (e) {
        console.log(e.message);
      }
    }

    fetchQuizzes();
  }, [token]);

  const handleClick = (id) => {
    history.push(`/quiz/${id}`);
  };

  const generateGridItems = () => {
    return quizzes.map((quiz, idx) => {
      return (
        <Grid key={idx} item xs={3}>
          <QuizPreview
            quiz={quiz}
            canEdit={user.user_permissions >= 5}
            onClick={() => {
              handleClick(quiz.quiz_id);
            }}
          />
        </Grid>
      );
    });
  };

  return (
    <Grid container spacing={2}>
      {generateGridItems()}
    </Grid>
  );
}
