import { Button, Tooltip } from "@mui/material";
import { ProblemType } from "types";

import { useCreate, useUpdate, useDelete } from "hooks/crudHooks";
import { focusManager } from "@tanstack/react-query";
import { DialogState, useDialogState } from "hooks/useDialogState";
import { ProblemDialog } from "./ProblemDialog";
import { Resource } from "api/types";

type OpenProblemDialogButtonProps = {
  tooltip: string;
  onClick: () => void;
  children?: any;
};

export function OpenProblemDialogButton(props: OpenProblemDialogButtonProps) {
  return (
    <Tooltip title={props.tooltip ?? ""}>
      <Button variant="outlined" color="primary" onClick={props.onClick}>
        {props.children}
      </Button>
    </Tooltip>
  );
}

type ProblemButtonAndDialogProps = {
  buttonText: string;
  buttonTooltip: string;
  dialogTitle: string;
  dialogConfirmButtonText: string;
  actionFunc: (newResource: Resource) => Promise<void>;
};

export function ProblemButtonAndDialog(props: ProblemButtonAndDialogProps) {
  const dialogState = useDialogState();

  return (
    <>
      <OpenProblemDialogButton
        tooltip={props.buttonTooltip}
        onClick={() => dialogState.handleOpen({})}
      >
        {props.buttonText}
      </OpenProblemDialogButton>
      <ProblemDialog
        title={props.dialogTitle}
        problem={dialogState.data}
        setProblem={dialogState.setData}
        open={dialogState.open}
        handleClose={dialogState.handleClose}
        actionName={props.dialogConfirmButtonText}
        actionFunc={props.actionFunc}
      />
    </>
  );
}

export function CreateProblemButtonAndDialog() {
  const dialogState = useDialogState();
  const addProblem = useCreate("problems");

  return (
    <>
      <OpenProblemDialogButton
        tooltip="Create problem"
        onClick={() => dialogState.handleOpen({})}
      >
        Create
      </OpenProblemDialogButton>
      <ProblemDialog
        title="Create problem"
        problem={dialogState.data}
        setProblem={dialogState.setData}
        open={dialogState.open}
        handleClose={dialogState.handleClose}
        actionName="Create"
        actionFunc={addProblem}
      />
    </>
  );
}

type CreateProblemAndAddToListButtonAndDialogProps = {
  actionFunc: (newResource: Resource) => Promise<void>;
};

export function CreateProblemAndAddToListButtonAndDialog(
  props: CreateProblemAndAddToListButtonAndDialogProps
) {
  const dialogState = useDialogState();

  return (
    <>
      <OpenProblemDialogButton
        tooltip="Create problem and add it to list"
        onClick={() => dialogState.handleOpen({})}
      >
        Create and add
      </OpenProblemDialogButton>
      <ProblemDialog
        title="Create problem"
        problem={dialogState.data}
        setProblem={dialogState.setData}
        open={dialogState.open}
        handleClose={dialogState.handleClose}
        actionName="Create and add to list"
        actionFunc={props.actionFunc}
      />
    </>
  );
}

type UpdateProblemButtonProps = {
  dialogState: DialogState;
  problem: ProblemType;
};

export function UpdateProblemButton(props: UpdateProblemButtonProps) {
  return (
    <OpenProblemDialogButton
      tooltip="Edit problem"
      onClick={() => props.dialogState.handleOpen(props.problem)}
    >
      Edit
    </OpenProblemDialogButton>
  );
}

type UpdateProblemDialogProps = {
  dialogState: DialogState;
};

export function UpdateProblemDialog(props: UpdateProblemDialogProps) {
  const editProblem = useUpdate();
  const dialogState = props.dialogState;

  return (
    <ProblemDialog
      title="Edit problem"
      problem={dialogState.data}
      setProblem={dialogState.setData}
      open={dialogState.open}
      handleClose={dialogState.handleClose}
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
