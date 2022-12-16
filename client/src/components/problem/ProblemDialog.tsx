import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
} from "@mui/material";
import { ProblemType } from "types";

export type ProblemDialogProps = {
  title: string;
  problem: ProblemType;
  setProblem: (problem: ProblemType) => void;
  open: boolean;
  handleClose: () => void;
  actionName: string;
  actionFunc: (problem: ProblemType) => void;
};

export function ProblemDialog(props: ProblemDialogProps) {
  const { problem, setProblem, open, handleClose } = props;

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const actionProblem = async () => {
    await props.actionFunc(problem);
    handleClose();
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            onChange={handleChange}
            fullWidth
            value={problem.name ?? ""}
            name="name"
            label="Name"
          />
          <TextField
            margin="dense"
            onChange={handleChange}
            fullWidth
            value={problem.link ?? ""}
            name="link"
            label="Link"
          />

          <FormLabel>Status</FormLabel>
          <RadioGroup
            row
            name="problemStatus"
            value={problem.problemStatus ?? ""}
            onChange={handleChange}
          >
            <FormControlLabel
              value="NOTHING"
              control={<Radio />}
              label="Not read"
            />
            <FormControlLabel value="READ" control={<Radio />} label="Read" />
            <FormControlLabel value="WA" control={<Radio />} label="WA" />
            <FormControlLabel value="AC" control={<Radio />} label="AC" />
          </RadioGroup>

          <FormLabel>Editorial</FormLabel>
          <RadioGroup
            row
            name="editorialStatus"
            value={problem.editorialStatus ?? ""}
            onChange={handleChange}
          >
            <FormControlLabel
              value="NOTHING"
              control={<Radio />}
              label="Not read"
            />
            <FormControlLabel
              value="READ_BEFORE_AC"
              control={<Radio />}
              label="Read before"
            />
            <FormControlLabel
              value="READ_AFTER_AC"
              control={<Radio />}
              label="Read after"
            />
          </RadioGroup>

          <TextField
            margin="dense"
            onChange={handleChange}
            fullWidth
            multiline
            value={problem.comments ?? ""}
            name="comments"
            label="Comments"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">
            Cancel
          </Button>
          <Button onClick={actionProblem} color="primary">
            {props.actionName}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
