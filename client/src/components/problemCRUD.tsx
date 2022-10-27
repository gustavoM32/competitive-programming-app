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
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { ProblemType } from "types";

import { useCreate, useUpdate, useDelete } from "hooks/crudHooks";
import { focusManager } from "@tanstack/react-query";

type ProblemDialogProps = {
  title: string;
  tooltip?: string;
  problem?: ProblemType;
  actionName: string;
  actionFunc: (problem: ProblemType) => void;
};

export function ProblemDialog(props: ProblemDialogProps) {
  const [problem, setProblem] = useState(props.problem ?? {});
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const actionProblem = async () => {
    await props.actionFunc(problem);
    handleClose();
  };

  return (
    <>
      <Tooltip title={props.tooltip ?? ""}>
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          {props.title}{" "}
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            onChange={handleChange}
            fullWidth
            value={problem.name ?? ""}
            name="name"
            label="Name"
          />
          <TextField
            autoFocus
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
            <FormControlLabel
              value="READ"
              control={<Radio />}
              label="Read before"
            />
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

export function CreateProblemDialog() {
  const addProblem = useCreate("problems");

  return (
    <ProblemDialog
      title="Create"
      tooltip="Create problem"
      actionName="Create"
      actionFunc={addProblem}
    />
  );
}

export function UpdateProblemDialog(props: { problem: ProblemType }) {
  const editProblem = useUpdate();

  return (
    <ProblemDialog
      title="Edit"
      tooltip="Edit problem"
      problem={props.problem}
      actionFunc={editProblem}
      actionName="Save"
    />
  );
}

export function DeleteProblemButton(props: { id: string }) {
  const deleteProblem = useDelete();

  const onDelClick = () => {
    // the focus is disabled to prevent a refetch after the user confirms the deletion
    focusManager.setFocused(false);
    const shouldDelete = window.confirm("Are you sure to delete?");

    if (shouldDelete) deleteProblem(props.id);

    // it is re-enabled after the mutation is called
    setTimeout(() => focusManager.setFocused(undefined), 0);
  };

  return (
    <Tooltip title="Delete problem">
      <Button variant="outlined" color="error" onClick={onDelClick}>
        Delete
      </Button>
    </Tooltip>
  );
}
