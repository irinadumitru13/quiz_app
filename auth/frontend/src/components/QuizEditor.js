import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, TextField, Paper } from "@material-ui/core";
import { useParams } from "react-router-dom";

import QuestionEditor from "./QuestionEditor";
import { getQuizById } from "../api";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(4),
  },
}));

export default function QuizEditor({ token }) {
  const classes = useStyles();
  const [quiz, setQuiz] = useState(undefined);
  let { id } = useParams();

  useEffect(() => {
    async function fetchQuizById(id) {
      try {
        let resp = await getQuizById(token, id);
        setQuiz(resp);
      } catch (e) {
        console.log(e.message);
      }
    }

    if (id !== undefined) fetchQuizById(id);
    setQuiz({ quiz_name: "", questions: [] });
  }, [id, token]);

  const onQuestionChange = (questionId) => (question) => {
    let newQuiz = { ...quiz };
    newQuiz.questions[questionId].question = question;
    console.log(newQuiz);
    setQuiz(newQuiz);
  };

  const onAnswerChange = (questionId) => (answerId, answer) => {
    let newQuiz = { ...quiz };
    newQuiz.questions[questionId].answers[answerId] = answer;
    setQuiz(newQuiz);
  };

  const onAnswerRemove = (questionId) => (answerId) => {
    let newQuiz = { ...quiz };
    newQuiz.questions[questionId].answers.splice(answerId, 1);
    setQuiz(newQuiz);
  };

  const onAnswerAdd = (questionId) => () => {
    let newQuiz = { ...quiz };
    newQuiz.questions[questionId].answers.push({
      answer: "",
      is_correct: false,
      points: 0,
    });
    setQuiz(newQuiz);
  };

  const onAnswerFlip = (questionId) => (answerId, type) => {
    let newQuiz = { ...quiz };
    if (type) {
      newQuiz.questions[questionId].answers.forEach((answer) => {
        answer.is_correct = false;
      });
    }
    newQuiz.questions[questionId].answers[answerId].is_correct = type;
    setQuiz(newQuiz);
  };

  const onQuestionAdd = () => {
    let newQuiz = { ...quiz };
    newQuiz.questions.push({ question: "", answers: [] });
    setQuiz(newQuiz);
  };

  const onTitleChange = (title) => {
    let newQuiz = { ...quiz };
    newQuiz.quiz_name = title;
    setQuiz(newQuiz);
  };

  const generateQuestions = () => {
    if (quiz === undefined) {
      return <div>Loading...</div>;
    }

    return (
      <Grid container spacing={2} direction="column">
        {quiz.questions.map((question, idx) => {
          return (
            <Grid key={idx} item>
              <QuestionEditor
                text={question.question}
                answers={question.answers}
                setText={onQuestionChange(idx)}
                setAnswers={onAnswerChange(idx)}
                removeAnswer={onAnswerRemove(idx)}
                addAnswer={onAnswerAdd(idx)}
                flipAnswerType={onAnswerFlip(idx)}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  if (quiz === undefined) {
    return <div>Loading...</div>;
  }

  console.log(quiz);

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Paper elevation={2} className={classes.padded}>
          <TextField
            label="Quiz title"
            variant="outlined"
            defaultValue={quiz.quiz_name}
            onChange={(e) => onTitleChange(e.target.value)}
            fullWidth
          />
        </Paper>
      </Grid>
      <Grid item>{generateQuestions()}</Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={onQuestionAdd}>
          add question
        </Button>
      </Grid>
    </Grid>
  );
}
