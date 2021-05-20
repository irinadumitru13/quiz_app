import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";

import QuizPreview from "./QuizPreview";

export default function QuizList({ quizzes }) {
  const [currentQuizzes, setCurrentQuizzes] = useState(quizzes);

  useEffect(() => {
    setCurrentQuizzes(quizzes);
  }, [quizzes]);

  const generateGridItems = () => {
    return currentQuizzes.map((quiz, idx) => {
      return (
        <Grid key={idx} item xs={3}>
          <QuizPreview quizTitle={quiz.quiz_name} status={quiz.status} />
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
