import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SubmissionPreview from "./SubmissionPreview";

const useStyles = makeStyles((theme) => ({
  padded: {
    paddingRight: theme.spacing(4),
  },
  elementPadded: {
    padding: theme.spacing(2),
    height: "100%",
  },
}));

export default function SubmissionList({ submissions }) {
  const classes = useStyles();

  const generateGridItems = () => {
    if (submissions.length === 0) {
      return (
        <Grid item xs={12}>
          <Paper elevation={2} className={classes.elementPadded}>
            <Typography>No submissions</Typography>
          </Paper>
        </Grid>
      );
    }
    return submissions
      .sort((a, b) => {
        if (a.time_stamp > b.time_stamp) return -1;
        return 0;
      })
      .map((submission, idx) => {
        return (
          <Grid key={idx} item xs={3}>
            <SubmissionPreview submission={submission} />
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
