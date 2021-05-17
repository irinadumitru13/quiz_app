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
  padded: {
    padding: theme.spacing(4),
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
    <Paper className={classes.padded}>
      <Typography component="h1" variant="h5">
        {text}
      </Typography>
      {generateAnswers()}
    </Paper>
  );
}
