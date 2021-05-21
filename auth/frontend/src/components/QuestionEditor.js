import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, TextField, Divider, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(4),
  },
}));

export default function QuestionEditor({
  text,
  answers,
  setText,
  setAnswers,
  removeAnswer,
  addAnswer,
}) {
  const classes = useStyles();

  const [currentAnswers, setCurrentAnswers] = useState(answers);

  const previousValueRef = useRef();
  const previousValue = previousValueRef.current;
  if (answers !== previousValue && answers !== currentAnswers) {
    setCurrentAnswers(answers);
  }

  useEffect(() => {
    previousValueRef.current = answers;
  }, [text, answers]);

  const onAnswerChange = (id) => (e) => {
    setAnswers(id, e.target.value);
  };

  const onAnswerRemove = (id) => () => {
    removeAnswer(id);
  };

  const onQuestionChange = (e) => {
    setText(e.target.value);
  };

  const generateAnswers = () => {
    return currentAnswers.map((answer, idx) => {
      return (
        <Grid key={idx} item className={classes.spread}>
          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item xs={8}>
              <TextField
                label={`Answer ${idx + 1}`}
                variant="outlined"
                defaultValue={answer.answer}
                onChange={onAnswerChange(idx)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label={`Points ${idx + 1}`}
                variant="outlined"
                defaultValue={answer.points}
                onChange={onAnswerChange(idx)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={onAnswerRemove(idx)}
                fullWidth
              >
                remove
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
    });
  };

  return (
    <Paper elevation={2} className={classes.padded}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <TextField
            label="Question"
            variant="outlined"
            defaultValue={text}
            onChange={onQuestionChange}
            fullWidth
          />
        </Grid>
        <Divider />
        {generateAnswers()}
        <Grid item>
          <Button variant="contained" color="primary" onClick={addAnswer}>
            add
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
