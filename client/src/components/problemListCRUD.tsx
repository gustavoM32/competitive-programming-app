import {
  Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from "@mui/material";
import { useState } from "react";
import { ProblemListType } from "types"

import { useCreate, useDelete, useUpdateOne } from "hooks/crudHooks";
import { focusManager } from "@tanstack/react-query";
import { deleteResource } from "hooks/crud";

type ProblemListDialogProps = {
  title: string,
  problemList?: ProblemListType,
  actionName: string,
  actionFunc: (problemList: ProblemListType) => void,
}

// TODO: refactor this and problemCRUD

export function ProblemListDialog(props: ProblemListDialogProps) {
  const [problemList, setProblemList] = useState(props.problemList ?? {});
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setProblemList({ ...problemList, [e.target.name]: e.target.value });
  }

  const actionProblemList = async () => {
    await props.actionFunc(problemList);
    handleClose();
  }

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleOpen}>{props.title} </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" onChange={handleChange} fullWidth
            value={problemList.link ?? ''} name="link" label="Link" />

          <TextField margin="dense" onChange={handleChange} fullWidth
            value={problemList.name ?? ''} name="name" label="Name" />

          <TextField margin="dense" onChange={handleChange} fullWidth multiline
            value={problemList.description ?? ''} name="description" label="Description" />

          <TextField margin="dense" onChange={handleChange} fullWidth multiline
            value={problemList.notes ?? ''} name="notes" label="Notes" />

          <TextField margin="dense" onChange={handleChange} fullWidth
            value={problemList.solvedCount ?? ''} name="solvedCount" label="Solved count" />

          <TextField margin="dense" onChange={handleChange} fullWidth
            value={problemList.totalCount ?? ''} name="totalCount" label="Total count" />

          {/* TODO: add problems */}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">Cancel</Button>
          <Button onClick={actionProblemList} color="primary">{props.actionName}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function CreateProblemListDialog() {
  const addProblemList = useCreate("problemLists")

  return (
    <ProblemListDialog
      title="Add problem list"
      actionName="Add"
      actionFunc={addProblemList.mutate} />
  );
}

export function UpdateProblemListDialog(props: { problemList: ProblemListType; }) {
  const editProblemList = useUpdateOne(props.problemList._links.self.href)

  return (
    <ProblemListDialog
      title="Edit problem list"
      problemList={props.problemList}
      actionFunc={editProblemList.mutate}
      actionName="Save" />
  );
}

export function DeleteProblemListButton(props: { id: string }) {
  const deleteProblemList = useDelete("problemLists");

  const onDelClick = () => {
    focusManager.setFocused(false)
    const shouldDelete = window.confirm('Are you sure to delete?')
    
    if (shouldDelete) deleteProblemList.mutate(props.id)
    
    setTimeout(() => focusManager.setFocused(undefined), 0)
  }

  return (
    <Button variant="outlined" color="warning" onClick={onDelClick}>Delete</Button>
  );
}

export function DeleteProblemListButtonOne(props: { id: string }) {
  const onDelClick = () => {
    // the focus is disabled to prevent a refetch after the user confirms the deletion
    const shouldDelete = window.confirm('Are you sure to delete?')
    
    if (shouldDelete) {
      deleteResource(props.id)
        .then(() => {
          window.location.pathname = "/problemLists"
          
        })
        .catch((e) => console.error(e))
    }
  }

  return (
    <Button variant="outlined" color="warning" onClick={onDelClick}>Delete Problem List</Button>
  );
}
