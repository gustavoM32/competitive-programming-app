import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { ProblemListType, ProblemType } from "types";
import {
  useCreateUserResource,
  useDelete,
  useReadList,
  useUpdateOne,
} from "hooks/crudHooks";
import { focusManager, useQueryClient } from "@tanstack/react-query";
import { createResource, deleteResource } from "api/crud";
import { API_URL } from "constants/constants";
import { CreateProblemAndAddToListButtonAndDialog } from "../problem/crud";
import { ProblemListDialog } from "./ProblemListDialog";
import { useDialogState } from "hooks/useDialogState";
import { getCfHandleFromStorage } from "utils/userUtils";

type OpenProblemListDialogButtonProps = {
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  children?: any;
};

export function OpenProblemListDialogButton(
  props: OpenProblemListDialogButtonProps
) {
  return (
    <Tooltip title={props.tooltip ?? ""}>
      <Button
        variant="outlined"
        color="primary"
        onClick={props.onClick}
        disabled={props.disabled ?? false}
      >
        {props.children}
      </Button>
    </Tooltip>
  );
}

type CreateProblemListButtonAndDialogProps = {
  disabled?: boolean;
};

export function CreateProblemListButtonAndDialog(
  props: CreateProblemListButtonAndDialogProps
) {
  const dialogState = useDialogState();
  const createProblemList = useCreateUserResource(["problemLists"]);

  return (
    <>
      <OpenProblemListDialogButton
        tooltip="Create problem list"
        onClick={() => dialogState.handleOpen({})}
        disabled={props.disabled}
      >
        Create
      </OpenProblemListDialogButton>
      <ProblemListDialog
        title="Create problem list"
        problemList={dialogState.data}
        setProblemList={dialogState.setData}
        open={dialogState.open}
        handleClose={dialogState.handleClose}
        actionName="Create"
        actionFunc={createProblemList}
      />
    </>
  );
}

export function UpdateProblemListButtonAndDialog(props: {
  problemList: ProblemListType;
}) {
  const dialogState = useDialogState();
  const editProblemList = useUpdateOne(props.problemList._links?.self?.href);

  return (
    <>
      <OpenProblemListDialogButton
        tooltip="Edit problem list"
        onClick={() => dialogState.handleOpen(props.problemList)}
      >
        Edit
      </OpenProblemListDialogButton>
      <ProblemListDialog
        title="Edit problem list"
        problemList={dialogState.data}
        setProblemList={dialogState.setData}
        open={dialogState.open}
        handleClose={dialogState.handleClose}
        actionName="Save"
        actionFunc={editProblemList}
      />
    </>
  );
}

export function DeleteProblemListButton(props: { id: string }) {
  const deleteProblemList = useDelete();

  const onDelClick = () => {
    focusManager.setFocused(false);
    const shouldDelete = window.confirm("Are you sure to delete?");

    if (shouldDelete) deleteProblemList(props.id);

    setTimeout(() => focusManager.setFocused(undefined), 0);
  };

  return (
    <Tooltip title="Delete problem list">
      <Button variant="outlined" color="error" onClick={onDelClick}>
        Delete
      </Button>
    </Tooltip>
  );
}

export function DeleteProblemListButtonOne(props: { id: string }) {
  const onDelClick = () => {
    const shouldDelete = window.confirm("Are you sure to delete?");

    if (shouldDelete) {
      deleteResource(props.id)
        .then(() => {
          window.location.pathname = "/problemLists";
        })
        .catch((e) => console.error(e));
    }
  };

  return (
    <Tooltip title="Delete problem list">
      <Button variant="outlined" color="error" onClick={onDelClick}>
        Delete problem list
      </Button>
    </Tooltip>
  );
}

export function AddProblemToListDialog(props: {
  problemList: ProblemListType;
}) {
  const [open, setOpen] = useState(false);
  const [problemURI, setProblemURI] = useState("");
  const loggedInUser = getCfHandleFromStorage();

  const allProblemsKey =
    loggedInUser.length > 0 ? ["problems", "search", "findByCreatedBy"] : [];

  const { resources: allProblems } = useReadList(allProblemsKey, {
    user: loggedInUser,
  });
  const { problemList } = props;
  const queryClient = useQueryClient();

  const problemsKey =
    problemList?.id !== undefined
      ? ["problemLists", `${problemList.id}`, "problems"]
      : [];
  const problemsData = useReadList(problemsKey);

  // FIXME: this doesn't look so good...
  if (problemsData.isLoading) return <p>Loading...</p>;
  if (problemsData.error || !problemsData.data) {
    console.error(problemsData.error);
    return <p>Error: check console</p>;
  }

  const { resources: listProblems } = problemsData.data;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: SelectChangeEvent) => {
    setProblemURI(e.target.value as string);
  };

  const addProblemToList = async () => {
    const problemListProblems = problemList._links.problems.href;
    createResource(problemListProblems, problemURI, {
      headers: { "Content-Type": "text/uri-list" },
    }).then(() => {
      queryClient.invalidateQueries();
      handleClose();
    });
  };

  const problemsIdsInList = listProblems.map((p: ProblemType) => p.id);
  const filteredProblems = allProblems.filter(
    (p: ProblemType) => !problemsIdsInList.includes(p.id)
  );

  return (
    <>
      <Tooltip title="Add existing problem to list">
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          Add problem
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle id="form-dialog-title">Add problem</DialogTitle>
        <DialogContent>
          <InputLabel id="demo-simple-select-label">Problem</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={problemURI}
            label="Problem"
            fullWidth
            onChange={handleChange}
          >
            {filteredProblems.map((p: ProblemType) => {
              return (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              );
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">
            Cancel
          </Button>
          <Button onClick={addProblemToList} color="primary">
            Add selected
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function AddNewProblemToListDialog(props: {
  problemList: ProblemListType;
}) {
  const queryClient = useQueryClient();
  const loggedInUser = getCfHandleFromStorage();
  const { problemList } = props;

  const addNewProblemToList = async (newProblem: ProblemType) => {
    const uri = `${API_URL}/problems`; // FIXME: API_URL should not be used here
    const createdProblem = await createResource(uri, {
      ...newProblem,
      createdBy: loggedInUser,
    }); // FIXME: This should be refactored.

    const problemListProblems = problemList._links.problems.href;
    const newProblemURI = createdProblem._links.self.href;

    await createResource(problemListProblems, newProblemURI, {
      headers: { "Content-Type": "text/uri-list" },
    });
    queryClient.invalidateQueries();
  };

  return (
    <CreateProblemAndAddToListButtonAndDialog
      actionFunc={addNewProblemToList}
    />
  );
}

export function RemoveProblemFromListButton(props: {
  problemList: ProblemListType;
  problemId: string;
}) {
  const { problemList, problemId } = props;
  const queryClient = useQueryClient();

  const deleteProblemFromList = () => {
    const shouldDelete = window.confirm("Are you sure to delete?");

    if (shouldDelete) {
      deleteResource(`${problemList._links.problems.href}/${problemId}`).then(
        () => {
          queryClient.invalidateQueries([
            "problemLists",
            `${problemList.id}`,
            "problems",
          ]);
        }
      );
    }
  };

  return (
    <Tooltip title="Remove problem from list">
      <Button
        variant="outlined"
        color="warning"
        onClick={deleteProblemFromList}
      >
        Remove
      </Button>
    </Tooltip>
  );
}
