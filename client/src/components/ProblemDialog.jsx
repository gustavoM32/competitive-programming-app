import {
  Button, Dialog, DialogTitle, DialogContent, TextField, FormLabel, RadioGroup,
  FormControlLabel, Radio, DialogActions
} from "@mui/material";
import { useState } from "react";

export default function ProblemDialog(props) {
  const [problem, setProblem] = useState(props.problem ?? {});
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  }

  const actionProblem = async () => {
    await props.actionFunc(problem);
    handleClose();
  }

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleOpen}>{props.title} </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" onChange={handleChange} fullWidth
            value={problem.link ?? ''} name="link" label="Link" />
          <TextField margin="dense" onChange={handleChange} fullWidth
            value={problem.name ?? ''} name="name" label="Name" />

          <FormLabel>Status</FormLabel>
          <RadioGroup row
            name="problemStatus"
            value={problem.problemStatus ?? ''}
            onChange={handleChange}
          >
            <FormControlLabel value="NOTHING" control={<Radio />} label="Not read" />
            <FormControlLabel value="READ" control={<Radio />} label="Read before" />
            <FormControlLabel value="WA" control={<Radio />} label="WA" />
            <FormControlLabel value="AC" control={<Radio />} label="AC" />
          </RadioGroup>

          <FormLabel>Editorial</FormLabel>
          <RadioGroup row
            name="editorialStatus"
            value={problem.editorialStatus ?? ''}
            onChange={handleChange}
          >
            <FormControlLabel value="NOTHING" control={<Radio />} label="Not read" />
            <FormControlLabel value="READ_BEFORE_AC" control={<Radio />} label="Read before" />
            <FormControlLabel value="READ_AFTER_AC" control={<Radio />} label="Read after" />
          </RadioGroup>

          <TextField margin="dense" onChange={handleChange} fullWidth multiline
            value={problem.comments ?? ''} name="comments" label="Comments" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">Cancel</Button>
          <Button onClick={actionProblem} color="primary">{props.actionName}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
