import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  padded: {
    padding: theme.spacing(4),
  },
  spread: {
    display: "flex",
    justifyContent: "space-evenly",
  },
}));

export default function DateTimePicker({ label, date, setDate }) {
  const classes = useStyles();

  const [currentDate, setCurrentDate] = useState(date);

  const handleDateChange = (date) => {
    setCurrentDate(date.toISOString());
    setDate(date.toISOString());
  };

  return (
    <Paper elevation={2} className={`${classes.padded} ${classes.spread}`}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          label={`${label} date`}
          value={currentDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          label={`${label} time`}
          value={currentDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
        />
      </MuiPickersUtilsProvider>
    </Paper>
  );
}
