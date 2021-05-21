import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";

import QuestionEditor from "./QuestionEditor";
import { getQuizById } from "../api";

export default function QuizEditor({ token, user }) {
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

    fetchQuizById(id);
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

  return <div>{generateQuestions()}</div>;
}
