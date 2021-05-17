import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
    padding: theme.spacing(4),
  },
  answers: {
    margin: theme.spacing(4, 2, 0),
  },
}));

export default function Question({ text, answers, selection, setSelection }) {
  const classes = useStyles();

  const handleChange = (event) => {
    setSelection(event.target.value);
  };

  const generateAnswers = () => {
    return (
      <FormControl component="fieldset">
        <RadioGroup value={selection} onChange={handleChange}>
          {answers.map((answer, idx) => {
            return (
              <FormControlLabel
                key={idx}
                value={answer}
                control={<Radio />}
                label={answer}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    );
  };

  return (
    <Paper className={classes.margin}>
      <Typography component="h1" variant="h5">
        {text}
      </Typography>
      <div className={classes.answers}>{generateAnswers()}</div>
    </Paper>
  );
}
