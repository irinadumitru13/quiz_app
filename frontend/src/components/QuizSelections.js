import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(3),
  },
  notSelected: {
    color: "black",
  },
  selected: {
    backgroundColor: "#c0c0c0",
  },
  questionStatus: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "thin",
  },
}));

export default function QuizSelections({ selections, onSubmit }) {
  const classes = useStyles();
  const [currentSelections, setCurrentSelections] = useState(selections);

  useEffect(() => {
    setCurrentSelections(selections);
  }, [selections]);

  const getSelections = () => {
    return currentSelections.map((selection, idx) => {
      let className =
        selection === null
          ? `${classes.questionStatus} ${classes.notSelected}`
          : `${classes.questionStatus} ${classes.selected}`;

      return (
        <Grid key={idx} item>
          <p className={className}>{idx}</p>
        </Grid>
      );
    });
  };

  return (
    <Paper elevation={2} className={classes.padded}>
      <Typography component="h1" variant="h6">
        Answered questions:
      </Typography>
      <Grid container spacing={1}>
        {getSelections()}
      </Grid>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Paper>
  );
}
