import React from "react";
import { useCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import Quiz from "./Quiz";
import UserInfo from "./UserInfo";

const questions = [
  {
    text: "Care este sensul vietii?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Care nu este sensul vietii?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Mi-l bei?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Mi-l sugi?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Care este sensul vietii?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Care nu este sensul vietii?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Mi-l bei?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
  {
    text: "Mi-l sugi?",
    answers: ["da", "da da da otelul e viata mea", "n-avem"],
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Home() {
  const classes = useStyles();

  const [cookie] = useCookies(["token", "sessionInfo"]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <UserInfo />
        </Grid>
        <Grid item xs={9}>
          <Quiz questions={questions} />
        </Grid>
      </Grid>
    </div>
  );
}
