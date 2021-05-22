import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, TextField, Paper } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";

import QuestionEditor from "./QuestionEditor";
import DateTimePicker from "./DateTimePicker";
import {
  getQuizById,
  postQuiz,
  putQuiz,
  postQuestion,
  deleteQuestion,
  postAnswer,
  deleteAnswer,
} from "../api";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(4),
  },
}));

export default function QuizEditor({ token }) {
  const classes = useStyles();
  const [quiz, setQuiz] = useState(undefined);
  const [refresh, setRefresh] = useState(true);

  let { id } = useParams();
  const alert = useAlert();

  useEffect(() => {
    async function fetchQuizById(id) {
      try {
        let resp = await getQuizById(token, id);
        setQuiz(resp);
      } catch (e) {
        alert.show(e.message);
      }
    }

    if (id !== undefined) {
      fetchQuizById(id);
    } else {
      let now = new Date();
      setQuiz({
        quiz_name: "",
        questions: [],
        start_date: now.toISOString(),
        due_date: now.toISOString(),
        allocated_time: 1,
      });
    }
  }, [id, token, alert]);

  const onQuestionChange = (questionId) => (question) => {
    let newQuiz = { ...quiz };
    newQuiz.questions[questionId].question = question;
    console.log(newQuiz);
    setQuiz(newQuiz);
  };

  const onAnswerChange = (questionId) => (answerId, answer) => {
    let newQuiz = { ...quiz };
    newQuiz.questions[questionId].answers[answerId].answer = answer;
    setQuiz(newQuiz);
  };

  const onPointsChange = (questionId) => (answerId, points) => {
    let newQuiz = { ...quiz };
    newQuiz.questions[questionId].answers[answerId].points = points;
    setQuiz(newQuiz);
  };

  const onAnswerRemove = (questionId) => async (answerId) => {
    if (id !== undefined) {
      try {
        await deleteAnswer(
          token,
          parseInt(quiz.questions[questionId].answers[answerId].answer_id)
        );
      } catch (e) {
        alert.show(e.message);
        return;
      }
    }

    let newQuiz = { ...quiz };
    newQuiz.questions[questionId].answers.splice(answerId, 1);
    setQuiz(newQuiz);
    setRefresh(!refresh);
  };

  const onAnswerAdd = (questionId) => async () => {
    let newQuiz = { ...quiz };
    let newAnswer = {
      answer: "Dummy answer",
      is_correct: false,
      points: 0,
    };

    if (id !== undefined) {
      try {
        let answerId = await postAnswer(
          token,
          parseInt(quiz.questions[questionId].question_id),
          newAnswer
        );
        newAnswer.answer_id = answerId;
      } catch (e) {
        alert.show(e.message);
        return;
      }
    }

    newQuiz.questions[questionId].answers.push(newAnswer);
    setQuiz(newQuiz);
    setRefresh(!refresh);
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
    setRefresh(!refresh);
  };

  const onQuestionAdd = async () => {
    let newQuiz = { ...quiz };
    let newQuestion = {
      question: "New question",
      answers: [
        {
          answer: "Dummy answer",
          is_correct: false,
          points: 0,
        },
      ],
    };

    if (id !== undefined) {
      try {
        let questionId = await postQuestion(token, parseInt(id), newQuestion);
        newQuestion.question_id = questionId;
      } catch (e) {
        alert.show(e.message);
        return;
      }
    }

    newQuiz.questions.push(newQuestion);
    setQuiz(newQuiz);
    setRefresh(!refresh);
  };

  const onQuestionRemove = (questionId) => async () => {
    if (id !== undefined) {
      try {
        await deleteQuestion(token, quiz.questions[questionId].question_id);
      } catch (e) {
        alert.show(e.message);
        return;
      }
    }

    let newQuiz = { ...quiz };
    newQuiz.questions.splice(questionId, 1);
    setQuiz(newQuiz);
    setRefresh(!refresh);
  };

  const onTitleChange = (title) => {
    let newQuiz = { ...quiz };
    newQuiz.quiz_name = title;
    setQuiz(newQuiz);
    setRefresh(!refresh);
  };

  const onStartDateChange = (date) => {
    let newQuiz = { ...quiz };
    newQuiz.start_date = date;
    setQuiz(newQuiz);
  };

  const onDueDateChange = (date) => {
    let newQuiz = { ...quiz };
    newQuiz.due_date = date;
    setQuiz(newQuiz);
  };

  const createQuiz = async () => {
    let start = new Date(quiz.start_date).getTime();
    let due = new Date(quiz.due_date).getTime();

    if (start >= due) {
      alert.show("start date must be before due date");
      return;
    }

    if (id !== undefined) {
      try {
        await putQuiz(token, quiz);
        alert.show("Quiz updated!");
      } catch (e) {
        alert.show(e.message);
      }
    } else {
      try {
        await postQuiz(token, quiz);
        alert.show("Quiz created!");
      } catch (e) {
        alert.show(e.message);
      }
    }
  };

  const generateQuestions = () => {
    if (quiz === undefined) {
      return <div>Loading...</div>;
    }

    return (
      <Grid container spacing={2} direction="column">
        {quiz.questions.map((question, idx) => {
          return (
            <Grid key={`${idx} ${refresh}`} item>
              <QuestionEditor
                text={question.question}
                answers={question.answers}
                setText={onQuestionChange(idx)}
                setAnswers={onAnswerChange(idx)}
                setPoints={onPointsChange(idx)}
                removeAnswer={onAnswerRemove(idx)}
                flipAnswerType={onAnswerFlip(idx)}
                addAnswer={onAnswerAdd(idx)}
                removeQuestion={onQuestionRemove(idx)}
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
      <Grid item>
        <DateTimePicker
          label="Start"
          date={quiz.start_date}
          setDate={onStartDateChange}
        />
      </Grid>
      <Grid item>
        <DateTimePicker
          label="Due"
          date={quiz.due_date}
          setDate={onDueDateChange}
        />
      </Grid>
      <Grid item>{generateQuestions()}</Grid>
      <Grid item>
        <Grid container justify="space-between">
          <Grid item>
            <Button variant="contained" color="primary" onClick={onQuestionAdd}>
              add question
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="default" onClick={createQuiz}>
              submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
