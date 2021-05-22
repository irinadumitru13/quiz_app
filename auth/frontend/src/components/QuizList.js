import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import QuizPreview from "./QuizPreview";
import { getQuizzes } from "../api";

const useStyles = makeStyles((theme) => ({
  padded: {
    paddingRight: theme.spacing(4),
  },
}));

const priority = {
  open: 3,
  ended: 2,
};

export default function QuizList({ token, user }) {
  const classes = useStyles();
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
    return quizzes
      .sort((a, b) => {
        if (priority[a.status] > priority[b.status]) return -1;
        if (a.due_date < b.due_date) return -1;
        return 0;
      })
      .map((quiz, idx) => {
        return (
          <Grid key={idx} item xs={3}>
            <QuizPreview
              quiz={quiz}
              canEdit={user.user_permissions >= 5}
              onQuizClick={() => {
                handleClick(quiz.quiz_id);
              }}
            />
          </Grid>
        );
      });
  };

  return (
    <Grid container spacing={2} className={classes.padded}>
      {generateGridItems()}
    </Grid>
  );
}
