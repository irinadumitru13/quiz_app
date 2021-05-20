import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import QuizList from "./QuizList";
import UserInfo from "./UserInfo";

import { getQuizzes } from "../api";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Home() {
  const classes = useStyles();

  const [cookie] = useCookies(["token", "session_info"]);

  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        let resp = await getQuizzes();
        setQuizzes(resp);
      } catch (e) {
        console.log(e.message);
      }
    }

    fetchQuizzes();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <UserInfo user={cookie.session_info} />
        </Grid>
        <Grid item xs={9}>
          <QuizList quizzes={quizzes} />
        </Grid>
      </Grid>
    </div>
  );
}
